#include "rotary-encoder.h"

Homelab::Peripherals::RotaryEncoder::RotaryEncoder(std::vector<uint8_t> _pins, std::string _id, _RotaryEncoder::LatchMode _mode) : pins(_pins), id(_id), mode(_mode)
{
    std::string id = this->getId();

    Homelab::Server->addSource(id, [this]()
                               { return Homelab::Peripherals::RotaryEncoder::getJsonValue(); }, [this]()
                               { return Homelab::Peripherals::RotaryEncoder::getJsonSchemaValue(); });
    Homelab::Server->addSource(id + "/config", [this]()
                               { return Homelab::Peripherals::RotaryEncoder::getConfigureJsonValue(); }, [this]()
                               { return Homelab::Peripherals::RotaryEncoder::getConfigureJsonSchemaValue(); });
}

void Homelab::Peripherals::RotaryEncoder::callClockwiseCallbacks()
{
    Homelab::Logger::infof("Rotary encoder '%s' increased to %d\n", this->getId().c_str(), this->position);

    for (auto const &keyValuePair : this->clockwiseCallbacks)
    {
        Homelab::Peripherals::RotaryEncoderRotationCallback_t callback = keyValuePair.second;
        callback(this->position);
    }
};
void Homelab::Peripherals::RotaryEncoder::callCounterClockwiseCallbacks()
{
    Homelab::Logger::infof("Rotary encoder '%s' decreased to %d\n", this->getId().c_str(), this->position);

    for (auto const &keyValuePair : this->counterClockwiseCallbacks)
    {
        Homelab::Peripherals::RotaryEncoderRotationCallback_t callback = keyValuePair.second;
        callback(this->position);
    }
};
void Homelab::Peripherals::RotaryEncoder::callChangeCallbacks(_RotaryEncoder::Direction direction)
{
    for (auto const &keyValuePair : this->changeCallbacks)
    {
        Homelab::Peripherals::RotaryEncoderStateChangeCallback_t callback = keyValuePair.second;
        callback(this->position, direction);
    }
    Homelab::Server->sendReport(this->getJsonValue(direction));
};

void Homelab::Peripherals::RotaryEncoder::begin()
{
    this->client = new _RotaryEncoder(this->pins[0], this->pins[1], this->mode);

    Homelab::Logger::infof("Rotrary encoder started on pins %d and %d\n", this->pins[0], this->pins[1]);
}

void Homelab::Peripherals::RotaryEncoder::loop()
{
    this->client->tick();
    long newPosition = this->client->getPosition();

    if (newPosition != this->position)
    {
        _RotaryEncoder::Direction direction = newPosition > this->position ? _RotaryEncoder::Direction::CLOCKWISE : _RotaryEncoder::Direction::COUNTERCLOCKWISE;
        this->position = newPosition;

        switch (direction)
        {
        case _RotaryEncoder::Direction::CLOCKWISE:
            this->callClockwiseCallbacks();
            break;
        case _RotaryEncoder::Direction::COUNTERCLOCKWISE:
            this->callCounterClockwiseCallbacks();
            break;
        }

        this->callChangeCallbacks(direction);
    }
}

void Homelab::Peripherals::RotaryEncoder::addClockwiseCallback(std::string name, Homelab::Peripherals::RotaryEncoderRotationCallback_t callback)
{
    this->clockwiseCallbacks[name] = callback;
};
void Homelab::Peripherals::RotaryEncoder::addCounterClockwiseCallback(std::string name, Homelab::Peripherals::RotaryEncoderRotationCallback_t callback)
{
    this->counterClockwiseCallbacks[name] = callback;
};
void Homelab::Peripherals::RotaryEncoder::addChangeCallback(std::string name, Homelab::Peripherals::RotaryEncoderStateChangeCallback_t callback)
{
    this->changeCallbacks[name] = callback;
};

void Homelab::Peripherals::RotaryEncoder::deleteClockwiseCallback(std::string name)
{
    this->clockwiseCallbacks.erase(name);
};
void Homelab::Peripherals::RotaryEncoder::deletCounterClockwiseCallback(std::string name)
{
    this->counterClockwiseCallbacks.erase(name);
};
void Homelab::Peripherals::RotaryEncoder::deleteChangeCallback(std::string name)
{
    this->changeCallbacks.erase(name);
};

long Homelab::Peripherals::RotaryEncoder::getPosition()
{
    return this->position;
};

std::string Homelab::Peripherals::RotaryEncoder::getId()
{
    char buff[32];
    sprintf(buff, "%d,%d", this->pins[0], this->pins[1]);

    return (std::string)buff + "/" + this->id;
}

std::string Homelab::Peripherals::RotaryEncoder::getJsonValue(_RotaryEncoder::Direction direction)
{
    JsonDocument json;

    json["id"] = this->getId();
    json["type"] = "rotary-encoder";
    json["position"] = this->position;
    json["direction"] = (int8_t)direction;

    JsonArray _pins = json.createNestedArray("pins");
    _pins.add(this->pins[0]);
    _pins.add(this->pins[1]);

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::Peripherals::RotaryEncoder::getJsonSchemaValue()
{
    return "{"
           "\"type\": \"object\","
           "\"properties\": {"
           "\"position\": {\"type\": \"integer\"},"
           "\"direction\": {\"type\": \"integer\"},"
           "\"type\":{\"type\":\"string\"},"
           "\"pins\": {\"type\": \"array\",\"items\":{\"type\":\"integer\"}},"
           "\"id\": {\"type\": \"string\"}"
           "}"
           "}";
}

std::string Homelab::Peripherals::RotaryEncoder::getConfigureJsonValue()
{
    JsonDocument json;

    json["id"] = this->getId();

    JsonArray _pins = json.createNestedArray("pins");
    _pins.add(this->pins[0]);
    _pins.add(this->pins[1]);

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
}

std::string Homelab::Peripherals::RotaryEncoder::getConfigureJsonSchemaValue()
{
    return "{"
           "\"type\": \"object\","
           "\"properties\": {"
           "\"id\": {\"type\": \"string\"},"
           "\"pins\": {\"type\": \"array\",\"items\":{\"type\":\"integer\"}}"
           "},"
           "\"required\":["
           "\"id\","
           "\"pins\""
           "]"
           "}";
}