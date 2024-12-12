
#ifndef _Homelab_Time_h
#define _Homelab_Time_h

#include <Arduino.h>
#include <ArduinoJson.h>
#include <time.h>

#include <functional>
#include <map>
#include <string>
#include <optional>

#include "scheduler.h"
#include "logger.h"

namespace Homelab
{
    uint32_t
    millisDiff(uint32_t start, uint32_t end);
    uint32_t millisSince(uint32_t start);
    std::string getIsoTimestamp();
    std::string formatTime(const char *format);

    typedef std::function<void()> NTPConnectCallback_t;

    extern std::string NTP_CONNECTING_TASK_NAME;
    extern std::string NTP_CONNECTED_TASK_NAME;

    class NTPClass
    {
    private:
        static NTPClass *instance;
        NTPClass() {}

        std::map<std::string, NTPConnectCallback_t> connectCallbacks;

        std::string server = "uk.pool.ntp.org";
        bool isConnecting = false;
        uint32_t connectionAttemptStart;

    public:
        NTPClass(const NTPClass &obj) = delete;
        static NTPClass *getInstance();

        std::optional<std::string> startTimestamp;
        std::optional<unsigned long> startTimestampOffset;

        bool getIsConnecting();
        bool getIsConnected();

        void addConnectCallback(std::string name, NTPConnectCallback_t callback);

        void deleteConnectCallback(std::string name);

        void wifiConnectCallback();

        void connectingTask(Homelab::SchedulerTaskCallbackArg_t *arg);
        void connectedTask(Homelab::SchedulerTaskCallbackArg_t *arg);

        std::string getId();
        void getJsonValue(JsonVariant &json);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
    };

    extern NTPClass *NTP;
};

#endif