#ifndef _Homelab_Sensors_DHT_h
#define _Homelab_Sensors_DHT_h

#include <Arduino.h>
#include <functional>
#include <vector>

#include <DHT.h>
class _DHT : public DHT
{
    public:
        _DHT(uint8_t pin, uint8_t type, uint8_t count = 6) : DHT(pin, type, count) {}
};

#include <Time/Time.h>
#include <Logger/Logger.h>

namespace Homelab::Sensors
{
    class DHT
    {
    public:
        typedef float temperature_t;
        typedef float humidity_t;

        typedef std::function<void(temperature_t temperature)> TemperatureCallback;
        typedef std::function<void(humidity_t humidity)> HumidityCallback;

        static constexpr temperature_t TEMPERATURE_NULL_VALUE = -1000.0f;
        static constexpr humidity_t HUMIDITY_NULL_VALUE = -1000.0f;
        static constexpr float PIN_NULL_VALUE = 0;

        _DHT *client = nullptr;
        uint8_t pinNo = PIN_NULL_VALUE;
        uint8_t type = DHT22;

        temperature_t temperature = TEMPERATURE_NULL_VALUE;
        humidity_t humidity = HUMIDITY_NULL_VALUE;

        std::vector<TemperatureCallback> temperatureCallbacks = {};
        std::vector<HumidityCallback> humidityCallbacks = {};

        temperature_t temperatureTolerance = 0.15;
        humidity_t humidityTolerance = 0.25;

        uint16_t readPeriod = 2000;
        unsigned long lastTemperatureRead = 0;
        unsigned long lastHumidityRead = 0;
        uint32_t temperatureReadCount = 0;
        uint32_t humidityReadCount = 0;

    private:
        bool m_nanTemperatureReported = false;
        bool m_nanHumidityReported = false;

    public:
        DHT(uint8_t pinNo, uint8_t type = DHT22);

        temperature_t getTemperature();
        humidity_t getHumidity();

        void setReadPeriod(uint16_t period);
        void setTemperatureTolerance(temperature_t tolerance);
        void setHumidityTolerance(humidity_t tolerance);

        void addTemperatureCallback(TemperatureCallback callback);
        void addHumidityCallback(HumidityCallback callback);

        void setup();
        void loop();
    };
};

#endif