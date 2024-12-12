#include "temt6000.h"

Homelab::Sensors::TEMT6000::TEMT6000(uint8_t _pinNo, std::string _id) : pinNo(_pinNo), id(_id)
{
    std::string id = this->getId();

    Homelab::Server->addSource(
        id,
        [this](JsonVariant &json)
        { return Homelab::Sensors::TEMT6000::getJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Sensors::TEMT6000::getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Sensors::TEMT6000::getConfigureJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Sensors::TEMT6000::getConfigureJsonSchemaValue(json); });
    Homelab::Server->addSink(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Sensors::TEMT6000::receiveConfigureJsonValue(json); });
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

void Homelab::Sensors::TEMT6000::getJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

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
};

void Homelab::Sensors::TEMT6000::getJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId()].to<JsonObject>();
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read values of dht sensor (Pin " + std::to_string(this->pinNo) + ")";
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
    type["const"] = "dht";
    JsonObject pin = properties["pin"].to<JsonObject>();
    pin["type"] = "integer";
    pin["const"] = this->pinNo;
    JsonObject lux = properties["lux"].to<JsonObject>();
    lux["type"] = "number";
    lux["example"] = 21.2;
}

void Homelab::Sensors::TEMT6000::getConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["tolerance"] = tolerance;
    json["runIn"] = runIn;
    json["readCount"] = readCount;
    json["readPeriod"] = readPeriod;
}

void Homelab::Sensors::TEMT6000::getConfigureJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId() + "/config"].to<JsonObject>();

    // ---- GET ----
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read config values of temt6000 sensor (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject tolerance = properties["tolerance"].to<JsonObject>();
    tolerance["type"] = "number";
    tolerance["example"] = 10.0;
    JsonObject runIn = properties["runIn"].to<JsonObject>();
    runIn["type"] = "integer";
    runIn["example"] = 5;
    JsonObject readCount = properties["readCount"].to<JsonObject>();
    readCount["type"] = "integer";
    readCount["example"] = 0;
    JsonObject readPeriod = properties["readPeriod"].to<JsonObject>();
    readPeriod["type"] = "integer";
    readPeriod["example"] = 2000;

    // ---- POST ----
    JsonObject post = path["post"].to<JsonObject>();
    post["summary"] = "Update config values temt6000 dht sensor (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject postTolerance = postParameters["tolerance"].to<JsonObject>();
    postTolerance["in"] = "body";
    postTolerance["type"] = "number";
    postTolerance["example"] = 10.0;
    JsonObject postRunIn = postParameters["runIn"].to<JsonObject>();
    postRunIn["in"] = "body";
    postRunIn["type"] = "integer";
    postRunIn["example"] = 5;
    JsonObject postReadCount = postParameters["readCount"].to<JsonObject>();
    postReadCount["in"] = "body";
    postReadCount["type"] = "integer";
    postReadCount["example"] = 0;
    JsonObject postReadPeriod = postParameters["readPeriod"].to<JsonObject>();
    postReadPeriod["in"] = "body";
    postReadPeriod["type"] = "integer";
    postReadPeriod["example"] = 2000;
}

void Homelab::Sensors::TEMT6000::receiveConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

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

void Homelab::Sensors::TEMT6000::readTask(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    bool hasChanged = this->updateLux();

    if (hasChanged)
    {
        JsonVariant json;
        this->getJsonValue(json);
        std::string serialisedJson;
        serializeJson(json, serialisedJson);
        Homelab::Server->sendReport(serialisedJson);
    }
}