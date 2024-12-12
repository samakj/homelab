#include "button.h"

Homelab::Peripherals::Button::Button(uint8_t _pinNo, std::string _id, uint8_t _mode, bool _isNormallyOpen) : pinNo(_pinNo), id(_id), mode(_mode), isNormallyOpen(_isNormallyOpen)
{
    std::string id = this->getId();

    Homelab::Server->addSource(id, [this]()
                               { return Homelab::Peripherals::Button::getJsonValue(); }, [this]()
                               { return Homelab::Peripherals::Button::getJsonSchemaValue(); });
    Homelab::Server->addSource(id + "/config", [this]()
                               { return Homelab::Peripherals::Button::getConfigureJsonValue(); }, [this]()
                               { return Homelab::Peripherals::Button::getConfigureJsonSchemaValue(); });
    Homelab::Server->addSink(id + "/config", [this](std::string json)
                             { return Homelab::Peripherals::Button::receiveConfigureJsonValue(json); }, [this]()
                             { return Homelab::Peripherals::Button::receiveConfigureJsonSchemaValue(); });
}

void Homelab::Peripherals::Button::callPressCallbacks()
{
    Homelab::Logger::infof("Button '%s' pressed\n", this->getId().c_str());

    for (auto const &keyValuePair : this->pressCallbacks)
    {
        Homelab::Peripherals::ButtonPressReleaseCallback_t callback = keyValuePair.second;
        callback();
    }
};
void Homelab::Peripherals::Button::callReleaseCallbacks()
{
    Homelab::Logger::infof("Button '%s' released\n", this->getId().c_str());

    for (auto const &keyValuePair : this->releaseCallbacks)
    {
        Homelab::Peripherals::ButtonPressReleaseCallback_t callback = keyValuePair.second;
        callback();
    }
};
void Homelab::Peripherals::Button::callChangeCallbacks()
{
    for (auto const &keyValuePair : this->changeCallbacks)
    {
        Homelab::Peripherals::ButtonStateChangeCallback_t callback = keyValuePair.second;
        callback(this->state);
    }
    Homelab::Server->sendReport(this->getJsonValue());
};

void Homelab::Peripherals::Button::begin()
{
    pinMode(this->pinNo, this->mode);
    bool pinState = digitalRead(this->pinNo);
    this->state = this->isNormallyOpen ? pinState : !pinState;

    Homelab::Logger::infof("Button started in %s pin mode on pin %d\n", Homelab::GPIO::serialisePinMode(this->mode).c_str(), this->pinNo);
};
void Homelab::Peripherals::Button::loop()
{
    bool pinState = digitalRead(this->pinNo);
    bool newState = this->isNormallyOpen ? pinState : !pinState;

    if (newState != this->state)
    {
        if (newState)
            this->callPressCallbacks();
        else
            this->callReleaseCallbacks();

        this->state = newState;
        this->callChangeCallbacks();
    }
};

void Homelab::Peripherals::Button::addPressCallback(std::string name, Homelab::Peripherals::ButtonPressReleaseCallback_t callback)
{
    this->pressCallbacks[name] = callback;
};
void Homelab::Peripherals::Button::addReleaseCallback(std::string name, Homelab::Peripherals::ButtonPressReleaseCallback_t callback)
{
    this->releaseCallbacks[name] = callback;
};
void Homelab::Peripherals::Button::addChangeCallback(std::string name, Homelab::Peripherals::ButtonStateChangeCallback_t callback)
{
    this->changeCallbacks[name] = callback;
};

void Homelab::Peripherals::Button::deletePressCallback(std::string name)
{
    this->pressCallbacks.erase(name);
};
void Homelab::Peripherals::Button::deleteRelaseCallback(std::string name)
{
    this->releaseCallbacks.erase(name);
};
void Homelab::Peripherals::Button::deleteChangeCallback(std::string name)
{
    this->changeCallbacks.erase(name);
};

bool Homelab::Peripherals::Button::getState()
{
    return this->state;
};

void Homelab::Peripherals::Button::setPinMode(uint8_t _pinMode)
{
    if (_pinMode != this->mode)
    {
        Homelab::Logger::infof("Setting button '%s' pinMode to %s\n", this->getId().c_str(), Homelab::GPIO::serialisePinMode(_pinMode));
        this->mode = _pinMode;
        pinMode(this->pinNo, this->mode);
        bool pinState = digitalRead(this->pinNo);
        this->state = this->isNormallyOpen ? pinState : !pinState;
    }
}

void Homelab::Peripherals::Button::setPinMode(std::string _serialisedPinMode)
{
    if (Homelab::GPIO::isSerialisedPinMode(_serialisedPinMode))
        this->setPinMode(Homelab::GPIO::deserialisePinMode(_serialisedPinMode));
    else
        Homelab::Logger::errorf("Failed to set button '%s' pinMode to %s\n", this->getId().c_str(), _serialisedPinMode.c_str());
}

void Homelab::Peripherals::Button::setIsNormallyOpen(bool _isNormallyOpen)
{

    Homelab::Logger::infof("Setting button '%s' isNormallyOpen to %s\n", this->getId().c_str(), _isNormallyOpen ? "true" : "false");
    this->isNormallyOpen = _isNormallyOpen;
    bool pinState = digitalRead(this->pinNo);
    this->state = this->isNormallyOpen ? pinState : !pinState;
}

std::string Homelab::Peripherals::Button::getId()
{
    char buff[32];
    sprintf(buff, "%d", this->pinNo);

    return (std::string)buff + "/" + this->id;
}

std::string Homelab::Peripherals::Button::getJsonValue()
{
    JsonDocument json;
    json["state"] = this->state;
    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["type"] = "button";

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::Peripherals::Button::getJsonSchemaValue()
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

std::string Homelab::Peripherals::Button::getConfigureJsonValue()
{
    JsonDocument json;
    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["isNormallyOpen"] = this->isNormallyOpen;
    json["pinMode"] = Homelab::GPIO::serialisePinMode(this->mode);

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::Peripherals::Button::getConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"id\":{\"type\":\"string\"},"
           "\"pin\":{\"type\":\"integer\"},"
           "\"isNormallyOpen\":{\"type\":\"boolean\"},"
           "\"pinMode\":{\"type\":\"string\"}"
           "},"
           "\"required\":["
           "\"id\","
           "\"pin\","
           "\"isNormallyOpen\","
           "\"pinMode\""
           "]"
           "}";
}

void Homelab::Peripherals::Button::receiveConfigureJsonValue(std::string _json)
{
    JsonDocument json;
    DeserializationError error = deserializeJson(json, _json);

    if (error)
        Homelab::Logger::errorf("Failed to deserialise button configuration json: %s\n", error.c_str());
    else
    {
        if (json["isNormallyOpen"].is<bool>())
        {
            bool _isNormallyOpen = json["isNormallyOpen"];
            this->setIsNormallyOpen(_isNormallyOpen);
        }
        if (json["pinMode"].is<std::string>())
        {
            std::string _serialisedPinMode = json["pinMode"];
            this->setPinMode(_serialisedPinMode);
        }
    }
};

std::string Homelab::Peripherals::Button::receiveConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"isNormallyOpen\":{\"type\":\"boolean\"},"
           "\"pinMode\":{\"type\":\"string\"}"
           "}"
           "}";
}