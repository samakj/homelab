#include "DS18B20.h"

Homelab::Sensors::DS18B20::DS18B20(uint8_t _pinNo, std::string _address) : pinNo(_pinNo), address(_address) {}

Homelab::Sensors::DS18B20::temperature_t Homelab::Sensors::DS18B20::getTemperature()
{
  if(Homelab::Time::millisSince(this->lastTemperatureRead) > this->readPeriod)
  {
    this->lastTemperatureRead = millis();
    bool addressFound = false;
    Homelab::Sensors::DS18B20::temperature_t _temperature = this->temperature;
    int deviceCount = this->client->getDeviceCount();
    if (!deviceCount)
        Homelab::Logger::warnf("No DS18B20 on pin %d\n", this->pinNo);
    else {
        DeviceAddress _address;
        this->client->requestTemperatures();

        for(int i=0; i < deviceCount; i++)
            if (client->getAddress(_address, i)) 
            {

                std::string address = this->addressToString(_address);
                if (this->address == Homelab::Sensors::DS18B20::ADDRESS_NULL_VALUE || address == this->address)
                {
                    _temperature = this->client->getTempC(_address);
                    addressFound = true;
                    break;
                }
            }
    }
    if (!addressFound) 
        Homelab::Logger::warnf("DS18B20 address not found on pin %d\n", this->pinNo);
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

  return this->temperature;
}

void Homelab::Sensors::DS18B20::setReadPeriod(uint16_t period) { this->readPeriod = period; }

void Homelab::Sensors::DS18B20::setTemperatureTolerance(Homelab::Sensors::DS18B20::temperature_t tolerance)
{
  this->temperatureTolerance = tolerance;
}

void Homelab::Sensors::DS18B20::setAddress(std::string address) { this->address = address; }

void Homelab::Sensors::DS18B20::addTemperatureCallback(
    Homelab::Sensors::DS18B20::TemperatureCallback callback
)
{
  this->temperatureCallbacks.push_back(callback);
}

std::string Homelab::Sensors::DS18B20::addressToString(DeviceAddress address)
{
    char buffer[32];
    sprintf(
        buffer,
        "%x%x%x%x%x%x%x%x",
        address[0],
        address[1],
        address[2],
        address[3],
        address[4],
        address[5],
        address[6],
        address[7]
    );
    return (std::string)buffer;
}

void Homelab::Sensors::DS18B20::setup()
{
  this->oneWireClient = new OneWire(this->pinNo);
  this->client = new DallasTemperature(this->oneWireClient);
  this->client->begin();
  Homelab::Logger::infof("DS18B20 sensor initialised on pin %d\n", this->pinNo);
}

void Homelab::Sensors::DS18B20::loop()
{
  if(!this->client) this->setup();
  this->getTemperature();
}