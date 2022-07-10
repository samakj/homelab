#ifndef _Homelab_Sensors_DHT_h
#define _Homelab_Sensors_DHT_h

#include <functional>
#include <vector>

#include <DHT.h>
class _DHT : public DHT {}

#include "../../Time/Time.h"
#include "../../Logger/Logger.h"

namespace Homelab::Sensors {
    class DHT
    {
        public:
            typedef std::function<void(float temperature)> TemperatureCallback;
            typedef std::function<void(float humidity)> HumidityCallback;

            extern float TEMPERATURE_NULL_VALUE;
            extern float HUMIDITY_NULL_VALUE;
            extern float PIN_NULL_VALUE;

            _DHT *client = nullptr;
            uint8_t pinNo = PIN_NULL_VALUE;
            uint8_t type = DHT22;

            float temperature = TEMPERATURE_NULL_VALUE;
            float humidity = HUMIDITY_NULL_VALUE;

            std::vector<TemperatureCallback> temperatureCallbacks = {};
            std::vector<HumidityCallback> humidityCallbacks = {};

            float temperatureTolerance = 0.15;
            float humidityTolerance = 0.25;

            uint16_t readPeriod = 2000;
            unsigned long lastTemperatureRead = 0;
            unsigned long lastHumidityRead = 0;
            uint32_t temperatureReadCount = 0;
            uint32_t humidityReadCount = 0;

        private:
            bool nanTemperatureReported = false;
            bool nanHumidityReported = false;
        
        public:
            DHT(uint8_t pinNo, uint8_t type = DHT22);

            float getTemperature();
            float getHumidity();

            void setReadPeriod(uint16_t period);
            void setTemperatureTolerance(float tolerance);
            void setHumidityTolerance(float tolerance);

            void addTemperatureCallback(TemperatureCallback callback);
            void addHumidityCallback(HumidityCallback callback);

            void setup();
            void loop();
    };
};

#endif