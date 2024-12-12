#include "rotary-encoder.h"

Homelab::Peripherals::RotaryEncoder::RotaryEncoder(std::vector<uint8_t> _pins, std::string _id, _RotaryEncoder::LatchMode _mode) : pins(_pins), id(_id), mode(_mode)
{
    std::string id = this->getId();

    Homelab::Server->addSource(
        id,
        [this](JsonVariant &json)
        { return Homelab::Peripherals::RotaryEncoder::getJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Peripherals::RotaryEncoder::getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Peripherals::RotaryEncoder::getConfigureJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Peripherals::RotaryEncoder::getConfigureJsonSchemaValue(json); });
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
    JsonVariant json;
    this->getJsonValue(json, direction);
    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    Homelab::Server->sendReport(serialisedJson);
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

void Homelab::Peripherals::RotaryEncoder::getJsonValue(JsonVariant &_json, _RotaryEncoder::Direction direction)
{
    JsonDocument json = _json.to<JsonObject>();

    json["id"] = this->getId();
    json["type"] = "rotary-encoder";
    json["position"] = this->position;
    json["direction"] = (int8_t)direction;

    JsonArray _pins = json["pins"].to<JsonArray>();
    _pins.add(this->pins[0]);
    _pins.add(this->pins[1]);
};

void Homelab::Peripherals::RotaryEncoder::getJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId()].to<JsonObject>();
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read values of rotary encoder peripheral (Pins " + std::to_string(this->pins[0]) + ", " + std::to_string(this->pins[1]) + ")";
    JsonArray produces = get["produces"].to<JsonArray>();
    produces.add("application/json");
    JsonObject responses = get["responses"].to<JsonObject>();
    JsonObject _200 = responses["200"].to<JsonObject>();
    JsonObject content = _200["content"].to<JsonObject>();
    JsonObject applicationJson = content["application/json"].to<JsonObject>();
    JsonObject schema = applicationJson["schema"].to<JsonObject>();
    schema["type"] = "object";
    JsonObject properties = schema["properties"].to<JsonObject>();

    JsonObject id = properties["id"].to<JsonObject>();
    id["type"] = "string";
    id["const"] = this->getId();
    JsonObject type = properties["type"].to<JsonObject>();
    type["type"] = "string";
    type["const"] = "rotary-encoder";
    JsonObject pins = properties["pins"].to<JsonObject>();
    pins["type"] = "array";
    JsonArray pinsTuple = pins["prefixItems"].to<JsonArray>();
    JsonObject pin1 = pinsTuple.add<JsonObject>();
    pin1["type"] = "integer";
    pin1["const"] = this->pins[0];
    JsonObject pin2 = pinsTuple.add<JsonObject>();
    pin2["type"] = "integer";
    pin2["const"] = this->pins[1];
    JsonObject position = properties["position"].to<JsonObject>();
    position["type"] = "integer";
    position["example"] = 43;
    JsonObject direction = properties["direction"].to<JsonObject>();
    direction["type"] = "integer";
    direction["example"] = 1;
}

void Homelab::Peripherals::RotaryEncoder::getConfigureJsonValue(JsonVariant &_json)
{
    JsonDocument json = _json.to<JsonObject>();

    json["id"] = this->getId();

    JsonArray _pins = json["pins"].to<JsonArray>();
    _pins.add(this->pins[0]);
    _pins.add(this->pins[1]);
}

void Homelab::Peripherals::RotaryEncoder::getConfigureJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId() + "/config"].to<JsonObject>();
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read config values of rotary encoder peripheral (Pins " + std::to_string(this->pins[0]) + ", " + std::to_string(this->pins[1]) + ")";
    JsonArray produces = get["produces"].to<JsonArray>();
    produces.add("application/json");
    JsonObject responses = get["responses"].to<JsonObject>();
    JsonObject _200 = responses["200"].to<JsonObject>();
    JsonObject content = _200["content"].to<JsonObject>();
    JsonObject applicationJson = content["application/json"].to<JsonObject>();
    JsonObject schema = applicationJson["schema"].to<JsonObject>();
    schema["type"] = "object";
    JsonObject properties = schema["properties"].to<JsonObject>();

    JsonObject id = properties["id"].to<JsonObject>();
    id["type"] = "string";
    id["const"] = this->getId();
    JsonObject type = properties["type"].to<JsonObject>();
    type["type"] = "string";
    type["const"] = "rotary-encoder";
    JsonObject pins = properties["pins"].to<JsonObject>();
    pins["type"] = "array";
    JsonArray pinsTuple = pins["prefixItems"].to<JsonArray>();
    JsonObject pin1 = pinsTuple.add<JsonObject>();
    pin1["type"] = "integer";
    pin1["const"] = this->pins[0];
    JsonObject pin2 = pinsTuple.add<JsonObject>();
    pin2["type"] = "integer";
    pin2["const"] = this->pins[1];
}