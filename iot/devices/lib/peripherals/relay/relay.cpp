#include "relay.h"

Homelab::Peripherals::Relay::Relay(uint8_t _pinNo, std::string _id, uint8_t _mode, uint8_t _triggerLevel) : pinNo(_pinNo), id(_id), mode(_mode), triggerLevel(_triggerLevel)
{
    std::string id = this->getId();

    Homelab::Server->addSource(
        id,
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Relay::getJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Relay::getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Relay::getConfigureJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Relay::getConfigureJsonSchemaValue(json); });
    Homelab::Server->addSink(
        id,
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Relay::receiveJsonValue(json); });
    Homelab::Server->addSink(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Relay::receiveConfigureJsonValue(json); });
}

void Homelab::Peripherals::Relay::callChangeCallbacks()
{
    for (auto const &keyValuePair : this->changeCallbacks)
    {
        Homelab::Peripherals::RelayStateChangeCallback_t callback = keyValuePair.second;
        callback(this->state);
    }
    JsonVariant json;
    this->getJsonValue(json);
    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    Homelab::Server->sendReport(serialisedJson);
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

void Homelab::Peripherals::Relay::getJsonValue(JsonVariant &_json)
{
    JsonDocument json = _json.to<JsonObject>();

    json["state"] = this->state;
    json["type"] = "relay";
    json["id"] = this->getId();
    json["pin"] = this->pinNo;
};

void Homelab::Peripherals::Relay::getJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId()].to<JsonObject>();

    // ---- GET ----
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read values of relay peripheral (Pin " + std::to_string(this->pinNo) + ")";
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
    type["const"] = "relay";
    JsonObject pin = properties["pin"].to<JsonObject>();
    pin["type"] = "integer";
    pin["const"] = this->pinNo;
    JsonObject temperature = properties["state"].to<JsonObject>();
    temperature["type"] = "boolean";

    // ---- POST ----
    JsonObject post = path["post"].to<JsonObject>();
    post["summary"] = "Update values of relay peripheral (Pin " + std::to_string(this->pinNo) + ")";
    JsonArray postProduces = post["produces"].to<JsonArray>();
    postProduces.add("application/json");
    JsonObject postResponses = post["responses"].to<JsonObject>();
    JsonObject post200 = postResponses["200"].to<JsonObject>();

    JsonObject postRequestBody = post["requestBody"].to<JsonObject>();
    JsonObject postContent = postRequestBody["content"].to<JsonObject>();
    JsonObject postJson = postContent["application/json"].to<JsonObject>();
    JsonObject postSchema = postJson["schema"].to<JsonObject>();
    postSchema["type"] = "object";
    JsonObject postParameters = postSchema["properties"].to<JsonObject>();
    JsonObject postState = postParameters["state"].to<JsonObject>();
    postState["in"] = "body";
    postState["type"] = "boolean";
}

void Homelab::Peripherals::Relay::getConfigureJsonValue(JsonVariant &_json)
{
    JsonDocument json = _json.to<JsonObject>();

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["triggerLevel"] = this->triggerLevel;
    json["pinMode"] = Homelab::GPIO::serialisePinMode(this->mode);
};

void Homelab::Peripherals::Relay::getConfigureJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId()].to<JsonObject>();

    // ---- GET ----
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read config values of relay peripheral (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject pin = properties["pin"].to<JsonObject>();
    pin["type"] = "integer";
    pin["const"] = this->pinNo;
    JsonObject triggerLevel = properties["pin"].to<JsonObject>();
    JsonArray triggerLevelEnum = triggerLevel["enum"].to<JsonArray>();
    triggerLevelEnum.add(0);
    triggerLevelEnum.add(1);
    JsonObject pinMode = properties["pinMode"].to<JsonObject>();
    JsonArray pinModeEnum = pinMode["enum"].to<JsonArray>();
    pinModeEnum.add("INPUT");
#ifdef INPUT_PULLUP
    pinModeEnum.add("INPUT_PULLUP");
#endif
#ifdef INPUT_PULLDOWN_16
    pinModeEnum.add("INPUT_PULLDOWN_16");
#endif
    pinModeEnum.add("OUTPUT");
#ifdef OUTPUT_OPEN_DRAIN
    pinModeEnum.add("OUTPUT_OPEN_DRAIN");
#endif
#ifdef WAKEUP_PULLUP
    pinModeEnum.add("WAKEUP_PULLUP");
#endif
#ifdef WAKEUP_PULLDOWN
    pinModeEnum.add("WAKEUP_PULLDOWN");
#endif

    // ---- POST ----
    JsonObject post = path["post"].to<JsonObject>();
    post["summary"] = "Update values of relay peripheral (Pin " + std::to_string(this->pinNo) + ")";
    JsonArray postProduces = post["produces"].to<JsonArray>();
    postProduces.add("application/json");
    JsonObject postResponses = post["responses"].to<JsonObject>();
    JsonObject post200 = postResponses["200"].to<JsonObject>();

    JsonObject postRequestBody = post["requestBody"].to<JsonObject>();
    JsonObject postContent = postRequestBody["content"].to<JsonObject>();
    JsonObject postJson = postContent["application/json"].to<JsonObject>();
    JsonObject postSchema = postJson["schema"].to<JsonObject>();
    postSchema["type"] = "object";
    JsonObject postParameters = postSchema["properties"].to<JsonObject>();
    JsonObject postTriggerLevel = postParameters["triggerLevel"].to<JsonObject>();
    JsonArray postTriggerLevelEnum = postTriggerLevel["enum"].to<JsonArray>();
    postTriggerLevelEnum.add(0);
    postTriggerLevelEnum.add(1);
    JsonObject postPinMode = postParameters["pinMode"].to<JsonObject>();
    JsonArray postPinModeEnum = postPinMode["enum"].to<JsonArray>();
    postPinModeEnum.add("INPUT");
#ifdef INPUT_PULLUP
    postPinModeEnum.add("INPUT_PULLUP");
#endif
#ifdef INPUT_PULLDOWN_16
    postPinModeEnum.add("INPUT_PULLDOWN_16");
#endif
    postPinModeEnum.add("OUTPUT");
#ifdef OUTPUT_OPEN_DRAIN
    postPinModeEnum.add("OUTPUT_OPEN_DRAIN");
#endif
#ifdef WAKEUP_PULLUP
    postPinModeEnum.add("WAKEUP_PULLUP");
#endif
#ifdef WAKEUP_PULLDOWN
    postPinModeEnum.add("WAKEUP_PULLDOWN");
#endif
}

void Homelab::Peripherals::Relay::receiveJsonValue(JsonVariant &_json)
{
    JsonDocument json = _json.to<JsonObject>();

    if (json["state"].is<bool>())
    {
        bool _state = json["state"];
        this->setState(_state);
    }
};

void Homelab::Peripherals::Relay::receiveConfigureJsonValue(JsonVariant &_json)
{
    JsonDocument json = _json.to<JsonObject>();

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
};