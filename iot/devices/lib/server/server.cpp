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
    this->httpClient = new AsyncWebServer(80);
    this->reportsSocketClient = new AsyncWebSocket("/reports");
    this->logsSocketClient = new AsyncWebSocket("/logs");
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
    AsyncWebServerResponse *response = request->beginResponse(SPIFFS, "/index.html");
    request->send(response);
}

void Homelab::ServerClass::pingResponse(AsyncWebServerRequest *request)
{
    AsyncWebServerResponse *response = request->beginResponse(SPIFFS, "/index.html");
    request->send(200, "application/json", "{\"ping\":\"pong\"}");
}

void Homelab::ServerClass::sourceResponse(AsyncWebServerRequest *request)
{
    std::string id = request->url().c_str();

    // remove initial /
    id.erase(0, 1);

    if (this->sources.find(id) == this->sources.end())
        return Homelab::ServerClass::NOT_FOUND(request);

    request->send(200, "application/json", this->sources[id]().c_str());
}

void Homelab::ServerClass::sourcesResponse(AsyncWebServerRequest *request)
{
    std::string configSuffix = "/config";
    std::string json = "{";

    for (auto const &keyValuePair : this->sources)
    {
        std::string id = keyValuePair.first;
        Homelab::GetJsonValue_t getValue = keyValuePair.second;

        if (id.size() > configSuffix.size() && std::equal(configSuffix.rbegin(), configSuffix.rend(), id.rbegin()))
            continue;

        json += "\"" + id + "\":";
        json += getValue();
        json += ",";
    }

    json.pop_back();

    json += "}";
    request->send(200, "application/json", json.c_str());
}

void Homelab::ServerClass::sourcesSchemaResponse(AsyncWebServerRequest *request)
{
    std::string json = "{";

    for (auto const &keyValuePair : this->sourcesSchema)
    {
        std::string id = keyValuePair.first;
        Homelab::GetSchemaValue_t getValue = keyValuePair.second;

        json += "\"" + id + "\":";
        json += getValue();
        json += ",";
    }

    json.pop_back();

    json += "}";
    request->send(200, "application/json", json.c_str());
}

void Homelab::ServerClass::receiveResponse(AsyncWebServerRequest *request)
{
    request->send(202);
}

void Homelab::ServerClass::receiveBodyHandler(AsyncWebServerRequest *request, unsigned char *data, size_t len, size_t index, size_t total)
{
    for (size_t i = 0; i < len; i++)
        this->bodyBuffer += static_cast<char>(data[i]);

    if (index + len + 1 >= total)
    {
        std::string id = request->url().c_str();

        // remove initial /
        id.erase(0, 1);

        if (this->sinks.find(id) == this->sinks.end())
            return Homelab::ServerClass::NOT_FOUND(request);

        this->sinks[id](this->bodyBuffer);
        this->bodyBuffer = "";
    }
}

void Homelab::ServerClass::receiversSchemaResponse(AsyncWebServerRequest *request)
{
    std::string json = "{";

    for (auto const &keyValuePair : this->sinksSchema)
    {
        std::string id = keyValuePair.first;
        Homelab::GetSchemaValue_t getValue = keyValuePair.second;

        json += "\"" + id + "\":";
        json += getValue();
        json += ",";
    }

    json.pop_back();

    json += "}";
    request->send(200, "application/json", json.c_str());
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

void Homelab::ServerClass::setup()
{
    Homelab::Logger::info("Starting filesystem.");
    SPIFFS.begin();
    Homelab::Logger::info("Starting http & websocket server.");
    this->reportsSocketClient->onEvent(Homelab::ServerClass::reportsSocketEventHandler);
    this->logsSocketClient->onEvent(Homelab::ServerClass::logsSocketEventHandler);

    Homelab::Logger::sendLog = [this](std::string log)
    { return Homelab::ServerClass::sendLog(log); };

    DefaultHeaders::Instance().addHeader("Cache-Control", "no-cache");
    this->httpClient->addHandler(Homelab::ServerClass::reportsSocketClient);
    this->httpClient->addHandler(Homelab::ServerClass::logsSocketClient);
    this->httpClient->on("/", HTTP_GET, Homelab::ServerClass::rootResponse);
    this->httpClient->on("/ping", HTTP_GET, Homelab::ServerClass::pingResponse);
    this->httpClient->on(
        "/sources",
        HTTP_GET,
        [this](AsyncWebServerRequest *request)
        { return Homelab::ServerClass::sourcesResponse(request); });
    this->httpClient->on(
        "/schema/sources",
        HTTP_GET,
        [this](AsyncWebServerRequest *request)
        { return Homelab::ServerClass::sourcesSchemaResponse(request); });
    this->httpClient->on(
        "/schema/receivers",
        HTTP_GET,
        [this](AsyncWebServerRequest *request)
        { return Homelab::ServerClass::receiversSchemaResponse(request); });
    this->httpClient->serveStatic("/", SPIFFS, "/");
    this->httpClient->onNotFound(Homelab::ServerClass::NOT_FOUND);
    this->httpClient->begin();
}

void Homelab::ServerClass::addSource(std::string id, Homelab::GetJsonValue_t getValue, std::optional<Homelab::GetSchemaValue_t> schema)
{
    this->sources[id] = getValue;
    this->sourcesSchema[id] = schema.has_value() ? schema.value() : []()
    { return "{}"; };
    this->httpClient->on(
        ("/" + id).c_str(),
        HTTP_GET,
        [this](AsyncWebServerRequest *request)
        { return Homelab::ServerClass::sourceResponse(request); });
};

void Homelab::ServerClass::addSink(std::string id, Homelab::ReceiveJsonValue_t receiveValue, std::optional<Homelab::GetSchemaValue_t> schema)
{
    this->sinks[id] = receiveValue;
    this->sinksSchema[id] = schema.has_value() ? schema.value() : []()
    { return "{}"; };

    ArBodyHandlerFunction handleBody = [this](AsyncWebServerRequest *request, unsigned char *data, size_t len, size_t index, size_t total)
    { return Homelab::ServerClass::receiveBodyHandler(request, data, len, index, total); };

    this->httpClient->on(
        ("/" + id).c_str(),
        HTTP_POST,
        [this](AsyncWebServerRequest *request)
        { return Homelab::ServerClass::receiveResponse(request); },
        Homelab::ServerClass::BAD_UPLOAD,
        handleBody);
};

Homelab::ServerClass *Homelab::Server = Homelab::ServerClass::getInstance();
