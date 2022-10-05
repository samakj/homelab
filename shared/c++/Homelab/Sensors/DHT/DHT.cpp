#include "DHT.h"

Homelab::Sensors::DHT::DHT(uint8_t _pinNo, uint8_t _type) : pinNo(_pinNo), type(_type) {}

Homelab::Sensors::DHT::temperature_t Homelab::Sensors::DHT::getTemperature()
{
  if(Homelab::Time::millisSince(this->lastTemperatureRead) > this->readPeriod)
  {
    Homelab::Sensors::DHT::temperature_t _temperature = this->client->readTemperature();
    this->temperatureReadCount += 1;
    this->lastTemperatureRead = millis();

    if(!isnan(_temperature))
    {
      if(abs(this->temperature - _temperature) > this->temperatureTolerance)
      {
        Homelab::Logger::infof(
            "DHT temperature changed from %s to %s\n",
            Homelab::Utils::string::formatFloat(
                "%.1fc", this->temperature, Homelab::Sensors::DHT::TEMPERATURE_NULL_VALUE
            )
                .c_str(),
            Homelab::Utils::string::formatFloat(
                "%.1fc", _temperature, Homelab::Sensors::DHT::TEMPERATURE_NULL_VALUE
            )
                .c_str()
        );
        this->temperature = _temperature;
        for(Homelab::Sensors::DHT::TemperatureCallback callback : this->temperatureCallbacks)
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

Homelab::Sensors::DHT::humidity_t Homelab::Sensors::DHT::getHumidity()
{
  if(Homelab::Time::millisSince(this->lastHumidityRead) > this->readPeriod)
  {
    Homelab::Sensors::DHT::humidity_t _humidity = this->client->readHumidity();
    this->humidityReadCount += 1;
    this->lastHumidityRead = millis();

    if(!isnan(_humidity))
    {
      if(abs(this->humidity - _humidity) > this->humidityTolerance)
      {
        Homelab::Logger::infof(
            "DHT humidity changed from %s to %s\n",
            Homelab::Utils::string::formatFloat(
                "%.1f%%", this->humidity, Homelab::Sensors::DHT::HUMIDITY_NULL_VALUE
            )
                .c_str(),
            Homelab::Utils::string::formatFloat(
                "%.1f%%", _humidity, Homelab::Sensors::DHT::HUMIDITY_NULL_VALUE
            )
                .c_str()
        );
        this->humidity = _humidity;
        for(Homelab::Sensors::DHT::HumidityCallback callback : this->humidityCallbacks)
          callback(this->humidity);
      }
    }
    else
    {
      Homelab::Logger::info("null value recieved for humidity.");
      this->m_nanHumidityReported = true;
    }
  }

  return this->humidity;
}

void Homelab::Sensors::DHT::setReadPeriod(uint16_t period) { this->readPeriod = period; }

void Homelab::Sensors::DHT::setTemperatureTolerance(Homelab::Sensors::DHT::temperature_t tolerance)
{
  this->temperatureTolerance = tolerance;
}

void Homelab::Sensors::DHT::setHumidityTolerance(Homelab::Sensors::DHT::humidity_t tolerance)
{
  this->humidityTolerance = tolerance;
}

void Homelab::Sensors::DHT::addTemperatureCallback(
    Homelab::Sensors::DHT::TemperatureCallback callback
)
{
  this->temperatureCallbacks.push_back(callback);
}

void Homelab::Sensors::DHT::addHumidityCallback(Homelab::Sensors::DHT::HumidityCallback callback)
{
  this->humidityCallbacks.push_back(callback);
}

void Homelab::Sensors::DHT::setup()
{
  this->client = new _DHT(this->pinNo, this->type);
  this->client->begin();
  Homelab::Logger::infof("DHT sensor initialised on pin %d\n", this->pinNo);
}

void Homelab::Sensors::DHT::loop()
{
  if(!this->client) this->setup();

  this->getTemperature();
  this->getHumidity();
}