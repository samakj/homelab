#include "Time.h"

unsigned long Homelab::Time::millisDiff(unsigned long start, unsigned long end)
{
    if (end >= start)
        return end - start;
    unsigned long startOffset = std::numeric_limits<unsigned long>::max() - start;
    return end + startOffset;
};

unsigned long Homelab::Time::millisSince(unsigned long start)
{
    return Homelab::Time::millisDiff(start, millis());
};

std::string Homelab::Time::getIsoTimestamp()
{ 
    if (!Homelab::Time::NTP::isConnected())
        return std::string("                    ");
        
    char buffer[23];
    time_t tm = time(nullptr);
    strftime(buffer, 23, "%FT%TZ", gmtime(&tm));
    return std::string(buffer);
};

std::string Homelab::Time::formatTime(const char *format)
{ 
    char buffer[64];
    time_t tm = ::time(nullptr);
    strftime(buffer, sizeof(buffer), format, gmtime(&tm));
    return std::string(buffer);
};

// NTP

std::string Homelab::Time::NTP::server = "uk.pool.ntp.org";
uint16_t Homelab::Time::NTP::maxWait = 20000;
std::vector<Homelab::Time::NTP::ConnectCallback> Homelab::Time::NTP::connectCallbacks = {};
bool Homelab::Time::NTP::_isConnecting = false;

bool Homelab::Time::NTP::isConnecting() { return Homelab::Time::NTP::_isConnecting; };
bool Homelab::Time::NTP::isConnected() { return time(nullptr) > 1616000000; };

void Homelab::Time::NTP::setServer(std::string server) { Homelab::Time::NTP::server = server; };
void Homelab::Time::NTP::setMaxWait(uint16_t maxWait) { Homelab::Time::NTP::maxWait = maxWait; };

void Homelab::Time::NTP::addConnectCallbak(Homelab::Time::NTP::ConnectCallback callback)
{
    Homelab::Time::NTP::connectCallbacks.push_back(callback);
};

void Homelab::Time::NTP::connect(bool force)
{
    #ifndef _Homelab_Wifi_h
    return;
    #endif
    
    if (!Homelab::Wifi::isConnected())
        Homelab::Logger::warn("No internet connection, skiping NTP.");
    else if (force || (!Homelab::Time::NTP::isConnecting() && !Homelab::Time::NTP::isConnected()))
    {
        Homelab::Logger::debugf("Connecting NTP to %s", Homelab::Time::NTP::server.c_str());
        Homelab::Time::NTP::_isConnecting = true;
        // Re-sync every 10 minutes.
        sntp_set_sync_interval(1000 * 60 * 10);
        configTime(0, 0, Homelab::Time::NTP::server.c_str());
    }
};

void Homelab::Time::NTP::loop()
{
    if (!Homelab::Time::NTP::isConnected() && !Homelab::Time::NTP::isConnecting())
        connect();

    if (Homelab::Time::NTP::isConnected() && Homelab::Time::NTP::isConnecting())
    {
        Homelab::Logger::infof(
            "Synced with '%s'. Time: %s.\n",
            Homelab::Time::NTP::server.c_str(),
            Homelab::Time::getIsoTimestamp().c_str());

        for (
            Homelab::Time::NTP::ConnectCallback callback :
            Homelab::Time::NTP::connectCallbacks)
            callback();

        Homelab::Time::NTP::_isConnecting = false;
    }
};