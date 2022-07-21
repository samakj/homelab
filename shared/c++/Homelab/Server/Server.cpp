#include "Server.h"

char Homelab::Server::STATE_KEY_SEPERATOR = '|';
char Homelab::Server::STATE_TAGS_SEPERATOR = ',';

AsyncWebSocketClient *Homelab::Server::WEBSOCKET_CLIENT_NULL_VALUE = nullptr;

AsyncWebServer Homelab::Server::httpClient(80);
AsyncWebSocket Homelab::Server::reportsSocketClient("/reports");
AsyncWebSocket Homelab::Server::logsSocketClient("/logs");

std::unordered_map<std::string, std::string> Homelab::Server::state = {};
std::vector<Homelab::Server::QueuedMessage *> Homelab::Server::queuedReports = {};
std::vector<Homelab::Server::QueuedMessage *> Homelab::Server::queuedLogs = {};
bool Homelab::Server::isSPIFFSSetup = false;
bool Homelab::Server::isSetup = false;
unsigned long Homelab::Server::lastReport = 0;
unsigned long Homelab::Server::lastLog = 0;

void Homelab::Server::BAD_REQUEST(AsyncWebServerRequest *request)
{
  request->send(400, "application/json", "{\"error\":\"Bad Request\"}");
}

void Homelab::Server::BAD_UPLOAD(
    AsyncWebServerRequest *request, const String &filename, size_t index, uint8_t *data, size_t len,
    bool final
)
{
  request->send(400, "application/json", "{\"error\":\"Bad Request\"}");
}

void Homelab::Server::BAD_BODY(
    AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total
)
{
  request->send(400, "application/json", "{\"error\":\"Bad Request\"}");
}

void Homelab::Server::NOT_FOUND(AsyncWebServerRequest *request)
{
  request->send(404, "application/json", "{\"error\":\"Route not found\"}");
}

void Homelab::Server::rootResponse(AsyncWebServerRequest *request)
{
  AsyncWebServerResponse *response = request->beginResponse(SPIFFS, "/index.html");
  request->send(response);
}

std::string Homelab::Server::getStateKey(std::string metric, std::vector<std::string> tags)
{
  std::string stateKey = "";
  stateKey += metric;
  stateKey += Homelab::Server::STATE_KEY_SEPERATOR;

  for(std::string tag : tags) stateKey += tag;
  stateKey += Homelab::Server::STATE_TAGS_SEPERATOR;

  return stateKey;
}

void Homelab::Server::addMetaInformation(DynamicJsonDocument *data)
{
  std::string timestamp = Homelab::Time::getIsoTimestamp();
  if(timestamp != Homelab::Time::TIMESTAMP_NULL_VALUE) data->operator[]("timestamp") = timestamp;
  else data->operator[]("timestamp") = nullptr;
  data->operator[]("mac") = Homelab::Wifi::getMACAddress();
}

void Homelab::Server::sendLog(std::string message, AsyncWebSocketClient *client)
{
  if(client != Homelab::Server::WEBSOCKET_CLIENT_NULL_VALUE)
  {
    if(client->canSend()) client->text(message.c_str());
  }
  else
  {
    Homelab::Server::logsSocketClient.textAll(message.c_str());
    Homelab::Server::lastLog = millis();
  }
};

void Homelab::Server::sendLog(
    Homelab::Logger::LogLevel level, std::string message, AsyncWebSocketClient *client
)
{
  DynamicJsonDocument data(256);
  Homelab::Server::addMetaInformation(&data);
  data["level"] = Homelab::Logger::levelName(level);
  data["message"] = message;

  std::string serialisedData = "";
  serializeJson(data, serialisedData);
  Homelab::Server::sendLog(serialisedData, client);
  // QueuedMessage *queuedMessage = new QueuedMessage;
  // queuedMessage->client = client;
  // queuedMessage->message = serialisedData;
  // Homelab::Server::queuedLogs.push_back(queuedMessage);
};

void Homelab::Server::sendReport(std::string message, AsyncWebSocketClient *client)
{
  if(client != Homelab::Server::WEBSOCKET_CLIENT_NULL_VALUE)
  {
    if(client->canSend()) client->text(message.c_str());
  }
  else
  {
    Homelab::Server::reportsSocketClient.textAll(message.c_str());
    Homelab::Server::lastReport = millis();
  }
};

void Homelab::Server::sendReport(
    std::nullptr_t value, std::string metric, std::vector<std::string> tags,
    AsyncWebSocketClient *client
)
{
  DynamicJsonDocument data(512);
  Homelab::Server::addMetaInformation(&data);
  data["metric"] = metric;
  data["message"] = value;

  auto tagsArray = data.createNestedArray("tags");
  for(std::string tag : tags) tagsArray.add(tag);

  std::string stateKey = Homelab::Server::getStateKey(metric, tags);

  std::string serialisedData = "";
  serializeJson(data, serialisedData);

  state[stateKey] = serialisedData;

  Homelab::Server::sendReport(serialisedData, client);
  // Homelab::Logger::debugf("Queueing message %s\n", serialisedData.c_str());
  // QueuedMessage *queuedMessage = new QueuedMessage;
  // queuedMessage->client = client;
  // queuedMessage->message = serialisedData;
  // Homelab::Server::queuedReports.push_back(queuedMessage);
};

void Homelab::Server::sendReport(
    std::string value, std::string metric, std::vector<std::string> tags,
    AsyncWebSocketClient *client
)
{
  DynamicJsonDocument data(512);
  Homelab::Server::addMetaInformation(&data);
  data["metric"] = metric;
  data["message"] = value;

  auto tagsArray = data.createNestedArray("tags");
  for(std::string tag : tags) tagsArray.add(tag);

  std::string stateKey = Homelab::Server::getStateKey(metric, tags);

  std::string serialisedData = "";
  serializeJson(data, serialisedData);

  state[stateKey] = serialisedData;

  Homelab::Logger::debugf("Queueing message %s\n", serialisedData.c_str());
  QueuedMessage *queuedMessage = new QueuedMessage;
  queuedMessage->client = client;
  queuedMessage->message = serialisedData;
  Homelab::Server::queuedReports.push_back(queuedMessage);
};

void Homelab::Server::sendReport(
    float value, std::string metric, std::vector<std::string> tags, AsyncWebSocketClient *client
)
{
  DynamicJsonDocument data(512);
  Homelab::Server::addMetaInformation(&data);
  data["metric"] = metric;
  data["message"] = value;

  auto tagsArray = data.createNestedArray("tags");
  for(std::string tag : tags) tagsArray.add(tag);

  std::string stateKey = Homelab::Server::getStateKey(metric, tags);

  std::string serialisedData = "";
  serializeJson(data, serialisedData);

  state[stateKey] = serialisedData;

  Homelab::Logger::debugf("Queueing message %s\n", serialisedData.c_str());
  QueuedMessage *queuedMessage = new QueuedMessage;
  queuedMessage->client = client;
  queuedMessage->message = serialisedData;
  Homelab::Server::queuedReports.push_back(queuedMessage);
};

void Homelab::Server::sendReport(
    int value, std::string metric, std::vector<std::string> tags, AsyncWebSocketClient *client
)
{
  DynamicJsonDocument data(512);
  Homelab::Server::addMetaInformation(&data);
  data["metric"] = metric;
  data["message"] = value;

  auto tagsArray = data.createNestedArray("tags");
  for(std::string tag : tags) tagsArray.add(tag);

  std::string stateKey = Homelab::Server::getStateKey(metric, tags);

  std::string serialisedData = "";
  serializeJson(data, serialisedData);

  state[stateKey] = serialisedData;

  Homelab::Logger::debugf("Queueing message %s\n", serialisedData.c_str());
  QueuedMessage *queuedMessage = new QueuedMessage;
  queuedMessage->client = client;
  queuedMessage->message = serialisedData;
  Homelab::Server::queuedReports.push_back(queuedMessage);
};

void Homelab::Server::sendReport(
    bool value, std::string metric, std::vector<std::string> tags, AsyncWebSocketClient *client
)
{
  DynamicJsonDocument data(512);
  Homelab::Server::addMetaInformation(&data);
  data["metric"] = metric;
  data["message"] = value;

  auto tagsArray = data.createNestedArray("tags");
  for(std::string tag : tags) tagsArray.add(tag);

  std::string stateKey = Homelab::Server::getStateKey(metric, tags);

  std::string serialisedData = "";
  serializeJson(data, serialisedData);

  state[stateKey] = serialisedData;

  Homelab::Logger::debugf("Queueing message %s\n", serialisedData.c_str());
  QueuedMessage *queuedMessage = new QueuedMessage;
  queuedMessage->client = client;
  queuedMessage->message = serialisedData;
  Homelab::Server::queuedReports.push_back(queuedMessage);
};

void Homelab::Server::sendPing()
{
  DynamicJsonDocument data(256);
  Homelab::Server::addMetaInformation(&data);
  data["metric"] = "ping";
  data["message"] = "pong";
  data["tags"] = JsonArray();

  std::string serialisedData = "";
  serializeJson(data, serialisedData);
  Homelab::Server::sendReport(serialisedData);
}

void Homelab::Server::sendState(AsyncWebSocketClient *client)
{
  for(std::pair<std::string, std::string> pair : Homelab::Server::state)
  {
    std::vector<std::string> keySplit =
        Homelab::Utils::string::split(pair.first, Homelab::Server::STATE_KEY_SEPERATOR);
    std::string metric = keySplit[0];
    std::vector<std::string> tags =
        Homelab::Utils::string::split(keySplit[1], Homelab::Server::STATE_TAGS_SEPERATOR);
    Homelab::Server::sendReport(pair.second, client);
  }
}

void Homelab::Server::addHttpEndpoint(
    const char *uri, WebRequestMethod method, ArRequestHandlerFunction onRequest,
    ArUploadHandlerFunction onUpload, ArBodyHandlerFunction onBody
)
{
  Homelab::Server::httpClient.on(uri, method, onRequest, onUpload, onBody);
};

void Homelab::Server::logsSocketEventHandler(
    AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg,
    uint8_t *data, size_t len
)
{
  AwsFrameInfo *info = reinterpret_cast<AwsFrameInfo *>(arg);
  std::string ip = "TO-DO";

  switch(type)
  {
    case WS_EVT_CONNECT :
      Homelab::Logger::debugf("Client connected to logs websocket from IP: %s\n", ip.c_str());
      break;
    case WS_EVT_DISCONNECT :
      Homelab::Logger::debugf("Client disconnected from logs websocket from IP: %s\n", ip.c_str());
      break;
    case WS_EVT_PONG : break;
    case WS_EVT_ERROR :
      Homelab::Logger::debugf("Client errored on logs websocket from IP: %s\n", ip.c_str());
      break;
    case WS_EVT_DATA :
      if(info->opcode == WS_TEXT)
      {
        if(info->final && info->index == 0 && info->len == len)
        {
          data[len] = 0;
          Homelab::Logger::warnf("%s sent text data to logs websocket, skipping...\n", ip.c_str());
          Homelab::Logger::warn((char *)data);
        }
        else
          Homelab::Logger::warnf(
              "%s sent multi-packet text data to logs websocket, skipping...\n", ip.c_str()
          );
      }
      else
        Homelab::Logger::warnf("%s sent binary data to logs websocket, skipping...\n", ip.c_str());
      break;
    default : Homelab::Logger::warn("Unhandled websocket event type recieved on logs websocket...");
  }
};

void Homelab::Server::reportsSocketEventHandler(
    AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg,
    uint8_t *data, size_t len
)
{
  AwsFrameInfo *info = (AwsFrameInfo *)arg;
  std::string ip = "TO-DO";

  switch(type)
  {
    case WS_EVT_CONNECT :
      Homelab::Server::sendState(client);
      Homelab::Logger::debugf("Client connected to reports websocket from IP: %s\n", ip.c_str());
      break;
    case WS_EVT_DISCONNECT :
      Homelab::Logger::debugf(
          "Client disconnected from reports websocket from IP: %s\n", ip.c_str()
      );
      break;
    case WS_EVT_PONG : break;
    case WS_EVT_ERROR :
      Homelab::Logger::debugf("Client errored on reports websocket from IP: %s\n", ip.c_str());
      break;
    case WS_EVT_DATA :
      if(info->opcode == WS_TEXT)
      {
        if(info->final && info->index == 0 && info->len == len)
        {
          data[len] = 0;
          Homelab::Logger::warnf(
              "%s sent text data to reports websocket, skipping...\n", ip.c_str()
          );
          Homelab::Logger::warn((char *)data);
        }
        else
          Homelab::Logger::warnf(
              "%s sent multi-packet text data to reports websocket, skipping...\n", ip.c_str()
          );
      }
      else
        Homelab::Logger::warnf(
            "%s sent binary data to reports websocket, skipping...\n", ip.c_str()
        );
      break;
    default :
      Homelab::Logger::warn("Unhandled websocket event type recieved on reports websocket...");
  }
};

void Homelab::Server::setup()
{
  if(!Homelab::Server::isSPIFFSSetup)
  {
    Homelab::Logger::info("Starting SPIFFS.");
    Homelab::Server::isSPIFFSSetup = SPIFFS.begin();
  }
  if(Homelab::Server::isSPIFFSSetup && !Homelab::Server::isSetup && Homelab::Wifi::isConnected())
  {
    Homelab::Logger::info("Starting http & websocket server.");
    Homelab::Server::reportsSocketClient.onEvent(Homelab::Server::reportsSocketEventHandler);
    Homelab::Server::logsSocketClient.onEvent(Homelab::Server::logsSocketEventHandler);

    DefaultHeaders::Instance().addHeader("Cache-Control", "no-cache");
    Homelab::Server::httpClient.addHandler(&Homelab::Server::reportsSocketClient);
    Homelab::Server::httpClient.addHandler(&Homelab::Server::logsSocketClient);
    Homelab::Server::httpClient.on("/", HTTP_GET, Homelab::Server::rootResponse);

    Homelab::Server::httpClient.serveStatic("/", SPIFFS, "/");
    Homelab::Server::httpClient.onNotFound(Homelab::Server::NOT_FOUND);
    Homelab::Server::httpClient.begin();
    Homelab::Logger::info("http & websocket server started.");
    Homelab::Server::isSetup = true;
  }
};

void Homelab::Server::loop()
{
  if(!Homelab::Server::isSetup) Homelab::Server::setup();
  if(!Homelab::Wifi::isConnected()) Homelab::Server::isSetup = false;
  if(Homelab::Server::isSetup)
  {
    if(Homelab::Time::millisSince(Homelab::Server::lastLog) > 10000)
    {
      Homelab::Logger::debug("Hearbeat");
      Homelab::Server::lastLog = millis();
    }
    if(Homelab::Time::millisSince(Homelab::Server::lastReport) > 1000)
    {
      Homelab::Server::sendPing();
      Homelab::Server::lastReport = millis();
    }

    if(Homelab::Server::queuedLogs.size())
    {
      auto it = Homelab::Server::queuedLogs.begin();
      Homelab::Server::QueuedMessage *queuedMessage = *it;
      Homelab::Server::sendLog(queuedMessage->message, queuedMessage->client);
      Homelab::Server::queuedLogs.erase(it);
      delete queuedMessage;
    }
    if(Homelab::Server::queuedReports.size())
    {
      auto it = Homelab::Server::queuedReports.begin();
      Homelab::Server::QueuedMessage *queuedMessage = *it;
      Homelab::Logger::debugf("Sending queued message: %s\n", queuedMessage->message.c_str());
      Homelab::Server::sendReport(queuedMessage->message, queuedMessage->client);
      Homelab::Server::queuedReports.erase(it);
      delete queuedMessage;
    }
  }
};