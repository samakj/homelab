#include "dht.h"

Homelab::Sensors::DHT::DHT(uint8_t _pinNo, std::string _id, uint8_t _type) : pinNo(_pinNo), id(_id), type(_type)
{
    std::string id = this->getId();

    Homelab::Server->addSource(id, [this]()
                               { return Homelab::Sensors::DHT::getJsonValue(); }, [this]()
                               { return Homelab::Sensors::DHT::getJsonSchemaValue(); });
    Homelab::Server->addSource(id + "/config", [this]()
                               { return Homelab::Sensors::DHT::getConfigureJsonValue(); }, [this]()
                               { return Homelab::Sensors::DHT::getConfigureJsonSchemaValue(); });
    Homelab::Server->addSink(id + "/config", [this](std::string json)
                             { return Homelab::Sensors::DHT::receiveConfigureJsonValue(json); }, [this]()
                             { return Homelab::Sensors::DHT::receiveConfigureJsonSchemaValue(); });
}

void Homelab::Sensors::DHT::begin()
{
    this->client = new _DHT(this->pinNo, this->type);
    this->client->begin();

    Homelab::Scheduler->addTask(this->getId(), [this](Homelab::SchedulerTaskCallbackArg_t *arg)
                                { return Homelab::Sensors::DHT::readTask(arg); }, this->readPeriod);

    Homelab::Logger::infof("DHT started on pin $d\n", this->pinNo);
}

std::optional<float> Homelab::Sensors::DHT::getTemperature() { return this->temperature; }
std::optional<float> Homelab::Sensors::DHT::getHumidity() { return this->humidity; }

bool Homelab::Sensors::DHT::updateTemperature()
{
    float _temperature = this->client->readTemperature();

    if (!isnan(_temperature))
    {
        this->temperatureReadCount += 1;

        if (this->temperatureReadCount < this->temperatureRunIn)
        {
            // Do nothing
        }
        else if (this->temperature.has_value())
        {
            float diff = abs(this->temperature.value() - _temperature);

            if (diff > this->temperatureTolerance)
            {
                Homelab::Logger::infof("Temperature changed from %.1f°c to %.1f°c\n", this->temperature.value(), _temperature);

                this->temperature = _temperature;
                this->callTemperatureCallbacks();
                return true;
            }
        }
        else
        {
            Homelab::Logger::infof("Temperature changed from null to %.1f°c\n", _temperature);

            this->temperature = _temperature;
            this->callTemperatureCallbacks();
            return true;
        }
    }

    return false;
};

bool Homelab::Sensors::DHT::updateHumidity()
{
    float _humidity = this->client->readHumidity();

    if (!isnan(_humidity))
    {
        this->humidityReadCount += 1;

        if (this->humidityReadCount < this->humidityRunIn)
        {
            // Do nothing
        }
        else if (this->humidity.has_value())
        {
            float diff = abs(this->humidity.value() - _humidity);

            if (diff > this->humidityTolerance)
            {
                Homelab::Logger::infof("Humidity changed from %.1f%% to %.1f%%\n", this->humidity.value(), _humidity);

                this->humidity = _humidity;
                this->callHumidityCallbacks();
                return true;
            }
        }
        else
        {
            Homelab::Logger::infof("Humidity changed from null to %.1f%%\n", _humidity);

            this->humidity = _humidity;
            this->callHumidityCallbacks();
            return true;
        }
    }

    return false;
};

void Homelab::Sensors::DHT::callTemperatureCallbacks()
{
    for (auto const &keyValuePair : this->temperatureCallbacks)
    {
        Homelab::Sensors::DHTTemperatureChangeCallback_t callback = keyValuePair.second;
        callback(this->temperature);
    }
};
void Homelab::Sensors::DHT::callHumidityCallbacks()
{
    for (auto const &keyValuePair : this->humidityCallbacks)
    {
        Homelab::Sensors::DHTTemperatureChangeCallback_t callback = keyValuePair.second;
        callback(this->humidity);
    }
};

void Homelab::Sensors::DHT::setTemperatureTolerance(float _tolerance)
{
    if (_tolerance != this->temperatureTolerance)
    {
        Homelab::Logger::infof("Setting dht '%s' temperatureTolerance to %.2f\n", this->getId().c_str(), _tolerance);
        this->temperatureTolerance = _tolerance;
    }
};

void Homelab::Sensors::DHT::setHumidityTolerance(float _tolerance)
{
    if (_tolerance != this->humidityTolerance)
    {
        Homelab::Logger::infof("Setting dht '%s' humidityTolerance to %.2f\n", this->getId().c_str(), _tolerance);
        this->humidityTolerance = _tolerance;
    }
};

void Homelab::Sensors::DHT::setTemperatureRunIn(uint8_t _temperatureRunIn)
{
    if (_temperatureRunIn != this->temperatureRunIn)
    {
        Homelab::Logger::infof("Setting dht '%s' temperatureRunIn to %d\n", this->getId().c_str(), _temperatureRunIn);
        this->temperatureRunIn = _temperatureRunIn;
    }
};

void Homelab::Sensors::DHT::setHumidityRunIn(uint8_t _humidityRunIn)
{
    if (_humidityRunIn != this->humidityRunIn)
    {
        Homelab::Logger::infof("Setting dht '%s' humidityRunIn to %d\n", this->getId().c_str(), _humidityRunIn);
        this->humidityRunIn = _humidityRunIn;
    }
};

void Homelab::Sensors::DHT::setTemperatureReadCount(uint32_t _temperatureReadCount)
{
    if (_temperatureReadCount != this->temperatureReadCount)
    {
        Homelab::Logger::infof("Setting dht '%s' temperatureReadCount to %d\n", this->getId().c_str(), _temperatureReadCount);
        this->temperatureReadCount = _temperatureReadCount;
    }
};

void Homelab::Sensors::DHT::setHumidityReadCount(uint32_t _humidityReadCount)
{
    if (_humidityReadCount != this->humidityReadCount)
    {
        Homelab::Logger::infof("Setting dht '%s' humidityReadCount to %d\n", this->getId().c_str(), _humidityReadCount);
        this->humidityReadCount = _humidityReadCount;
    }
};

void Homelab::Sensors::DHT::setReadPeriod(uint16_t _readPeriod)
{
    if (_readPeriod != this->readPeriod)
    {
        Homelab::Logger::infof("Setting dht '%s' readPeriod to %d\n", this->getId().c_str(), _readPeriod);
        this->readPeriod = _readPeriod;
    }
};

void Homelab::Sensors::DHT::addTemperatureChangeCallback(std::string name, DHTTemperatureChangeCallback_t callback)
{
    this->temperatureCallbacks[name] = callback;
}
void Homelab::Sensors::DHT::addHumidityChangeCallback(std::string name, DHTHumidityChangeCallback_t callback)
{
    this->temperatureCallbacks[name] = callback;
}

void Homelab::Sensors::DHT::deleteTemperatureChangeCallback(std::string name)
{
    this->temperatureCallbacks.erase(name);
}
void Homelab::Sensors::DHT::deleteHumidityChangeCallback(std::string name)
{
    this->temperatureCallbacks.erase(name);
}

std::string Homelab::Sensors::DHT::getId()
{
    char buff[32];
    sprintf(buff, "%d", this->pinNo);

    return (std::string)buff + "/" + this->id;
}

std::string Homelab::Sensors::DHT::getJsonValue()
{
    JsonDocument json;

    if (this->temperature.has_value())
    {
        json["temperature"] = this->temperature.value();
    }
    else
    {
        json["temperature"] = "null";
    }

    if (this->humidity.has_value())
    {
        json["humidity"] = this->humidity.value();
    }
    else
    {
        json["humidity"] = "null";
    }

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["type"] = "dht";

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::Sensors::DHT::getJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"temperature\":{\"type\":\"float\"},"
           "\"humidity\":{\"type\":\"float\"},"
           "\"type\":{\"type\":\"string\"},"
           "\"pin\":{\"type\":\"integer\"},"
           "\"id\":{\"type\":\"string\"}"
           "}"
           "}";
}

std::string Homelab::Sensors::DHT::getConfigureJsonValue()
{
    JsonDocument json;

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["temperatureTolerance"] = this->temperatureTolerance;
    json["humidityTolerance"] = this->humidityTolerance;
    json["temperatureRunIn"] = this->temperatureRunIn;
    json["humidityRunIn"] = this->humidityRunIn;
    json["temperatureReadCount"] = this->temperatureReadCount;
    json["humidityReadCount"] = this->humidityReadCount;
    json["readPeriod"] = this->readPeriod;

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
}

std::string Homelab::Sensors::DHT::getConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"id\":{\"type\":\"string\"},"
           "\"pin\":{\"type\":\"integer\"},"
           "\"temperatureTolerance\":{\"type\":\"float\"},"
           "\"humidityTolerance\":{\"type\":\"float\"},"
           "\"temperatureRunIn\":{\"type\":\"integer\"},"
           "\"humidityRunIn\":{\"type\":\"integer\"},"
           "\"temperatureReadCount\":{\"type\":\"integer\"},"
           "\"humidityReadCount\":{\"type\":\"integer\"},"
           "\"readPeriod\":{\"type\":\"integer\"}"
           "},"
           "\"required\":["
           "\"id\","
           "\"pin\","
           "\"temperatureTolerance\","
           "\"humidityTolerance\","
           "\"temperatureRunIn\","
           "\"humidityRunIn\","
           "\"temperatureReadCount\","
           "\"humidityReadCount\","
           "\"readPeriod\""
           "]"
           "}";
}

void Homelab::Sensors::DHT::receiveConfigureJsonValue(std::string _json)
{
    JsonDocument json;
    DeserializationError error = deserializeJson(json, _json);

    if (error)
        Homelab::Logger::errorf("Failed to deserialise dht configuration json: %s\n", error.c_str());
    else
    {
        float _temperatureTolerance = json["temperatureTolerance"];
        float _humidityTolerance = json["humidityTolerance"];
        uint8_t _temperatureRunIn = json["temperatureRunIn"];
        uint8_t _humidityRunIn = json["humidityRunIn"];
        uint32_t _temperatureReadCount = json["temperatureReadCount"];
        uint32_t _humidityReadCount = json["humidityReadCount"];
        uint16_t _readPeriod = json["readPeriod"];

        if (json["temperatureTolerance"].is<float>())
        {
            float _temperatureTolerance = json["temperatureTolerance"];
            this->setTemperatureTolerance(_temperatureTolerance);
        }
        if (json["humidityTolerance"].is<float>())
        {
            float _humidityTolerance = json["humidityTolerance"];
            this->setHumidityTolerance(_humidityTolerance);
        }
        if (json["temperatureRunIn"].is<uint8_t>())
        {
            uint8_t _temperatureRunIn = json["temperatureRunIn"];
            this->setTemperatureRunIn(_temperatureRunIn);
        }
        if (json["humidityRunIn"].is<uint8_t>())
        {
            uint8_t _humidityRunIn = json["humidityRunIn"];
            this->setHumidityRunIn(_humidityRunIn);
        }
        if (json["temperatureReadCount"].is<uint32_t>())
        {
            uint32_t _temperatureReadCount = json["temperatureReadCount"];
            this->setTemperatureReadCount(_temperatureReadCount);
        }
        if (json["humidityReadCount"].is<uint32_t>())
        {
            uint32_t _humidityReadCount = json["humidityReadCount"];
            this->setHumidityReadCount(_humidityReadCount);
        }
        if (json["readPeriod"].is<uint16_t>())
        {
            uint16_t _readPeriod = json["readPeriod"];
            this->setReadPeriod(_readPeriod);
        }
    }
}

std::string Homelab::Sensors::DHT::receiveConfigureJsonSchemaValue()
{
    return "{"
           "\"type\": \"object\","
           "\"properties\": {"
           "\"temperatureTolerance\": {\"type\": \"float\"},"
           "\"humidityTolerance\": {\"type\": \"float\"},"
           "\"temperatureRunIn\": {\"type\": \"integer\"},"
           "\"humidityRunIn\": {\"type\": \"integer\"},"
           "\"temperatureReadCount\": {\"type\": \"integer\"},"
           "\"humidityReadCount\": {\"type\": \"integer\"},"
           "\"readPeriod\": {\"type\": \"integer\"}"
           "}"
           "}";
}

void Homelab::Sensors::DHT::readTask(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    bool hasChanged = this->updateTemperature() || this->updateHumidity();

    if (hasChanged)
    {
        Homelab::Server->sendReport(this->getJsonValue());
    }
}