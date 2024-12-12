#ifndef _Homelab_Sensors_ACS712_h
#define _Homelab_Sensors_ACS712_h

#include <Arduino.h>
#include <ArduinoJson.h>

#include <functional>
#include <map>
#include <optional>
#include <string>

#include "datetime.h"
#include "logger.h"
#include "server.h"

namespace Homelab::Sensors
{
    typedef std::function<void(std::optional<float> amps)> ACS712AmpsChangeCallback_t;

    enum ACS712Type_t
    {
        _5A,
        _20A,
    };

    std::string serialiseACS712Type(ACS712Type_t type);

    class ACS712
    {
    private:
        std::string id;
        std::optional<float> amps;

        std::map<std::string, ACS712AmpsChangeCallback_t> ampsCallbacks = {};

        float ampsTolerance = 0.001;
        uint8_t readPeriod = 5;
        uint16_t readsPerMeasurement = 200;
        uint16_t noiseFloor = 2;
        uint16_t minReadDifference = 10;

        uint16_t readCount = 0;
        uint16_t readValueCount[1024];
        uint32_t readTotal = 0;
        uint16_t readMin = 1024;
        uint16_t readMax = 0;
        unsigned long lastRead = 0;

        void callAmpsCallbacks();

        void readValue();
        void takeMeasurement();
        void updateAmps(float amps);

    public:
        ACS712(uint8_t pinNo, std::string id = "acs712", ACS712Type_t type = ACS712Type_t::_5A);

        uint8_t pinNo;
        ACS712Type_t type;

        void begin();
        void loop();

        std::optional<float> getAmps();

        void setAmpsTolerance(float ampsTolerance);
        void setReadPeriod(uint8_t period);
        void setReadsPerMeasurement(uint16_t readsPerMeasurement);
        void setNoiseFloor(uint16_t noiseFloor);
        void setMinReadDifference(uint16_t minReadDifference);

        void addAmpsChangeCallback(std::string name, ACS712AmpsChangeCallback_t callback);

        void deleteAmpsChangeCallback(std::string name);

        std::string getId();
        void getJsonValue(JsonVariant &json);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
        void receiveConfigureJsonValue(JsonVariant &json);
    };
}

#endif