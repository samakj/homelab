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

std::string Homelab::NTPClass::getJsonValue()
{
    JsonDocument json;

    json["isConnected"] = this->getIsConnected();

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

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::NTPClass::getJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"isConnected\":{\"type\":\"boolean\"},"
           "\"datetime\":{\"type\":\"string\"},"
           "\"startTimestamp\":{\"type\":\"string\"},"
           "\"startTimestampOffset\":{\"type\":\"integer\"},"
           "\"type\":{\"type\":\"string\"},"
           "\"id\":{\"type\":\"string\"}"
           "}"
           "}";
}

std::string Homelab::NTPClass::getConfigureJsonValue()
{
    JsonDocument json;

    json["server"] = this->server;
    json["type"] = "ntp";
    json["id"] = this->getId();

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::NTPClass::getConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"server\":{\"type\":\"string\"},"
           "\"type\":{\"type\":\"string\"},"
           "\"id\":{\"type\":\"string\"}"
           "}"
           "}";
};

Homelab::NTPClass *Homelab::NTP = Homelab::NTPClass::getInstance();