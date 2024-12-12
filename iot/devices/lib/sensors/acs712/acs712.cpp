#include "acs712.h"

std::string Homelab::Sensors::serialiseACS712Type(Homelab::Sensors::ACS712Type_t type)
{
    switch (type)
    {
    case Homelab::Sensors::ACS712Type_t::_5A:
        return (std::string) "5A";
    case Homelab::Sensors::ACS712Type_t::_20A:
        return (std::string) "20A";
    }
    return (std::string) "unknown";
};

Homelab::Sensors::ACS712::ACS712(uint8_t _pinNo, std::string _id, Homelab::Sensors::ACS712Type_t _type) : pinNo(_pinNo), id(_id), type(_type)
{
    std::string id = this->getId();

    Homelab::Server->addSource(
        id,
        [this](JsonVariant &json)
        { return Homelab::Sensors::ACS712::getJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Sensors::ACS712::getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Sensors::ACS712::getConfigureJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Sensors::ACS712::getConfigureJsonSchemaValue(json); });
    Homelab::Server->addSink(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Sensors::ACS712::receiveConfigureJsonValue(json); });
}

void Homelab::Sensors::ACS712::begin()
{
    pinMode(A0, INPUT);

    Homelab::Logger::infof("ACS712 started on pin %d\n", this->pinNo);
}

void Homelab::Sensors::ACS712::loop()
{
    if (millis() - this->lastRead > 5)
        this->readValue();
    if (readCount >= this->readsPerMeasurement)
        this->takeMeasurement();
}

void Homelab::Sensors::ACS712::readValue()
{
    uint16_t value = analogRead(A0);

    this->readValueCount[value]++;
    this->readTotal += value;

    if (value < this->readMin)
        this->readMin = value;
    if (value > this->readMax)
        this->readMax = value;

    readCount++;
    this->lastRead = millis();
}

void Homelab::Sensors::ACS712::takeMeasurement()
{
    uint16_t readAverage = this->readTotal / this->readCount;
    uint32_t weightedAnalogueValueDiff = 0;
    uint16_t includedReadCount = 0;
    uint16_t readDifference = this->readMax - this->readMin;

    if (readDifference > this->minReadDifference)
        for (uint16_t i = 0; i < 1024; i++)
        {
            uint16_t distanceFromAverage = abs(i - readAverage);
            if (distanceFromAverage > this->noiseFloor && this->readValueCount[i])
            {
                weightedAnalogueValueDiff += this->readValueCount[i] * (distanceFromAverage - this->noiseFloor);
                includedReadCount += this->readValueCount[i];
                // Reset in loop to avoid second loop
                this->readValueCount[i] = 0;
            }
        }

    weightedAnalogueValueDiff /= max((uint16_t)1, includedReadCount);

    float analogueVoltageDiff = 3.3 * weightedAnalogueValueDiff / (1024.0);
    float sensorVoltageDiff = analogueVoltageDiff / 0.666;
    float sensorRMSVoltageDiff = sensorVoltageDiff * 0.707106;
    float _amps = sensorRMSVoltageDiff / (this->type == ACS712Type_t::_5A ? 0.185 : 0.1);

    this->readCount = 0;
    this->readTotal = 0;
    this->readMin = 1024;
    this->readMax = 0;

    this->updateAmps(_amps);
}

void Homelab::Sensors::ACS712::updateAmps(float _amps)
{
    if (!this->amps.has_value())
    {
        Homelab::Logger::infof("Amps changed from null to %.3fA\n", _amps);
        this->amps = _amps;
        this->callAmpsCallbacks();
    }
    else if (abs(this->amps.value() - _amps) > this->ampsTolerance)
    {
        Homelab::Logger::infof("Amps changed from %.3fA to %.3fA\n", this->amps.value(), _amps);
        this->amps = _amps;
        this->callAmpsCallbacks();
    }
}

std::optional<float> Homelab::Sensors::ACS712::getAmps() { return this->amps; }

void Homelab::Sensors::ACS712::setAmpsTolerance(float _ampsTolerance)
{
    this->ampsTolerance = _ampsTolerance;
};
void Homelab::Sensors::ACS712::setReadPeriod(uint8_t _period)
{
    this->readPeriod = _period;
};
void Homelab::Sensors::ACS712::setReadsPerMeasurement(uint16_t _readsPerMeasurement)
{
    this->readsPerMeasurement = _readsPerMeasurement;
};
void Homelab::Sensors::ACS712::setNoiseFloor(uint16_t _noiseFloor)
{
    this->noiseFloor = _noiseFloor;
};
void Homelab::Sensors::ACS712::setMinReadDifference(uint16_t _minReadDifference)
{
    this->minReadDifference = _minReadDifference;
};

void Homelab::Sensors::ACS712::callAmpsCallbacks()
{
    for (auto const &keyValuePair : this->ampsCallbacks)
    {
        Homelab::Sensors::ACS712AmpsChangeCallback_t callback = keyValuePair.second;
        callback(this->amps);
    }
    JsonVariant json;
    this->getJsonValue(json);
    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    Homelab::Server->sendReport(serialisedJson);
};

void Homelab::Sensors::ACS712::addAmpsChangeCallback(std::string name, Homelab::Sensors::ACS712AmpsChangeCallback_t callback)
{
    this->ampsCallbacks[name] = callback;
}

void Homelab::Sensors::ACS712::deleteAmpsChangeCallback(std::string name)
{
    this->ampsCallbacks.erase(name);
}

std::string Homelab::Sensors::ACS712::getId()
{
    char buff[32];
    sprintf(buff, "%d", this->pinNo);

    return (std::string)buff + "/" + this->id;
}

void Homelab::Sensors::ACS712::getJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    if (this->amps.has_value())
    {
        json["amps"] = this->amps.value();
    }
    else
    {
        json["amps"] = "null";
    }

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["type"] = "acs712";
    json["version"] = Homelab::Sensors::serialiseACS712Type(this->type);
};

void Homelab::Sensors::ACS712::getJsonSchemaValue(JsonVariant &_json)
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
    JsonObject amps = properties["amps"].to<JsonObject>();
    amps["type"] = "number";
    amps["example"] = 1.234;
}

void Homelab::Sensors::ACS712::getConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["ampsTolerance"] = this->ampsTolerance;
    json["readPeriod"] = this->readPeriod;
    json["readsPerMeasurement"] = this->readsPerMeasurement;
    json["noiseFloor"] = this->noiseFloor;
    json["minReadDifference"] = this->minReadDifference;
}

void Homelab::Sensors::ACS712::getConfigureJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId() + "/config"].to<JsonObject>();

    // ---- GET ----
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read config values of dht sensor (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject ampsTolerance = properties["ampsTolerance"].to<JsonObject>();
    ampsTolerance["type"] = "number";
    ampsTolerance["example"] = 0.001;
    JsonObject readPeriod = properties["readPeriod"].to<JsonObject>();
    readPeriod["type"] = "integer";
    readPeriod["example"] = 5;
    JsonObject readsPerMeasurement = properties["readsPerMeasurement"].to<JsonObject>();
    readsPerMeasurement["type"] = "integer";
    readsPerMeasurement["example"] = 200;
    JsonObject noiseFloor = properties["noiseFloor"].to<JsonObject>();
    noiseFloor["type"] = "integer";
    noiseFloor["example"] = 2;
    JsonObject minReadDifference = properties["minReadDifference"].to<JsonObject>();
    minReadDifference["type"] = "integer";
    minReadDifference["example"] = 7;

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
    JsonObject postAmpsTolerance = postParameters["ampsTolerance"].to<JsonObject>();
    postAmpsTolerance["in"] = "body";
    postAmpsTolerance["type"] = "number";
    postAmpsTolerance["example"] = 0.15;
    JsonObject postReadPeriod = postParameters["readPeriod"].to<JsonObject>();
    postReadPeriod["in"] = "body";
    postReadPeriod["type"] = "integer";
    postReadPeriod["example"] = 5;
    JsonObject postReadsPerMeasurement = postParameters["readsPerMeasurement"].to<JsonObject>();
    postReadsPerMeasurement["in"] = "body";
    postReadsPerMeasurement["type"] = "integer";
    postReadsPerMeasurement["example"] = 5;
    JsonObject postNoiseFloor = postParameters["noiseFloor"].to<JsonObject>();
    postNoiseFloor["in"] = "body";
    postNoiseFloor["type"] = "integer";
    postNoiseFloor["example"] = 5;
    JsonObject postMinReadDifference = postParameters["minReadDifference"].to<JsonObject>();
    postMinReadDifference["in"] = "body";
    postMinReadDifference["type"] = "integer";
    postMinReadDifference["example"] = 0;
}

void Homelab::Sensors::ACS712::receiveConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    float _ampsTolerance = json["ampsTolerance"];
    uint8_t _readPeriod = json["readPeriod"];
    uint16_t _readsPerMeasurement = json["readsPerMeasurement"];
    uint16_t _noiseFloor = json["noiseFloor"];
    uint16_t _minReadDifference = json["minReadDifference"];

    if (json["ampsTolerance"].is<float>() && _ampsTolerance)
        this->setAmpsTolerance(_ampsTolerance);

    if (json["readPeriod"].is<uint8_t>() && _readPeriod)
        this->setReadPeriod(_readPeriod);

    if (json["readsPerMeasurement"].is<uint8_t>() && _readsPerMeasurement)
        this->setReadsPerMeasurement(_readsPerMeasurement);

    if (json["noiseFloor"].is<uint32_t>() && _noiseFloor)
        this->setNoiseFloor(_noiseFloor);

    if (json["minReadDifference"].is<uint32_t>() && _minReadDifference)
        this->setMinReadDifference(_minReadDifference);
}