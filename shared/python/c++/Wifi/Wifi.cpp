#include "Wifi.h"

std::string Homelab::Wifi::SSID_NULL_VALUE = nullptr;
float Homelab::Wifi::STRENGTH_NULL_VALUE = 0.0f;
std::string Homelab::Wifi::IP_NULL_VALUE = nullptr;
std::string Homelab::Wifi::HOSTNAME_NULL_VALUE = nullptr;

std::vector<Homelab::Wifi::Credentials *> Homelab::Wifi::netorks = {};
Homelab::Wifi::Credentials *Homelab::Wifi::netork = nullptr;
float Homelab::Wifi::strength = Homelab::Wifi::STRENGTH_NULL_VALUE;
std::string Homelab::Wifi::_hostname = Homelab::Wifi::IP_NULL_VALUE;
std::string Homelab::Wifi::_ip = Homelab::Wifi::HOSTNAME_NULL_VALUE;

std::vector<Homelab::Wifi::ConnectCallback> Homelab::Wifi::connectCallbacks = {};
std::vector<Homelab::Wifi::SSIDChangeCallback> Homelab::Wifi::ssidChangeCallbacks = {};
std::vector<Homelab::Wifi::StrengthChangeCallback> Homelab::Wifi::strengthChangeCallbacks = {};

bool Homelab::Wifi::_isConnecting = false;
uint16_t Homelab::Wifi::_connectionAttemptStart = 0;
uint16_t Homelab::Wifi::_lastConnectionMessage = 0;
uint16_t Homelab::Wifi::maxWait = 60000;
uint16_t Homelab::Wifi::strengthUpdatePeriod = 10000;
uint16_t Homelab::Wifi::_lastStrengthUpdate = 0;

bool Homelab::Wifi::isConnecting()
{
    return Homelab::Wifi::_isConnecting;
}
#
bool Homelab::Wifi::isConnected()
{
    return WiFi.status() == WL_CONNECTED;
}

std::string Homelab::Wifi::getMACAddress()
{
    byte mac[6];
    WiFi.macAddress(mac);
    char buffer[32];
    sprintf(
        buffer,
        "%02x:%02x:%02x:%02x:%02x:%02x",
        mac[0],
        mac[1],
        mac[2],
        mac[3],
        mac[4],
        mac[5]);
    return (std::string)buffer;
}

std::string Homelab::Wifi::getIPAddress()
{
    IPAddress ip = WiFi.localIP();
    char buffer[32];
    sprintf(
        buffer,
        "%d.%d.%d.%d",
        ip[0],
        ip[1],
        ip[2],
        ip[3]);
    return (std::string)buffer;
}

std::string Homelab::Wifi::getHostname()
{
    return (std::string)(Homelab::Wifi::isConnected() ? WiFi.getHostname().c_str() : Homelab::Wifi::HOSTNAME_NULL_VALUE);
}

std::string Homelab::Wifi::getSSID()
{
    return (std::string)(Homelab::Wifi::isConnected() ? WiFi.SSID().c_str() : Homelab::Wifi::SSID_NULL_VALUE);
}

float Homelab::Wifi::getStrength()
{
    return Homelab::Wifi::isConnected() ? (255 + WiFi.RSSI()) / 255.0f : Homelab::Wifi::STRENGTH_NULL_VALUE;
}

Homelab::Wifi::Credentials *Homelab::Wifi::getStrongestNetwork(std::vector<Homelab::Wifi::Credentials *> networks)
{
    if (!networks.size())
    {
        Homelab::Logger::error("Empty list passed to getStrongestNetwork");
        return nullptr;
    }

    Homelab::Logger::infof("Finding strongest of %d networks...\n", networks.size());
    Homelab::Logger::debug("Scanning local networks...");

    uint8_t networkCount = WiFi.scanNetworks();

    Homelab::Logger::debugf("%d networks found in range.\n", networkCount);

    Homelab::Wifi::Credentials *strongest = nullptr;
    float strengthOfStrongest = 0;

    for (uint8_t i = 0; i < networkCount; i++)
        for (Homelab::Wifi::Credentials *_credential : networks)
            if (_credential->ssid == WiFi.SSID(i).c_str())
            {
                float strength = (255 + WiFi.RSSI(i)) / 2.55;
                Homelab::Logger::debugf("    '%s' network found with strength %.1f%%.\n", _credential->ssid.c_str(), strength);
                if (strength > strengthOfStrongest)
                {
                    strongest = _credential;
                    strengthOfStrongest = strength;
                }
            }

    if (!strongest)
        Homelab::Logger::warn("None of the provided credentials matched found local networks.");
    else
        Homelab::Logger::infof("'%s' found as the strongest.\n", strongest->ssid.c_str());

    return strongest;
}

void Homelab::Wifi::addConnectCallback(Homelab::Wifi::ConnectCallback callback)
{
    Homelab::Wifi::connectCallbacks.push_back(callback);
}

void Homelab::Wifi::addSSIDChangeCallback(Homelab::Wifi::SsidChangeCallback callback)
{
    Homelab::Wifi::ssidChangeCallbacks.push_back(callback);
}

void Homelab::Wifi::addStrengthChangeCallback(Homelab::Wifi::StrengthChangeCallback callback)
{
    Homelab::Wifi::strengthChangeCallbacks.push_back(callback);
}

void Homelab::Wifi::callConnectCallbacks(std::string ssid)
{
    for (
        Homelab::Wifi::ConnectCallback callback :
        Homelab::Wifi::connectCallbacks)
        callback(ssid);
}

void Homelab::Wifi::callSSIDChangeCallbacks(std::string ssid)
{
    for (
        Homelab::Wifi::SSIDChangeCallback callback :
        Homelab::Wifi::ssidChangeCallbacks)
        callback(ssid);
}

void Homelab::Wifi::callStrengthChangeCallbacks(float strength)
{
    for (
        Homelab::Wifi::StrengthChangeCallback callback :
        Homelab::Wifi::strengthChangeCallbacks)
        callback(strength);
}

void Homelab::Wifi::setHostname(std::string hostname)
{
    Homelab::Wifi::_hostname = hostname;
    if (!Homelab::Wifi::isConnected())
    {
        Homelab::Logger::infof("Setting hostname to: ", Homelab::Wifi::_hostname.c_str());
        WiFi.setHostname(Homelab::Wifi::_hostname.c_str());
    }
    else
        Homelab::Logger::warn("Hostname changes will only take effect on wifi re-connect.");
}

void Homelab::Wifi::setIPAddress(std::string ip)
{
    Homelab::Wifi::_ip = ip;

    if (!Homelab::Wifi::isConnected())
    {
        std::vector<std::string> ipSplit = Homelab::Utils::string::split(Homelab::Wifi::_ip, ":");

        if (ipSplit.size() != 4)
        {
            Homelab::Logger::errorf("Invalid IP set for wifi: %s\n", Homelab::Wifi::_ip.c_str());
            return;
        }

        IPAddress _ip(stoi(ipSplit)[0], stoi(ipSplit)[1], stoi(ipSplit)[2], stoi(ipSplit)[3]);
        IPAddress gateway(192, 168, 1, 1);
        IPAddress subnet(255, 255, 0, 0);
        IPAddress dns1(8, 8, 8, 8);
        IPAddress dns2(4, 4, 4, 4);

        Homelab::Logger::infof("Setting IP to: %s\n", Homelab::Wifi::_ip.c_str());
        WiFi.config(local_ip, gateway, subnet, dns1, dns2);
    }
    else
        Homelab::Logger::warn("IP changes will only take effect on wifi re-connect.");
}

void Homelab::Wifi::setMaxWait(uint16_t maxWait)
{
    Homelab::Wifi::maxWait = maxWait;
};

void Homelab::Wifi::setStrengthUpdatePeriod(uint16_t strengthUpdatePeriod)
{
    Homelab::Wifi::strengthUpdatePeriod = strengthUpdatePeriod;
};

Homelab::Wifi::rawMACAddressToString(byte *mac)
{
    char buffer[32];
    sprintf(
        buffer,
        "%02x:%02x:%02x:%02x:%02x:%02x",
        mac[0],
        mac[1],
        mac[2],
        mac[3],
        mac[4],
        mac[5]);
    return (std::string)buffer;
};

std::string Homelab::Wifi::rawIPAddressToString(IPAddress ip)
{
    char buffer[32];
    sprintf(
        buffer,
        "%d.%d.%d.%d",
        ip[0],
        ip[1],
        ip[2],
        ip[3]);
    return (std::string)buffer;
};

void Homelab::Wifi::connect(Homelab::Wifi::Credentials *network, std::string hostname, std::string ip)
{
    Homelab::Wifi::strength = Homelab::Wifi::STRENGTH_NULL_VALUE;
    if (Homelab::Wifi::isConnected())
        WiFi.disconnnect();

    Homelab::Wifi::network = network;
    std::string _hostname = hostname || Homelab::Wifi::_hostname;
    std::string _ip = ip || Homelab::Wifi::_ip;

    if (_hostname != nullptr)
        Homelab::Wifi::setHostname(_hostname);
    if (_ip != nullptr)
        Homelab::Wifi::setIPAddress(_ip);

    Homelab::Logger::infof("Connecting to: %s\n", Homelab::Wifi::network->ssid.c_str());
    Homelab::Wifi::_isConnecting = true;
    Homelab::Wifi::_connectionAttemptStart = millis();
    Homelab::Wifi::_lastConnectionMessage = millis();
    WiFi.begin(
        Homelab::Wifi::network->ssid.c_str(),
        Homelab::Wifi::network->password.c_str());
}

void Homelab::Wifi::connect(std::vector<Homelab::Wifi::Credentials> *networks, std::string hostname, std::string ip)
{
    std::vector<Homelab::Wifi::Credentials *> Homelab::Wifi::networks = credentials;
    Homelab::Wifi::Credentials *strongest = Homelab::Wifi::getStrongestNetwork(credentials);

    if (strongest != nullptr)
        Homelab::Wifi::connect(strongest, hostname, ipLocation, maxWait);
}

void Homelab::Wifi::reconnect()
{
    if (Homelab::Wifi::networks)
        Homelab::Wifi::connect(Homelab::Wifi::networks);
    else
        Homelab::Wifi::connect(Homelab::Wifi::network);
}

void Homelab::Wifi::loop()
{
    if (Homelab::Wifi::isConnecting())
    {
        if (Homelab::Wifi::isConnected())
        {
            Homelab::Wifi::_isConnecting = false;
            std::string ssid = Homelab::Wifi::getSSID();
            float strength = Homelab::Wifi::getStrength();
            std::string ip = Homelab::Wifi::getIPAddress();
            std::string mac = Homelab::Wifi::getMACAddress();

            Homelab::Logger::infof("Connected to %s @ %.1f\n", ssid.c_str(), strength);
            Homelab::Logger::infof("IP:   %s\n", ip.c_str());
            Homelab::Logger::infof("MAC:  %s\n", mac.c_str());

            Homelab::Wifi::callConnectCallbacks(ssid);
            Homelab::Wifi::callSSIDChangeCallbacks(ssid);
            Homelab::Wifi::callStrengthCallbacks(strength);
        }
        else if (Homelab::Time::millisSince(Homelab::Wifi::_connectionAttemptStart) > Homelab::Wifi::maxWait)
        {
            Homelab::Logger::warnf(
                "Max wait exceeded trying to connect to %s, aborting and trying again\n",
                network->ssid.c_str());
            Homelab::Wifi::reconnect();
        }
        else if (Homelab::Time::millisSince(Homelab::Wifi::_lastConnectionMessage) > 10000)
        {
            float dt = Homelab::Time::millisSince(Homelab::Wifi::_lastConnectionMessage) / 1000.0f;
            Homelab::Logger::infof("Connecting to %s, %.1fs\n", ssid.c_str(), dt);
            Homelab::Wifi::_lastConnectionMessage = millis();
        }
    }
    else if (!Homelab::Wifi::isConnected())
    {
        if (network != nullptr)
            Homelab::Logger::warnf("Lost connection to %s, trying to reconnect\n", network->ssid.c_str());
        else
            Homelab::Logger::warf("No connection found, trying to reconnect");
        Homelab::Wifi::reconnect();
    }
    else
    {
        if (Homelab::Time::millisSince(Homelab::Wifi::_lastStrengthUpdate) > Homelab::Wifi::strengthUpdatePeriod)
        {
            float strength = Homelab::Wifi::getStrength();
            if (strength != Homelab::Wifi::strength)
            {
                Homelab::Wifi::strength = strength;
                Homelab::Wifi::callStrengthChangeCallbacks(Homelab::Wifi::strength);
            }
        }
    }
}