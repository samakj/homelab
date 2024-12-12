#include "button.h"

Homelab::Peripherals::Button::Button(uint8_t _pinNo, std::string _id, uint8_t _mode, bool _isNormallyOpen) : pinNo(_pinNo), id(_id), mode(_mode), isNormallyOpen(_isNormallyOpen)
{
    std::string id = this->getId();

    Homelab::Server->addSource(
        id,
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Button::getJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Button::getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Button::getConfigureJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Button::getConfigureJsonSchemaValue(json); });
    Homelab::Server->addSink(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Peripherals::Button::receiveConfigureJsonValue(json); });
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
    JsonVariant json;
    this->getJsonValue(json);
    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    Homelab::Server->sendReport(serialisedJson);
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

void Homelab::Peripherals::Button::getJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();
    json["state"] = this->state;
    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["type"] = "button";
};

void Homelab::Peripherals::Button::getJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId()].to<JsonObject>();
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read values of button peripheral (Pin " + std::to_string(this->pinNo) + ")";
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
    type["const"] = "button";
    JsonObject pin = properties["pin"].to<JsonObject>();
    pin["type"] = "integer";
    pin["const"] = this->pinNo;
    JsonObject state = properties["state"].to<JsonObject>();
    state["type"] = "boolean";
}

void Homelab::Peripherals::Button::getConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["isNormallyOpen"] = this->isNormallyOpen;
    json["pinMode"] = Homelab::GPIO::serialisePinMode(this->mode);
};

void Homelab::Peripherals::Button::getConfigureJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId() + "/config"].to<JsonObject>();

    // ---- GET ----
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read config values of button peripheral (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject temperatureTolerance = properties["isNormallyOpen"].to<JsonObject>();
    temperatureTolerance["type"] = "boolean";
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
    post["summary"] = "Update config values of dht sensor (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject postIsNormallOpen = postParameters["isNormallyOpen"].to<JsonObject>();
    postIsNormallOpen["in"] = "body";
    postIsNormallOpen["type"] = "boolean";
    JsonObject postPinMode = postParameters["pinMode"].to<JsonObject>();
    postPinMode["in"] = "body";
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

void Homelab::Peripherals::Button::receiveConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

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
};
