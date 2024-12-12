#include "datetime.h"

std::string Homelab::NTP_CONNECTING_TASK_NAME = "NTPConnectingTask";
std::string Homelab::NTP_CONNECTED_TASK_NAME = "NTPConnectingTask";

uint32_t Homelab::millisDiff(uint32_t start, uint32_t end)
{
    if (end >= start)
        return end - start;
    uint32_t startOffset = std::numeric_limits<uint32_t>::max() - start;
    return end + startOffset;
}

uint32_t Homelab::millisSince(uint32_t start)
{
    return Homelab::millisDiff(start, millis());
}

std::string Homelab::getIsoTimestamp()
{
    time_t tm = time(nullptr);
    char datetimeBuffer[24];
    if (Homelab::NTP->getIsConnected())
        strftime(datetimeBuffer, 24, "%FT%T", gmtime(&tm));
    else
        strftime(datetimeBuffer, 24, "0000-00-00T%T", gmtime(&tm));

    char millisBuffer[8];
    sprintf(millisBuffer, "%.3fZ", (millis() % 1000) / 1000.0);
    return ((std::string)datetimeBuffer) + ((std::string)millisBuffer).substr(1);
}

std::string Homelab::formatTime(const char *format)
{
    char buffer[64];
    time_t tm = ::time(nullptr);
    strftime(buffer, sizeof(buffer), format, gmtime(&tm));
    return (std::string)buffer;
}

Homelab::NTPClass *Homelab::NTPClass::instance = NULL;

Homelab::NTPClass *Homelab::NTPClass::getInstance()
{
    if (instance == NULL)
        instance = new Homelab::NTPClass();
    return instance;
}

bool Homelab::NTPClass::getIsConnecting() { return this->isConnecting; };

bool Homelab::NTPClass::getIsConnected() { return time(nullptr) > 1616000000; };

void Homelab::NTPClass::addConnectCallback(std::string name, Homelab::NTPConnectCallback_t callback)
{
    this->connectCallbacks[name] = callback;
}

void Homelab::NTPClass::deleteConnectCallback(std::string name)
{
    this->connectCallbacks.erase(name);
}

void Homelab::NTPClass::wifiConnectCallback()
{
    Homelab::Logger::infof("Connecting NTP to %s\n", this->server.c_str());

    this->isConnecting = true;
    this->connectionAttemptStart = millis();
    configTime(0, 0, Homelab::NTP->server.c_str());
    Homelab::Scheduler->addTask(Homelab::NTP_CONNECTING_TASK_NAME, [this](Homelab::SchedulerTaskCallbackArg_t *arg)
                                { return Homelab::NTPClass::connectingTask(arg); }, 1000);
}

void Homelab::NTPClass::connectingTask(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    if (this->getIsConnected())
    {
        Homelab::Scheduler->deleteTask(Homelab::NTP_CONNECTING_TASK_NAME);
        this->isConnecting = false;
        Homelab::Logger::infof("NTP connected after %.1fs\n", (millis() - this->connectionAttemptStart) / 1000.0f);

        if (!this->startTimestamp.has_value())
        {
            this->startTimestamp = Homelab::getIsoTimestamp();
            this->startTimestampOffset = millis();
        }

        for (auto const &keyValuePair : this->connectCallbacks)
        {
            Homelab::NTPConnectCallback_t callback = keyValuePair.second;
            callback();
        }

        Homelab::Scheduler->addTask(Homelab::NTP_CONNECTED_TASK_NAME, [this](Homelab::SchedulerTaskCallbackArg_t *arg)
                                    { return Homelab::NTPClass::connectedTask(arg); }, 1000);
    }
    else
    {
        std::string log = arg->name;
        Homelab::Logger::infof("Waiting for NTP connection %.1f\n", (millis() - this->connectionAttemptStart) / 1000.0f);
    }
};

void Homelab::NTPClass::connectedTask(Homelab::SchedulerTaskCallbackArg_t *arg) {

};

std::string Homelab::NTPClass::getId()
{
    return "ntp";
};

void Homelab::NTPClass::getJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    json["isConnected"] = this->getIsConnected();
    json["isConnecting"] = this->getIsConnecting();

    if (this->getIsConnected())
    {
        json["datetime"] = Homelab::getIsoTimestamp();
    }
    else
    {
        json["datetime"] = "null";
    }

    if (this->startTimestamp.has_value())
    {
        json["startTimestamp"] = this->startTimestamp.value();
    }
    else
    {
        json["startTimestamp"] = "null";
    }

    if (this->startTimestampOffset.has_value())
    {
        json["startTimestampOffset"] = this->startTimestampOffset.value();
    }
    else
    {
        json["startTimestampOffset"] = "null";
    }

    json["id"] = this->getId();
    json["type"] = "ntp";
};

void Homelab::NTPClass::getJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId()].to<JsonObject>();
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read values of ntp";
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
    type["const"] = "ntp";
    JsonObject isConnected = properties["isConnected"].to<JsonObject>();
    isConnected["type"] = "boolean";
    JsonObject isConnecting = properties["isConnecting"].to<JsonObject>();
    isConnecting["type"] = "boolean";
    JsonObject datetime = properties["datetime"].to<JsonObject>();
    datetime["type"] = "string";
    JsonObject startTimestamp = properties["startTimestamp"].to<JsonObject>();
    startTimestamp["type"] = "string";
    JsonObject startTimestampOffset = properties["startTimestampOffset"].to<JsonObject>();
    startTimestampOffset["type"] = "integer";
    startTimestampOffset["example"] = 2345;
}

void Homelab::NTPClass::getConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    json["server"] = this->server;
    json["id"] = this->getId();
};

void Homelab::NTPClass::getConfigureJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId() + "/config"].to<JsonObject>();

    // ---- GET ----
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read config values of ntp";
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
    JsonObject server = properties["server"].to<JsonObject>();
    server["type"] = "string";
    server["example"] = this->server;
};

Homelab::NTPClass *Homelab::NTP = Homelab::NTPClass::getInstance();