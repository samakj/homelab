#include "DS18B20.h"

Homelab::Sensors::DS18B20::DS18B20(uint8_t _pinNo) : pinNo(_pinNo) {}

Homelab::Sensors::DS18B20::temperature_t Homelab::Sensors::DS18B20::getTemperature()
{
  if(Homelab::Time::millisSince(this->lastTemperatureRead) > this->readPeriod)
  {
    this->client->requestTemperatures();
    Homelab::Sensors::DS18B20::temperature_t _temperature = sensors.getTempCByIndex(0);
    this->temperatureReadCount += 1;
    this->lastTemperatureRead = millis();

    if(!isnan(_temperature))
    {
      if(abs(this->temperature - _temperature) > this->temperatureTolerance)
      {
        Homelab::Logger::infof(
            "DS18B20 temperature changed from %s to %s\n",
            Homelab::Utils::string::formatFloat(
                "%.1fc", this->temperature, Homelab::Sensors::DS18B20::TEMPERATURE_NULL_VALUE
            )
                .c_str(),
            Homelab::Utils::string::formatFloat(
                "%.1fc", _temperature, Homelab::Sensors::DS18B20::TEMPERATURE_NULL_VALUE
            )
                .c_str()
        );
        this->temperature = _temperature;
        for(Homelab::Sensors::DS18B20::TemperatureCallback callback : this->temperatureCallbacks)
          callback(this->temperature);
      }
    }
    else
    {
      Homelab::Logger::info("null value recieved for temperature.");
      this->m_nanTemperatureReported = true;
    }
  }

  return this->temperature;
}

void Homelab::Sensors::DS18B20::setReadPeriod(uint16_t period) { this->readPeriod = period; }

void Homelab::Sensors::DS18B20::setTemperatureTolerance(Homelab::Sensors::DS18B20::temperature_t tolerance)
{
  this->temperatureTolerance = tolerance;
}

void Homelab::Sensors::DS18B20::setHumidityTolerance(Homelab::Sensors::DS18B20::humidity_t tolerance)
{
  this->humidityTolerance = tolerance;
}

void Homelab::Sensors::DS18B20::addTemperatureCallback(
    Homelab::Sensors::DS18B20::TemperatureCallback callback
)
{
  this->temperatureCallbacks.push_back(callback);
}

void Homelab::Sensors::DHT::setup()
{
  this->oneWireClient = new OneWire(this->pinNo);
  this->client = new DallasTemperature(this->onWireClient);
  this->client->begin();
  Homelab::Logger::infof("DS18B20 sensor initialised on pin %d\n", this->pinNo);
}

void Homelab::Sensors::DHT::loop()
{
  if(!this->client) this->setup();

  getTemperature();
  getHumidity();
}