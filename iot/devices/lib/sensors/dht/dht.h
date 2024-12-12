#ifndef _Homelab_Sensors_DHT_h
#define _Homelab_Sensors_DHT_h

#include <Arduino.h>
#include <ArduinoJson.h>
#include <DHT.h>

#include <functional>
#include <map>
#include <optional>
#include <string>

#include "datetime.h"
#include "logger.h"
#include "scheduler.h"
#include "server.h"

class _DHT : public DHT
{
public:
    _DHT(uint8_t pin, uint8_t type, uint8_t count = 6) : DHT(pin, type, count) {}
};

namespace Homelab::Sensors
{
    typedef std::function<void(std::optional<float> temperature)> DHTTemperatureChangeCallback_t;
    typedef std::function<void(std::optional<float> humidity)> DHTHumidityChangeCallback_t;

    class DHT
    {
    private:
        _DHT *client = nullptr;
        std::string id;
        std::optional<float> temperature;
        std::optional<float> humidity;

        std::map<std::string, DHTTemperatureChangeCallback_t> temperatureCallbacks = {};
        std::map<std::string, DHTHumidityChangeCallback_t> humidityCallbacks = {};

        float temperatureTolerance = 0.15;
        float humidityTolerance = 0.45;

        uint8_t temperatureRunIn = 5;
        uint8_t humidityRunIn = 5;
        uint32_t temperatureReadCount = 0;
        uint32_t humidityReadCount = 0;

        uint16_t readPeriod = 2000;

        void callTemperatureCallbacks();
        void callHumidityCallbacks();

    public:
        DHT(uint8_t pinNo, std::string id = "dht", uint8_t type = DHT22);

        uint8_t pinNo;
        uint8_t type;

        void begin();

        std::optional<float> getTemperature();
        std::optional<float> getHumidity();

        bool updateTemperature();
        bool updateHumidity();

        void setTemperatureTolerance(float tolerance);
        void setHumidityTolerance(float tolerance);
        void setTemperatureRunIn(uint8_t runIn);
        void setHumidityRunIn(uint8_t runIn);
        void setTemperatureReadCount(uint32_t readCount);
        void setHumidityReadCount(uint32_t readCount);
        void setReadPeriod(uint16_t period);

        void addTemperatureChangeCallback(std::string name, DHTTemperatureChangeCallback_t callback);
        void addHumidityChangeCallback(std::string name, DHTHumidityChangeCallback_t callback);

        void deleteTemperatureChangeCallback(std::string name);
        void deleteHumidityChangeCallback(std::string name);

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