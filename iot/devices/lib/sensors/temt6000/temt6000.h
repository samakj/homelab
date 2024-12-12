#ifndef _Homelab_Sensors_TEMT6000_h
#define _Homelab_Sensors_TEMT6000_h

#include <Arduino.h>
#include <ArduinoJson.h>

#include <functional>
#include <map>
#include <optional>
#include <string>

#include "scheduler.h"
#include "datetime.h"
#include "server.h"

namespace Homelab::Sensors
{
    typedef std::function<void(std::optional<float> lux)> TEMT6000ChangeCallback_t;

    class TEMT6000
    {
    private:
        std::optional<float> lux;
        std::string id;
        std::map<std::string, TEMT6000ChangeCallback_t> changeCallbacks = {};

        float tolerance = 10.0;

        uint8_t runIn = 5;
        uint32_t readCount = 0;

        uint16_t readPeriod = 2000;

        void callChangeCallbacks();

    public:
        TEMT6000(uint8_t pinNo, std::string id = "temt6000");

        uint8_t pinNo;

        void begin();

        std::optional<float> getLux();

        bool updateLux();

        void setTolerance(float tolerance);
        void setRunIn(uint8_t runIn);
        void setReadCount(uint32_t readCount);
        void setReadPeriod(uint16_t readPeriod);

        void addChangeCallback(std::string name, TEMT6000ChangeCallback_t callback);

        void deleteChangeCallback(std::string name);

        std::string getId();
        void getJsonValue(JsonVariant &json);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
        void receiveConfigureJsonValue(JsonVariant &json);

        void readTask(Homelab::SchedulerTaskCallbackArg_t *arg);
    };
}

#endif