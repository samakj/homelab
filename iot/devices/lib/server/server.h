#ifndef _Homelab_server_h
#define _Homelab_server_h

#include <Arduino.h>
#include <ArduinoJson.h>

#ifdef ESP8266
#include <ESPAsyncTCP.h>
#else
#include <AsyncTCP.h>
#endif

#include <LittleFS.h>
#define FILE_SYSTEM LittleFS

#include <AsyncJson.h>
#include <ESPAsyncWebServer.h>

#include <string>
#include <optional>
#include <vector>

#include "wifi.h"
#include "datetime.h"
#include "logger.h"

namespace Homelab
{
    typedef std::function<void(JsonVariant &json)> GetJsonValue_t;
    typedef std::function<void(JsonVariant &json)> ReceiveJsonValue_t;
    typedef std::function<void(JsonVariant &json)> GetSchemaValue_t;

    class ServerClass
    {
    private:
        static ServerClass *instance;
        ServerClass();

        AsyncWebServer *httpClient;
        AsyncWebSocket *reportsSocketClient;
        AsyncWebSocket *logsSocketClient;

        AsyncMiddlewareFunction *loggerMiddleware;

        std::map<std::string, Homelab::GetJsonValue_t> sources;
        std::map<std::string, Homelab::GetSchemaValue_t> sourcesSchema;
        std::map<std::string, Homelab::ReceiveJsonValue_t> sinks;
        std::map<std::string, Homelab::GetSchemaValue_t> sinksSchema;

        std::string bodyBuffer;

        JsonDocument docsSchema;

        void initialiseDocsSchema();

    public:
        ServerClass(const ServerClass &obj) = delete;
        static ServerClass *getInstance();

        static void BAD_REQUEST(AsyncWebServerRequest *request);
        static void BAD_UPLOAD(AsyncWebServerRequest *request, const String &filename, size_t index, uint8_t *data, size_t len, bool final);
        static void BAD_BODY(AsyncWebServerRequest *request, unsigned char *data, size_t len, size_t index, size_t total);
        static void NOT_FOUND(AsyncWebServerRequest *request);

        static void rootResponse(AsyncWebServerRequest *request);
        static void pingResponse(AsyncWebServerRequest *request);
        static void deviceResponse(AsyncWebServerRequest *request);
        static void docsResponse(AsyncWebServerRequest *request);
        void docsSchemaResponse(AsyncWebServerRequest *request);
        void sourceResponse(AsyncWebServerRequest *request);
        void sourcesResponse(AsyncWebServerRequest *request);
        void receiveResponse(AsyncWebServerRequest *request, JsonVariant &json);

        static void reportsSocketEventHandler(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);
        static void logsSocketEventHandler(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);

        void setup();

        void addSource(std::string id, Homelab::GetJsonValue_t getValue, std::optional<Homelab::GetSchemaValue_t> getSchema = {});
        void addSink(std::string id, Homelab::ReceiveJsonValue_t receiveValue, std::optional<Homelab::GetSchemaValue_t> getSchema = {});

        void sendReport(std::string report);
        void sendLog(std::string log);

        static void listFS();
        static void listDir(const char *path);
    };

    extern ServerClass *Server;
}

#endif