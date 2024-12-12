#include "wifi.h"

std::string Homelab::WIFI_CONNECTING_TASK_NAME = "WifiConnectingTask";
std::string Homelab::WIFI_CONNECTED_TASK_NAME = "WifiConnectingTask";

Homelab::WifiClass *Homelab::WifiClass::instance = NULL;

Homelab::WifiClass *Homelab::WifiClass::getInstance()
{
    if (instance == NULL)
        instance = new Homelab::WifiClass();
    return instance;
}

std::optional<Homelab::WifiCredentials_t> Homelab::WifiClass::getCredentials() { return this->credentials; };
std::optional<std::string> Homelab::WifiClass::getSSID()
{
    this->updateSSID();
    return this->ssid;
};
std::optional<std::string> Homelab::WifiClass::getMAC()
{
    this->updateMAC();
    return this->mac;
};
std::optional<std::string> Homelab::WifiClass::getIP()
{
    this->updateIP();
    return this->ip;
};
std::optional<std::string> Homelab::WifiClass::getHostname()
{
    this->updateHostname();
    return this->hostname;
};
std::optional<float> Homelab::WifiClass::getRSSI() { return this->rssi; };
std::optional<Homelab::WifiStrength_t> Homelab::WifiClass::getStrength() { return this->strength; };
boolean Homelab::WifiClass::getIsConnected() { return WiFi.status() == WL_CONNECTED; };
boolean Homelab::WifiClass::getIsConnecting() { return this->isConnecting; };

void Homelab::WifiClass::setCredentials(Homelab::WifiCredentials_t credentials)
{
    if (this->getIsConnected())
        WiFi.disconnect();

    this->credentials = credentials;
};

void Homelab::WifiClass::addConnectCallback(std::string name, Homelab::WifiConnectCallback_t callback)
{
    this->connectCallbacks[name] = callback;
};
void Homelab::WifiClass::addStrengthChangeCallback(std::string name, Homelab::WifiStrengthChangeCallback_t callback)
{
    this->strengthChangeCallbacks[name] = callback;
};

void Homelab::WifiClass::deleteConnectCallback(std::string name)
{
    this->connectCallbacks.erase(name);
};
void Homelab::WifiClass::deleteStrengthChangeCallback(std::string name)
{
    this->strengthChangeCallbacks.erase(name);
};

void Homelab::WifiClass::updateSSID()
{
    if (this->getIsConnected())
        this->ssid = (std::string)WiFi.SSID().c_str();
};
void Homelab::WifiClass::updateMAC()
{
    if (this->getIsConnected())
    {
        byte mac[6];
        WiFi.macAddress(mac);
        this->mac = Homelab::rawMACAddressToString(mac);
    }
};
void Homelab::WifiClass::updateIP()
{
    if (this->getIsConnected())
        this->ip = Homelab::rawIPAddressToString(WiFi.localIP());
};
void Homelab::WifiClass::updateHostname()
{
    if (this->getIsConnected())
        this->hostname = (std::string)WiFi.getHostname();
};
void Homelab::WifiClass::updateRSSI()
{
    this->updateStrength();
};
void Homelab::WifiClass::updateStrength()
{
    if (this->getIsConnected())
    {
        float _rssi = WiFi.RSSI();
        Homelab::WifiStrength_t _strength = Homelab::rssiToStrength(_rssi);

        if (!this->strength.has_value() || this->strength.value() != _strength)
        {
            Homelab::Logger::infof("Wifi strength changed from %s to %s (RSSI=%.1f)\n", this->strength.has_value() ? Homelab::serialiseStrength(this->strength.value()).c_str() : "null", Homelab::serialiseStrength(_strength).c_str(), _rssi);

            this->strength = _strength;
        }
        this->rssi = _rssi;
    }
};

void Homelab::WifiClass::connect()
{
    if (this->credentials.has_value())
    {
        Homelab::WifiCredentials_t _credentials = this->credentials.value();
        Homelab::Logger::infof("Connecting to wifi: %s\n", _credentials.ssid.c_str());

        if (_credentials.hostname.has_value())
        {
            Homelab::Logger::infof("Setting hostname: %s\n", _credentials.hostname.value().c_str());
            WiFi.setHostname(_credentials.hostname.value().c_str());
        }
        if (_credentials.ip.has_value())
        {
            Homelab::Logger::infof("Setting ip: %s\n", _credentials.ip.value().c_str());
            std::vector<std::string> ipSplit = Homelab::string::split(_credentials.ip.value(), '.');

            if (ipSplit.size() == 4)
            {
                IPAddress localIp(stoi(ipSplit[0]), stoi(ipSplit[1]), stoi(ipSplit[2]), stoi(ipSplit[3]));
                IPAddress gateway(192, 168, 1, 1);
                IPAddress subnet(255, 255, 0, 0);
                IPAddress dns1(8, 8, 8, 8);
                IPAddress dns2(4, 4, 4, 4);

                WiFi.config(localIp, gateway, subnet, dns1, dns2);
            }
        }

        this->isConnecting = true;
        this->connectionAttemptStart = millis();
        WiFi.begin(_credentials.ssid.c_str(), _credentials.password.c_str());

        Homelab::Scheduler->addTask(Homelab::WIFI_CONNECTING_TASK_NAME, [this](Homelab::SchedulerTaskCallbackArg_t *arg)
                                    { return Homelab::WifiClass::connectingTask(arg); }, 1000);
    };
}

void Homelab::WifiClass::connectingTask(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    if (this->getIsConnected())
    {
        Homelab::Scheduler->deleteTask(Homelab::WIFI_CONNECTING_TASK_NAME);
        this->isConnecting = false;

        this->updateSSID();
        this->updateMAC();
        this->updateIP();
        this->updateHostname();

        Homelab::Logger::infof("Wifi connected after %.1fs\n", (millis() - this->connectionAttemptStart) / 1000.0f);
        Homelab::Logger::infof("SSID: %s\n", this->getSSID().value().c_str());
        Homelab::Logger::infof("MAC : %s\n", this->getMAC().value().c_str());
        Homelab::Logger::infof("IP  : %s\n", this->getIP().value().c_str());
        Homelab::Logger::infof("HOST: %s\n", this->getHostname().value().c_str());

        for (auto const &keyValuePair : this->connectCallbacks)
        {
            Homelab::WifiConnectCallback_t callback = keyValuePair.second;
            callback(this->ssid);
        }

        Homelab::Scheduler->addTask(Homelab::WIFI_CONNECTED_TASK_NAME, [this](Homelab::SchedulerTaskCallbackArg_t *arg)
                                    { return Homelab::WifiClass::connectedTask(arg); }, 1000);
    }
    else
    {
        Homelab::Logger::infof("%s: Waiting for wifi connection %.1fs...\n", arg->name.c_str(), (millis() - this->connectionAttemptStart) / 1000.0f);
    }
};

void Homelab::WifiClass::connectedTask(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    if (!this->getIsConnected())
    {
        Homelab::Scheduler->deleteTask(Homelab::WIFI_CONNECTED_TASK_NAME);

        this->ssid.reset();
        this->mac.reset();
        this->ip.reset();
        this->hostname.reset();
        this->strength.reset();

        this->connect();
    }
    else
    {
        this->updateStrength();
    }
};

std::string Homelab::WifiClass::getId()
{
    return "wifi";
};

std::string Homelab::WifiClass::getJsonValue()
{
    JsonDocument json;

    json["isConnected"] = this->getIsConnected();

    if (this->strength.has_value())
    {
        json["strength"] = Homelab::serialiseStrength(this->strength.value());
    }
    else
    {
        json["strength"] = "null";
    }

    if (this->rssi.has_value())
    {
        json["rssi"] = this->rssi.value();
    }
    else
    {
        json["rssi"] = "null";
    }

    json["id"] = this->getId();
    json["type"] = "wifi";

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::WifiClass::getJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"isConnected\":{\"type\":\"boolean\"},"
           "\"strength\":{\"type\":\"string\"},"
           "\"rssi\":{\"type\":\"rssi\"},"
           "\"type\":{\"type\":\"string\"},"
           "\"id\":{\"type\":\"string\"}"
           "}"
           "}";
}

std::string Homelab::WifiClass::getConfigureJsonValue()
{
    JsonDocument json;

    if (this->ssid.has_value())
    {
        json["ssid"] = this->ssid.value();
    }
    else
    {
        json["ssid"] = "null";
    }

    if (this->mac.has_value())
    {
        json["mac"] = this->mac.value();
    }
    else
    {
        json["mac"] = "null";
    }

    if (this->ip.has_value())
    {
        json["ip"] = this->ip.value();
    }
    else
    {
        json["ip"] = "null";
    }

    if (this->hostname.has_value())
    {
        json["hostname"] = this->hostname.value();
    }
    else
    {
        json["hostname"] = "null";
    }

    json["id"] = this->getId();

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::WifiClass::getConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"ssid\":{\"type\":\"string\"},"
           "\"mac\":{\"type\":\"string\"},"
           "\"ip\":{\"type\":\"string\"},"
           "\"hostname\":{\"type\":\"string\"},"
           "\"type\":{\"type\":\"string\"},"
           "\"id\":{\"type\":\"string\"}"
           "}"
           "}";
};

Homelab::WifiStrength_t Homelab::rssiToStrength(float rssi)
{
    if (rssi > -50.0)
        return Homelab::WifiStrength_t::EXCELLENT;
    if (rssi > -60.0)
        return Homelab::WifiStrength_t::GOOD;
    if (rssi > -70.0)
        return Homelab::WifiStrength_t::MEDIUM;
    if (rssi > -85.0)
        return Homelab::WifiStrength_t::WEAK;
    return Homelab::WifiStrength_t::MINIMAL;
};

std::string Homelab::serialiseStrength(Homelab::WifiStrength_t strength)
{
    switch (strength)
    {
    case Homelab::WifiStrength_t::EXCELLENT:
        return (std::string) "excellent";
    case Homelab::WifiStrength_t::GOOD:
        return (std::string) "good";
    case Homelab::WifiStrength_t::MEDIUM:
        return (std::string) "medium";
    case Homelab::WifiStrength_t::WEAK:
        return (std::string) "weak";
    case Homelab::WifiStrength_t::MINIMAL:
        return (std::string) "minimal";
    default:
        return (std::string) "unkownn";
    }
};

std::string Homelab::rawMACAddressToString(byte *mac)
{
    char buffer[32];
    sprintf(buffer, "%02x:%02x:%02x:%02x:%02x:%02x", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    return (std::string)buffer;
};

std::string Homelab::rawIPAddressToString(IPAddress ip)
{
    char buffer[32];
    sprintf(buffer, "%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3]);
    return (std::string)buffer;
};

Homelab::WifiClass *Homelab::Wifi = Homelab::WifiClass::getInstance();