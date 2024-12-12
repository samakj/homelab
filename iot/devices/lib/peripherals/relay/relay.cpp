#include "relay.h"

Homelab::Peripherals::Relay::Relay(uint8_t _pinNo, std::string _id, uint8_t _mode, uint8_t _triggerLevel) : pinNo(_pinNo), id(_id), mode(_mode), triggerLevel(_triggerLevel)
{
    std::string id = this->getId();

    Homelab::Server->addSource(id, [this]()
                               { return Homelab::Peripherals::Relay::getJsonValue(); }, [this]()
                               { return Homelab::Peripherals::Relay::getJsonSchemaValue(); });
    Homelab::Server->addSource(id + "/config", [this]()
                               { return Homelab::Peripherals::Relay::getConfigureJsonValue(); }, [this]()
                               { return Homelab::Peripherals::Relay::getConfigureJsonSchemaValue(); });
    Homelab::Server->addSink(id + "/config", [this](std::string json)
                             { return Homelab::Peripherals::Relay::receiveJsonValue(json); }, [this]()
                             { return Homelab::Peripherals::Relay::receiveJsonSchemaValue(); });
    Homelab::Server->addSink(id + "/config", [this](std::string json)
                             { return Homelab::Peripherals::Relay::receiveConfigureJsonValue(json); }, [this]()
                             { return Homelab::Peripherals::Relay::receiveConfigureJsonSchemaValue(); });
}

void Homelab::Peripherals::Relay::callChangeCallbacks()
{
    for (auto const &keyValuePair : this->changeCallbacks)
    {
        Homelab::Peripherals::RelayStateChangeCallback_t callback = keyValuePair.second;
        callback(this->state);
    }
    Homelab::Server->sendReport(this->getJsonValue());
};

void Homelab::Peripherals::Relay::begin()
{
    pinMode(this->pinNo, this->mode);
    digitalWrite(this->pinNo, this->triggerLevel == HIGH ? LOW : HIGH);

    Homelab::Logger::infof("Relay started in %s pin mode on pin %d\n", Homelab::GPIO::serialisePinMode(this->mode).c_str(), this->pinNo);
};

void Homelab::Peripherals::Relay::loop() {

};

void Homelab::Peripherals::Relay::addChangeCallback(std::string name, Homelab::Peripherals::RelayStateChangeCallback_t callback)
{
    this->changeCallbacks[name] = callback;
};

void Homelab::Peripherals::Relay::deleteChangeCallback(std::string name)
{
    this->changeCallbacks.erase(name);
};

bool Homelab::Peripherals::Relay::getState()
{
    return this->state;
};

void Homelab::Peripherals::Relay::setState(bool _state)
{
    if (_state != this->state)
    {
        this->state = _state;
        if (state)
            digitalWrite(this->pinNo, this->triggerLevel == HIGH ? HIGH : LOW);
        else if (!state)
            digitalWrite(this->pinNo, this->triggerLevel == HIGH ? LOW : HIGH);
        this->callChangeCallbacks();
        Homelab::Logger::infof("Setting relay '%s' to %s\n", this->getId().c_str(), _state ? "true" : "false");
    }
};

void Homelab::Peripherals::Relay::setPinMode(uint8_t _pinMode)
{
    if (_pinMode != this->mode)
    {
        Homelab::Logger::infof("Setting relay '%s' pinMode to %s\n", this->getId().c_str(), Homelab::GPIO::serialisePinMode(_pinMode));
        this->mode = _pinMode;
        pinMode(this->pinNo, this->mode);
        if (this->state)
            digitalWrite(this->pinNo, this->triggerLevel == HIGH ? HIGH : LOW);
        else if (!this->state)
            digitalWrite(this->pinNo, this->triggerLevel == HIGH ? LOW : HIGH);
    }
}

void Homelab::Peripherals::Relay::setPinMode(std::string _serialisedPinMode)
{
    if (Homelab::GPIO::isSerialisedPinMode(_serialisedPinMode))
        this->setPinMode(Homelab::GPIO::deserialisePinMode(_serialisedPinMode));
    else
        Homelab::Logger::errorf("Failed to set relay '%s' pinMode to %s\n", this->getId().c_str(), _serialisedPinMode.c_str());
}

void Homelab::Peripherals::Relay::setTriggerLevel(uint8_t _triggerLevel)
{
    if (_triggerLevel != this->triggerLevel && (_triggerLevel == HIGH || _triggerLevel == LOW))
    {
        Homelab::Logger::infof("Setting relay '%s' triggerLevel to %s\n", this->getId().c_str(), triggerLevel == HIGH ? "HIGH" : "LOW");
        this->triggerLevel = _triggerLevel;
        if (this->state)
            digitalWrite(this->pinNo, this->triggerLevel == HIGH ? HIGH : LOW);
        else if (!this->state)
            digitalWrite(this->pinNo, this->triggerLevel == HIGH ? LOW : HIGH);
    }
}

std::string Homelab::Peripherals::Relay::getId()
{
    char buff[32];
    sprintf(buff, "%d", this->pinNo);

    return (std::string)buff + "/" + this->id;
}

std::string Homelab::Peripherals::Relay::getJsonValue()
{
    JsonDocument json;
    json["state"] = this->state;
    json["type"] = "relay";
    json["id"] = this->getId();
    json["pin"] = this->pinNo;

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::Peripherals::Relay::getJsonSchemaValue()
{
    return "{"
           "\"type\": \"object\","
           "\"properties\": {"
           "\"state\": {\"type\": \"boolean\"},"
           "\"type\":{\"type\":\"string\"},"
           "\"pin\": {\"type\": \"integer\"},"
           "\"id\": {\"type\": \"string\"}"
           "}"
           "}";
}

std::string Homelab::Peripherals::Relay::getConfigureJsonValue()
{
    JsonDocument json;
    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["triggerLevel"] = this->triggerLevel;
    json["pinMode"] = Homelab::GPIO::serialisePinMode(this->mode);

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::Peripherals::Relay::getConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"id\":{\"type\":\"string\"},"
           "\"pin\":{\"type\":\"integer\"},"
           "\"triggerLevel\":{\"type\":\"integer\"},"
           "\"pinMode\":{\"type\":\"string\"}"
           "},"
           "\"required\":["
           "\"id\","
           "\"pin\","
           "\"triggerLevel\","
           "\"pinMode\""
           "]"
           "}";
}

void Homelab::Peripherals::Relay::receiveJsonValue(std::string _json)
{
    JsonDocument json;
    DeserializationError error = deserializeJson(json, _json);

    if (error)
        Homelab::Logger::errorf("Failed to deserialise relay configuration json: %s\n", error.c_str());
    else
    {
        if (json["state"].is<bool>())
        {
            bool _state = json["state"];
            this->setState(_state);
        }
    }
};

std::string Homelab::Peripherals::Relay::receiveJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"state\":{\"type\":\"boolean\"},"
           "}"
           "}";
}

void Homelab::Peripherals::Relay::receiveConfigureJsonValue(std::string _json)
{
    JsonDocument json;
    DeserializationError error = deserializeJson(json, _json);

    if (error)
    {
        Homelab::Logger::errorf("Failed to deserialise relay configuration json: %s\n", error.c_str());
    }
    else
    {

        if (json["triggerlevel"].is<uint8_t>())
        {
            bool _triggerlevel = json["triggerlevel"];
            this->setTriggerLevel(_triggerlevel);
        }
        if (json["pinMode"].is<std::string>())
        {
            std::string _serialisedPinMode = json["pinMode"];
            this->setPinMode(_serialisedPinMode);
        }
    }
};

std::string Homelab::Peripherals::Relay::receiveConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"triggerLevel\":{\"type\":\"integer\"},"
           "\"pinMode\":{\"type\":\"string\"}"
           "}"
           "}";
}