#ifndef _Homelab_Server_h
#define _Homelab_Server_h

#include <Arduino.h>

#ifdef ESP8266
#include <ESPAsyncTCP.h>
#include <FS.h>
#else
#include <AsyncTCP.h>
#include <SPIFFS.h>
#endif

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <string>
#include <unordered_map>
#include <vector>

#include <Logger/Logger.h>
#include <Wifi/Wifi.h>
#include <Time/Time.h>

namespace Homelab::Server
{
    struct QueuedMessage
    {
        AsyncWebSocketClient *client = nullptr;
        std::string message = "";
    };
 
    extern char STATE_KEY_SEPERATOR;
    extern char STATE_TAGS_SEPERATOR;

    extern AsyncWebSocketClient *WEBSOCKET_CLIENT_NULL_VALUE;

    extern AsyncWebServer httpClient;
    extern AsyncWebSocket reportsSocketClient;
    extern AsyncWebSocket logsSocketClient;

    extern std::unordered_map<std::string, std::string> state;
    extern std::vector<QueuedMessage*> queuedReports;
    extern std::vector<QueuedMessage*> queuedLogs;
    extern bool isSPIFFSSetup;
    extern bool isSetup;
    extern unsigned long lastReport;
    extern unsigned long lastLog;

    void BAD_REQUEST(AsyncWebServerRequest *request);
    void BAD_UPLOAD(AsyncWebServerRequest *request, const String &filename, size_t index, uint8_t *data, size_t len, bool final);
    void BAD_BODY(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total);
    void NOT_FOUND(AsyncWebServerRequest *request);

    void rootResponse(AsyncWebServerRequest *request);

    void sendLog(std::string message, AsyncWebSocketClient *client = WEBSOCKET_CLIENT_NULL_VALUE);
    void sendLog(
        Homelab::Logger::LogLevel level,
        std::string message,
        AsyncWebSocketClient *client = WEBSOCKET_CLIENT_NULL_VALUE);
    void sendReport(std::string message, AsyncWebSocketClient *client = WEBSOCKET_CLIENT_NULL_VALUE);
    void sendReport(
        JsonVariant message,
        std::string metric,
        JsonArray tags = {},
        AsyncWebSocketClient *client = WEBSOCKET_CLIENT_NULL_VALUE);
    void sendPing();
    void sendState(AsyncWebSocketClient *client = WEBSOCKET_CLIENT_NULL_VALUE);

    void addHttpEndpoint(
        const char *uri,
        WebRequestMethod method,
        ArRequestHandlerFunction onRequest = Homelab::Server::BAD_REQUEST,
        ArUploadHandlerFunction onUpload = Homelab::Server::BAD_UPLOAD,
        ArBodyHandlerFunction onBody = Homelab::Server::BAD_BODY);

    void logsSocketEventHandler(
        AsyncWebSocket *server,
        AsyncWebSocketClient *client,
        AwsEventType type,
        void *arg,
        uint8_t *data,
        size_t len);


    void reportsSocketEventHandler(
        AsyncWebSocket *server,
        AsyncWebSocketClient *client,
        AwsEventType type,
        void *arg,
        uint8_t *data,
        size_t len);
        
    void setup();
    void loop();
};

#endif