#include "dht.h"

Homelab::Sensors::DHT::DHT(uint8_t _pinNo, std::string _id, uint8_t _type) : pinNo(_pinNo), id(_id), type(_type)
{
    std::string id = this->getId();

    Homelab::Server->addSource(
        id,
        [this](JsonVariant &json)
        { return Homelab::Sensors::DHT::getJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Sensors::DHT::getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Sensors::DHT::getConfigureJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Sensors::DHT::getConfigureJsonSchemaValue(json); });
    Homelab::Server->addSink(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Sensors::DHT::receiveConfigureJsonValue(json); });
}

void Homelab::Sensors::DHT::begin()
{
    this->client = new _DHT(this->pinNo, this->type);
    this->client->begin();

    Homelab::Scheduler->addTask(this->getId(), [this](Homelab::SchedulerTaskCallbackArg_t *arg)
                                { return Homelab::Sensors::DHT::readTask(arg); }, this->readPeriod);

    Homelab::Logger::infof("DHT started on pin %d\n", this->pinNo);
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

void Homelab::Sensors::DHT::getJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

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
};

void Homelab::Sensors::DHT::getJsonSchemaValue(JsonVariant &_json)
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
    JsonObject temperature = properties["temperature"].to<JsonObject>();
    temperature["type"] = "number";
    temperature["example"] = 21.2;
    JsonObject humidity = properties["humidity"].to<JsonObject>();
    humidity["type"] = "number";
    humidity["example"] = 60.5;
}

void Homelab::Sensors::DHT::getConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["temperatureTolerance"] = this->temperatureTolerance;
    json["humidityTolerance"] = this->humidityTolerance;
    json["temperatureRunIn"] = this->temperatureRunIn;
    json["humidityRunIn"] = this->humidityRunIn;
    json["temperatureReadCount"] = this->temperatureReadCount;
    json["humidityReadCount"] = this->humidityReadCount;
    json["readPeriod"] = this->readPeriod;
}

void Homelab::Sensors::DHT::getConfigureJsonSchemaValue(JsonVariant &_json)
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
    JsonObject temperatureTolerance = properties["temperatureTolerance"].to<JsonObject>();
    temperatureTolerance["type"] = "number";
    temperatureTolerance["example"] = 0.15;
    JsonObject humidityTolerance = properties["humidityTolerance"].to<JsonObject>();
    humidityTolerance["type"] = "number";
    humidityTolerance["example"] = 0.45;
    JsonObject temperatureRunIn = properties["temperatureRunIn"].to<JsonObject>();
    temperatureRunIn["type"] = "integer";
    temperatureRunIn["example"] = 5;
    JsonObject humidityRunIn = properties["humidityRunIn"].to<JsonObject>();
    humidityRunIn["type"] = "integer";
    humidityRunIn["example"] = 5;
    JsonObject temperatureReadCount = properties["temperatureReadCount"].to<JsonObject>();
    temperatureReadCount["type"] = "integer";
    temperatureReadCount["example"] = 0;
    JsonObject humidityReadCount = properties["humidityReadCount"].to<JsonObject>();
    humidityReadCount["type"] = "integer";
    humidityReadCount["example"] = 0;
    JsonObject readPeriod = properties["readPeriod"].to<JsonObject>();
    readPeriod["type"] = "integer";
    readPeriod["example"] = 2000;

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
    JsonObject postTemperatureTolerance = postParameters["temperatureTolerance"].to<JsonObject>();
    postTemperatureTolerance["in"] = "body";
    postTemperatureTolerance["type"] = "number";
    postTemperatureTolerance["example"] = 0.15;
    JsonObject postHumidityTolerance = postParameters["humidityTolerance"].to<JsonObject>();
    postHumidityTolerance["in"] = "body";
    postHumidityTolerance["type"] = "number";
    postHumidityTolerance["example"] = 0.45;
    JsonObject postTemperatureRunIn = postParameters["temperatureRunIn"].to<JsonObject>();
    postTemperatureRunIn["in"] = "body";
    postTemperatureRunIn["type"] = "integer";
    postTemperatureRunIn["example"] = 5;
    JsonObject postHumidityRunIn = postParameters["humidityRunIn"].to<JsonObject>();
    postHumidityRunIn["in"] = "body";
    postHumidityRunIn["type"] = "integer";
    postHumidityRunIn["example"] = 5;
    JsonObject postTemperatureReadCount = postParameters["temperatureReadCount"].to<JsonObject>();
    postTemperatureReadCount["in"] = "body";
    postTemperatureReadCount["type"] = "integer";
    postTemperatureReadCount["example"] = 0;
    JsonObject postHumidityReadCount = postParameters["humidityReadCount"].to<JsonObject>();
    postHumidityReadCount["in"] = "body";
    postHumidityReadCount["type"] = "integer";
    postHumidityReadCount["example"] = 0;
    JsonObject postReadPeriod = postParameters["readPeriod"].to<JsonObject>();
    postReadPeriod["in"] = "body";
    postReadPeriod["type"] = "integer";
    postReadPeriod["example"] = 2000;
}

void Homelab::Sensors::DHT::receiveConfigureJsonValue(JsonVariant &_json)
{
    JsonDocument json = _json.to<JsonObject>();

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

void Homelab::Sensors::DHT::readTask(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    bool hasChanged = this->updateTemperature() || this->updateHumidity();

    if (hasChanged)
    {
        JsonVariant json;
        this->getJsonValue(json);
        std::string serialisedJson;
        serializeJson(json, serialisedJson);
        Homelab::Server->sendReport(serialisedJson);
    }
}