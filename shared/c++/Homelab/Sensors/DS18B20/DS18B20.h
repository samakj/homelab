#ifndef _Homelab_Sensors_DS18B20_h
#define _Homelab_Sensors_DS18B20_h

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>

namespace Homelab::Sensors
{
  class DS18B20
  {
    typedef float temperature_t;

    typedef std::function<void(temperature_t temperature)> TemperatureCallback;

    static constexpr temperature_t TEMPERATURE_NULL_VALUE = -1000.0f;
    static constexpr float PIN_NULL_VALUE = 0;

    OneWire *oneWireClient = nullptr;
    DallasTemperature *client = nullptr; 
    uint8_t pinNo = PIN_NULL_VALUE;

    std::vector<TemperatureCallback> temperatureCallbacks = {};

    temperature_t temperatureTolerance = 0.15;

    uint16_t readPeriod = 2000;
    unsigned long lastTemperatureRead = 0;
    uint32_t temperatureReadCount = 0;

   private:
    bool m_nanTemperatureReported = false;

   public:
    DS18B20(uint8_t pinNo, uint8_t type = DHT22);

    temperature_t getTemperature();
    humidity_t getHumidity();

    void setReadPeriod(uint16_t period);
    void setTemperatureTolerance(temperature_t tolerance);

    void addTemperatureCallback(TemperatureCallback callback);

    void setup();
    void loop();
  }
}

#endif