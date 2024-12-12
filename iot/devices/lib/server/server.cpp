#include "server.h"

void printBody(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
{
    std::string json = "";

    for (size_t i = 0; i < len; i++)
        json += static_cast<char>(data[i]);

    Serial.print(index);
    Serial.print(" ");
    Serial.print(total);
    Serial.print(" ");
    Serial.println(json.c_str());
}

Homelab::ServerClass *Homelab::ServerClass::instance = NULL;

Homelab::ServerClass *Homelab::ServerClass::getInstance()
{
    if (instance == NULL)
        instance = new Homelab::ServerClass();
    return instance;
}

Homelab::ServerClass::ServerClass()
{
    this->initialiseDocsSchema();
    this->httpClient = new AsyncWebServer(80);
    this->reportsSocketClient = new AsyncWebSocket("/reports");
    this->logsSocketClient = new AsyncWebSocket("/logs");
    this->loggerMiddleware = new AsyncMiddlewareFunction(
        [](AsyncWebServerRequest *request, ArMiddlewareNext next)
        {
            char id[7];
            for (uint8_t i = 0; i < 7; i++)
                sprintf(id + i, "%x", rand() % 16);

            unsigned long start = millis();
            const String url = request->url();
            std::string ip = Homelab::rawIPAddressToString(request->client()->remoteIP());
            Homelab::Logger::infof("[%s] %s %s - IP: %s\n", id, request->methodToString(), request->url().c_str(), ip.c_str());

            next();

            Homelab::Logger::infof("[%s] %d - %lums\n", id, request->getResponse()->code(), millis() - start);
        });
}

void Homelab::ServerClass::BAD_REQUEST(AsyncWebServerRequest *request)
{
    request->send(400, "application/json", "{\"error\":\"Bad Request\"}");
}

void Homelab::ServerClass::BAD_UPLOAD(AsyncWebServerRequest *request, const String &filename, size_t index, uint8_t *data, size_t len, bool final)
{
    request->send(400, "application/json", "{\"error\":\"Bad Request\"}");
}

void Homelab::ServerClass::BAD_BODY(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
{
    request->send(400, "application/json", "{\"error\":\"Bad Request\"}");
}

void Homelab::ServerClass::NOT_FOUND(AsyncWebServerRequest *request)
{
    request->send(404, "application/json", "{\"error\":\"Route not found\"}");
}

void Homelab::ServerClass::rootResponse(AsyncWebServerRequest *request)
{
    if (FILE_SYSTEM.exists("/index.html"))
    {
        request->send(FILE_SYSTEM, "/index.html");
    }
    else
    {
        Homelab::Logger::error("root path requested with no index.html present");
        Homelab::ServerClass::listFS();
        request->send(500, "application/json", "{\"error\":\"Internal error\"}");
    }
}

void Homelab::ServerClass::pingResponse(AsyncWebServerRequest *request)
{
    request->send(200, "application/json", "{\"ping\":\"pong\"}");
}

void Homelab::ServerClass::deviceResponse(AsyncWebServerRequest *request)
{
    AsyncJsonResponse *response = new AsyncJsonResponse();
    JsonVariant &root = response->getRoot();
    JsonObject json = root.as<JsonObject>();

    std::optional<std::string> ip = Homelab::Wifi->getIP();
    std::optional<std::string> mac = Homelab::Wifi->getMAC();
    std::optional<std::string> ssid = Homelab::Wifi->getSSID();
    std::optional<Homelab::WifiStrength_t> strength = Homelab::Wifi->getStrength();

    if (ip.has_value())
        json["ip"] = ip.value();
    if (mac.has_value())
        json["mac"] = mac.value();
    if (ssid.has_value())
        json["ssid"] = ssid.value();
    if (strength.has_value())
        json["strength"] = Homelab::serialiseStrength(strength.value());
    if (Homelab::NTP->getIsConnected())
    {
        json["datetime"] = Homelab::getIsoTimestamp();
        json["startTimestamp"] = Homelab::NTP->startTimestamp.value();
        json["startTimestampOffset"] = Homelab::NTP->startTimestampOffset.value();
    }

    response->setLength();
    request->send(response);
}

void Homelab::ServerClass::docsSchemaResponse(AsyncWebServerRequest *request)
{
    AsyncResponseStream *response = request->beginResponseStream("application/json");
    serializeJson(this->docsSchema, *response);
    request->send(response);
}

void Homelab::ServerClass::sourceResponse(AsyncWebServerRequest *request)
{
    std::string id = request->url().c_str();
    std::string schemaPath = "/schema";
    bool isSchemaPath = false;

    // remove initial /
    id.erase(0, 1);

    if (
        id.size() > schemaPath.size() &&
        std::equal(schemaPath.rbegin(), schemaPath.rend(), id.rbegin()))
    {
        Homelab::string::replaceAll(id, schemaPath, "");
        isSchemaPath = true;
    }

    if (this->sources.find(id) == this->sources.end())
        return Homelab::ServerClass::NOT_FOUND(request);

    AsyncJsonResponse *response = new AsyncJsonResponse();
    JsonVariant &root = response->getRoot();

    if (isSchemaPath)
        this->sourcesSchema[id](root);
    else
        this->sources[id](root);

    response->setLength();
    request->send(response);
}

void Homelab::ServerClass::sourcesResponse(AsyncWebServerRequest *request)
{
    AsyncJsonResponse *response = new AsyncJsonResponse(true);
    JsonVariant &root = response->getRoot();
    JsonArray array = root.to<JsonArray>();

    for (auto const &keyValuePair : this->sources)
        array.add(keyValuePair.first);

    response->setLength();
    request->send(response);
}

void Homelab::ServerClass::receiveResponse(AsyncWebServerRequest *request, JsonVariant &json)
{
    std::string id = request->url().c_str();

    // remove initial /
    id.erase(0, 1);

    if (this->sinks.find(id) == this->sinks.end())
        return Homelab::ServerClass::NOT_FOUND(request);

    this->sinks[id](json);
    request->send(202);
}

void Homelab::ServerClass::logsSocketEventHandler(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
    AwsFrameInfo *info = reinterpret_cast<AwsFrameInfo *>(arg);
    std::string ip = Homelab::rawIPAddressToString(client->remoteIP());

    switch (type)
    {
    case WS_EVT_CONNECT:
        Homelab::Logger::infof("Client connected to logs websocket from IP: %s\n", ip.c_str());
        break;
    case WS_EVT_DISCONNECT:
        Homelab::Logger::infof("Client disconnected from logs websocket from IP: %s\n", ip.c_str());
        break;
    case WS_EVT_PONG:
        break;
    case WS_EVT_ERROR:
        Homelab::Logger::infof("Client errored on logs websocket from IP: %s\n", ip.c_str());
        break;
    case WS_EVT_DATA:
        if (info->opcode == WS_TEXT)
        {
            if (info->final && info->index == 0 && info->len == len)
            {
                data[len] = 0;
                Homelab::Logger::infof("%s sent text data to logs websocket, skipping...\n", ip.c_str());
                Homelab::Logger::info((char *)data);
            }
            else
            {
                Homelab::Logger::infof(
                    "%s sent multi-packet text data to logs websocket, skipping...\n", ip.c_str());
            }
        }
        else
        {
            Homelab::Logger::infof("%s sent binary data to logs websocket, skipping...\n", ip.c_str());
        }
        break;
    default:
        Homelab::Logger::info("Unhandled websocket event type recieved on logs websocket...");
    }
};

void Homelab::ServerClass::reportsSocketEventHandler(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
    AwsFrameInfo *info = reinterpret_cast<AwsFrameInfo *>(arg);
    std::string ip = Homelab::rawIPAddressToString(client->remoteIP());

    switch (type)
    {
    case WS_EVT_CONNECT:
        Homelab::Logger::infof("Client connected to reports websocket from IP: %s\n", ip.c_str());
        break;
    case WS_EVT_DISCONNECT:
        Homelab::Logger::infof("Client disconnected from reports websocket from IP: %s\n", ip.c_str());
        break;
    case WS_EVT_PONG:
        break;
    case WS_EVT_ERROR:
        Homelab::Logger::infof("Client errored on reports websocket from IP: %s\n", ip.c_str());
        break;
    case WS_EVT_DATA:
        if (info->opcode == WS_TEXT)
        {
            if (info->final && info->index == 0 && info->len == len)
            {
                data[len] = 0;
                Homelab::Logger::infof("%s sent text data to reports websocket, skipping...\n", ip.c_str());
                Homelab::Logger::info((char *)data);
            }
            else
            {
                Homelab::Logger::infof(
                    "%s sent multi-packet text data to reports websocket, skipping...\n", ip.c_str());
            }
        }
        else
        {
            Homelab::Logger::infof("%s sent binary data to reports websocket, skipping...\n", ip.c_str());
        }
        break;
    default:
        Homelab::Logger::info("Unhandled websocket event type recieved on reports websocket...");
    }
};

void Homelab::ServerClass::sendReport(std::string report)
{
    this->reportsSocketClient->textAll(report.c_str());
};

void Homelab::ServerClass::sendLog(std::string log)
{
    Homelab::string::replaceAll(log, "\n", " ");
    Homelab::string::trim(log);
    this->logsSocketClient->textAll(log.c_str());
};

void Homelab::ServerClass::initialiseDocsSchema()
{
    docsSchema["openapi"] = "3.1.0";

    JsonObject info = docsSchema["info"].to<JsonObject>();

    info["title"] = HOSTNAME " (" IP_ADDRESS ")";
    info["host"] = IP_ADDRESS;

    JsonArray schemes = docsSchema["schemes"].to<JsonArray>();

    schemes.add("http");

    JsonObject paths = docsSchema["paths"].to<JsonObject>();

    JsonObject sourcesPath = paths["/sources"].to<JsonObject>();

    JsonObject sourcesGet = sourcesPath["get"].to<JsonObject>();

    sourcesGet["summary"] = "List ids of attached sources";

    JsonArray sourcesProduces = sourcesGet["produces"].to<JsonArray>();

    sourcesProduces.add("application/json");

    JsonObject sourcesResponses = sourcesGet["responses"].to<JsonObject>();

    JsonObject sources200Response = sourcesResponses["200"].to<JsonObject>();

    JsonObject sources200ResponseContent = sources200Response["content"].to<JsonObject>();
    JsonObject sources200ResponseJson = sources200ResponseContent["application/json"].to<JsonObject>();
    JsonObject sources200ResponseSchema = sources200ResponseJson["schema"].to<JsonObject>();

    sources200ResponseSchema["type"] = "array";

    JsonObject sources200ResponseSchemaItems = sources200ResponseSchema["items"].to<JsonObject>();

    sources200ResponseSchemaItems["type"] = "string";
}

void Homelab::ServerClass::setup()
{
    Homelab::Logger::info("Starting file system.");
    FILE_SYSTEM.begin();
    Homelab::Logger::info("Starting http & websocket server.");
    this->reportsSocketClient->onEvent(Homelab::ServerClass::reportsSocketEventHandler);
    this->logsSocketClient->onEvent(Homelab::ServerClass::logsSocketEventHandler);

    Homelab::Logger::sendLog = [this](std::string log)
    { return Homelab::ServerClass::sendLog(log); };

    DefaultHeaders::Instance().addHeader("Cache-Control", "no-cache");
    this->httpClient->addMiddleware(this->loggerMiddleware);
    this->httpClient->addHandler(Homelab::ServerClass::reportsSocketClient);
    this->httpClient->addHandler(Homelab::ServerClass::logsSocketClient);
    this->httpClient->on("/", HTTP_GET, Homelab::ServerClass::rootResponse);
    this->httpClient->on("/ping", HTTP_GET, Homelab::ServerClass::pingResponse);
    this->httpClient->on("/device", HTTP_GET, Homelab::ServerClass::deviceResponse);
    this->httpClient->on(
        "/docs/schema",
        HTTP_GET,
        [this](AsyncWebServerRequest *request)
        { return Homelab::ServerClass::docsSchemaResponse(request); });
    this->httpClient->on(
        "/sources",
        HTTP_GET,
        [this](AsyncWebServerRequest *request)
        { return Homelab::ServerClass::sourcesResponse(request); });
    this->httpClient->serveStatic("/", FILE_SYSTEM, "/");
    this->httpClient->onNotFound(Homelab::ServerClass::NOT_FOUND);

    Homelab::Server->addSource(
        Homelab::Wifi->getId(),
        [](JsonVariant &json)
        { return Homelab::Wifi->getJsonValue(json); },
        [](JsonVariant &json)
        { return Homelab::Wifi->getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        Homelab::Wifi->getId() + "/config",
        [](JsonVariant &json)
        { return Homelab::Wifi->getConfigureJsonValue(json); },
        [](JsonVariant &json)
        { return Homelab::Wifi->getConfigureJsonSchemaValue(json); });
    Homelab::Server->addSource(
        Homelab::NTP->getId(),
        [](JsonVariant &json)
        { return Homelab::NTP->getJsonValue(json); },
        [](JsonVariant &json)
        { return Homelab::NTP->getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        Homelab::NTP->getId() + "/config",
        [](JsonVariant &json)
        { return Homelab::NTP->getConfigureJsonValue(json); },
        [](JsonVariant &json)
        { return Homelab::NTP->getConfigureJsonSchemaValue(json); });

    this->httpClient->begin();
}

void Homelab::ServerClass::addSource(std::string id, Homelab::GetJsonValue_t getValue, std::optional<Homelab::GetSchemaValue_t> schema)
{
    std::string path = "/" + id;
    this->sources[id] = getValue;
    this->sourcesSchema[id] = schema.has_value() ? schema.value() : [](JsonVariant &json) {};
    this->httpClient->on(
        path.c_str(),
        HTTP_GET,
        [this](AsyncWebServerRequest *request)
        { return Homelab::ServerClass::sourceResponse(request); });
};

void Homelab::ServerClass::addSink(std::string id, Homelab::ReceiveJsonValue_t receiveValue, std::optional<Homelab::GetSchemaValue_t> schema)
{
    std::string path = "/" + id;
    this->sinks[id] = receiveValue;
    this->sinksSchema[id] = schema.has_value() ? schema.value() : [](JsonVariant &json) {};

    AsyncCallbackJsonWebHandler *handler = new AsyncCallbackJsonWebHandler(
        "/rest/endpoint",
        [this](AsyncWebServerRequest *request, JsonVariant &json)
        { this->receiveResponse(request, json); });

    handler->setMethod(HTTP_POST);

    this->httpClient->addHandler(handler);
};

void Homelab::ServerClass::listFS()
{
    Homelab::ServerClass::listDir("/");
}

void Homelab::ServerClass::listDir(const char *path)
{
    File root = FILE_SYSTEM.open("/", "r");

    if (!root)
    {
        Homelab::Logger::error("- failed to open directory");
        return;
    }
    if (!root.isDirectory())
    {
        Homelab::Logger::error(" - not a directory");
        return;
    }

    uint16_t fileCount = 0;
    uint16_t dirCount = 0;

    File file = root.openNextFile();
    while (file)
    {
        if (file.isDirectory())
        {
            dirCount += 1;
            Homelab::Logger::infof("---- DIR: %s ----\n", file.name());
            Homelab::ServerClass::listDir(file.fullName());
            Homelab::Logger::info("--------");
        }
        else
        {
            fileCount += 1;
            Homelab::Logger::infof("%s - SIZE: %d", file.name(), file.size());
        }

        file = root.openNextFile();
    }

    Homelab::Logger::infof("%d files in %d sub-directories\n", fileCount, dirCount);
};

Homelab::ServerClass *Homelab::Server = Homelab::ServerClass::getInstance();
