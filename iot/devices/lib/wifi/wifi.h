#ifndef _Homelab_Wifi_h
#define _Homelab_Wifi_h

#include <Arduino.h>
#include <ArduinoJson.h>
#include <map>
#include <optional>
#include <string>

#ifdef ESP8266
#include <ESP8266WiFi.h>
#else
#include <WiFi.h>
#endif

#include "datetime.h"
#include "scheduler.h"
#include "utils.h"

namespace Homelab
{
    struct WifiCredentials_t
    {
        std::string ssid;
        std::string password;
        std::optional<std::string> ip;
        std::optional<std::string> hostname;
    };

    enum WifiStrength_t
    {
        EXCELLENT,
        GOOD,
        MEDIUM,
        WEAK,
        MINIMAL
    };

    typedef std::function<void(std::optional<std::string> ssid)> WifiConnectCallback_t;
    typedef std::function<void(std::optional<WifiStrength_t> strength)> WifiStrengthChangeCallback_t;

    extern std::string WIFI_CONNECTING_TASK_NAME;
    extern std::string WIFI_CONNECTED_TASK_NAME;

    class WifiClass
    {
    private:
        static WifiClass *instance;
        WifiClass() {}

        std::map<std::string, Homelab::WifiConnectCallback_t> connectCallbacks;
        std::map<std::string, Homelab::WifiStrengthChangeCallback_t> strengthChangeCallbacks;

        std::optional<Homelab::WifiCredentials_t> credentials;
        std::optional<std::string> ssid;
        std::optional<std::string> mac;
        std::optional<std::string> ip;
        std::optional<std::string> hostname;
        std::optional<float> rssi;
        std::optional<Homelab::WifiStrength_t> strength;
        boolean isConnecting;

        uint32_t connectionAttemptStart;

    public:
        WifiClass(const WifiClass &obj) = delete;
        static WifiClass *getInstance();

        std::optional<Homelab::WifiCredentials_t> getCredentials();
        std::optional<std::string> getSSID();
        std::optional<std::string> getMAC();
        std::optional<std::string> getIP();
        std::optional<std::string> getHostname();
        std::optional<float> getRSSI();
        std::optional<WifiStrength_t> getStrength();
        boolean getIsConnected();
        boolean getIsConnecting();

        void updateSSID();
        void updateMAC();
        void updateIP();
        void updateHostname();
        void updateRSSI();
        void updateStrength();

        void setCredentials(WifiCredentials_t credentials);

        void addConnectCallback(std::string name, WifiConnectCallback_t callback);
        void addStrengthChangeCallback(std::string name, WifiStrengthChangeCallback_t callback);

        void deleteConnectCallback(std::string name);
        void deleteStrengthChangeCallback(std::string name);

        void connect();
        void connectingTask(Homelab::SchedulerTaskCallbackArg_t *arg);
        void connectedTask(Homelab::SchedulerTaskCallbackArg_t *arg);

        std::string getId();
        void getJsonValue(JsonVariant &json);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
    };

    Homelab::WifiStrength_t rssiToStrength(float rssi);
    std::string serialiseStrength(WifiStrength_t strength);
    std::string rawMACAddressToString(byte *mac);
    std::string rawIPAddressToString(IPAddress ip);

    extern WifiClass *Wifi;
}

#endif