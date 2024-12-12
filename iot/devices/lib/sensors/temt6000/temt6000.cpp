#include "temt6000.h"

Homelab::Sensors::TEMT6000::TEMT6000(uint8_t _pinNo, std::string _id) : pinNo(_pinNo), id(_id)
{
    std::string id = this->getId();

    Homelab::Server->addSource(id, [this]()
                               { return Homelab::Sensors::TEMT6000::getJsonValue(); }, [this]()
                               { return Homelab::Sensors::TEMT6000::getJsonSchemaValue(); });
    Homelab::Server->addSource(id + "/config", [this]()
                               { return Homelab::Sensors::TEMT6000::getConfigureJsonValue(); }, [this]()
                               { return Homelab::Sensors::TEMT6000::getConfigureJsonSchemaValue(); });
    Homelab::Server->addSink(id + "/config", [this](std::string json)
                             { return Homelab::Sensors::TEMT6000::receiveConfigureJsonValue(json); }, [this]()
                             { return Homelab::Sensors::TEMT6000::receiveConfigureJsonSchemaValue(); });
}

void Homelab::Sensors::TEMT6000::begin()
{
    pinMode(this->pinNo, INPUT);
    Homelab::Scheduler->addTask(this->getId(), [this](Homelab::SchedulerTaskCallbackArg_t *arg)
                                { return Homelab::Sensors::TEMT6000::readTask(arg); }, this->readPeriod);

    Homelab::Logger::infof("TEMT6000 started on pin $d\n", this->pinNo);
}

std::optional<float> Homelab::Sensors::TEMT6000::getLux() { return this->lux; }

bool Homelab::Sensors::TEMT6000::updateLux()
{
#ifdef ESP32
    analogReadResolution(10);
#endif
    float volts = analogRead(this->pinNo) * 5 / 1024.0;
    float amps = volts / 10000.0;     // em 10,000 Ohms
    float microamps = amps * 1000000; // Convert to Microamps
    float _lux = microamps * 2.0;     // Convert to Lux */

    this->readCount += 1;

    if (this->readCount < this->runIn)
    {
        // Do nothing
    }
    else if (this->lux.has_value())
    {
        float diff = abs(this->lux.value() - _lux);

        if (diff > this->tolerance)
        {
            Homelab::Logger::infof("Light level changed from %.1flux to %.1flux\n", this->lux.value(), _lux);

            this->lux = _lux;
            this->callChangeCallbacks();
            return true;
        }
    }
    else
    {
        Homelab::Logger::infof("Light level changed from null to %.1flux\n", _lux);

        this->lux = _lux;
        this->callChangeCallbacks();
        return true;
    }

    return false;
};

void Homelab::Sensors::TEMT6000::callChangeCallbacks()
{
    for (auto const &keyValuePair : this->changeCallbacks)
    {
        Homelab::Sensors::TEMT6000ChangeCallback_t callback = keyValuePair.second;
        callback(this->lux);
    }
};

void Homelab::Sensors::TEMT6000::setTolerance(float _tolerance)
{
    if (this->tolerance != _tolerance)
    {
        Homelab::Logger::infof("Setting temt6000 '%s' tolerance to %.2f\n", this->getId().c_str(), _tolerance);
        this->tolerance = _tolerance;
    }
};
void Homelab::Sensors::TEMT6000::setRunIn(uint8_t _runIn)
{
    if (this->runIn != _runIn)
    {
        Homelab::Logger::infof("Setting temt6000 '%s' runIn to %d\n", this->getId().c_str(), _runIn);
        this->runIn = _runIn;
    }
};
void Homelab::Sensors::TEMT6000::setReadCount(uint32_t _readCount)
{
    if (this->readCount != _readCount)
    {
        Homelab::Logger::infof("Setting temt6000 '%s' readCount to %d\n", this->getId().c_str(), _readCount);
        this->readCount = _readCount;
    }
};
void Homelab::Sensors::TEMT6000::setReadPeriod(uint16_t _readPeriod)
{
    if (this->readPeriod != _readPeriod)
    {
        Homelab::Logger::infof("Setting temt6000 '%s' readPeriod to %d\n", this->getId().c_str(), _readPeriod);
        this->readPeriod = _readPeriod;
    }
};

void Homelab::Sensors::TEMT6000::addChangeCallback(std::string name, TEMT6000ChangeCallback_t callback)
{
    this->changeCallbacks[name] = callback;
}

void Homelab::Sensors::TEMT6000::deleteChangeCallback(std::string name)
{
    this->changeCallbacks.erase(name);
}

std::string Homelab::Sensors::TEMT6000::getId()
{
    char buff[32];
    sprintf(buff, "%d", this->pinNo);

    return (std::string)buff + "/" + this->id;
}

std::string Homelab::Sensors::TEMT6000::getJsonValue()
{
    JsonDocument json;

    if (lux.has_value())
    {
        json["lux"] = lux.value();
    }
    else
    {
        json["lux"] = "null";
    }

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["type"] = "temt6000";

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::Sensors::TEMT6000::getJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"lux\":{\"type\":\"float\"},"
           "\"type\":{\"type\":\"string\"},"
           "\"pin\":{\"type\":\"integer\"},"
           "\"id\":{\"type\":\"string\"}"
           "}"
           "}";
}

std::string Homelab::Sensors::TEMT6000::getConfigureJsonValue()
{
    JsonDocument json;

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["tolerance"] = tolerance;
    json["runIn"] = runIn;
    json["readCount"] = readCount;
    json["readPeriod"] = readPeriod;

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
}

std::string Homelab::Sensors::TEMT6000::getConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"id\":{\"type\":\"string\"},"
           "\"pin\":{\"type\":\"integer\"},"
           "\"tolerance\":{\"type\":\"float\"},"
           "\"runIn\":{\"type\":\"integer\"},"
           "\"readCount\":{\"type\":\"integer\"},"
           "\"readPeriod\":{\"type\":\"integer\"}"
           "},"
           "\"required\":["
           "\"id\","
           "\"pin\","
           "\"tolerance\","
           "\"runIn\","
           "\"readCount\","
           "\"readPeriod\""
           "]"
           "}";
}

void Homelab::Sensors::TEMT6000::receiveConfigureJsonValue(std::string _json)
{
    JsonDocument json;
    DeserializationError error = deserializeJson(json, _json);

    if (error)
    {
        Homelab::Logger::errorf("Failed to deserialise temt6000 configuration json: %s\n", error.c_str());
    }
    else
    {
        if (json["tolerance"].is<float>())
        {
            float _tolerance = json["tolerance"];
            this->setTolerance(_tolerance);
        }
        if (json["runIn"].is<uint8_t>())
        {
            uint8_t _runIn = json["runIn"];
            this->setRunIn(_runIn);
        }
        if (json["readCount"].is<uint32_t>())
        {
            uint32_t _readCount = json["readCount"];
            this->setReadCount(_readCount);
        }
        if (json["readPeriod"].is<uint16_t>())
        {
            uint16_t _readPeriod = json["readPeriod"];
            this->setReadPeriod(_readPeriod);
        }
    }
}

std::string Homelab::Sensors::TEMT6000::receiveConfigureJsonSchemaValue()
{
    return "{"
           "\"type\": \"object\","
           "\"properties\": {"
           "\"tolerance\": {\"type\": \"float\"},"
           "\"runIn\": {\"type\": \"integer\"},"
           "\"readCount\": {\"type\": \"integer\"},"
           "\"readPeriod\": {\"type\": \"integer\"}"
           "}"
           "}";
}

void Homelab::Sensors::TEMT6000::readTask(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    bool hasChanged = this->updateLux();

    if (hasChanged)
    {
        Homelab::Server->sendReport(this->getJsonValue());
    }
}