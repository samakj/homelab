

#ifndef _Homelab_Wifi_h
#define _Homelab_Wifi_h

#include <Arduino.h>
#include <string>
#include <vector>

#ifdef ESP8266
#include <ESP8266WiFi.h>
#else
#include <WiFi.h>
#endif

#include <Logger/Logger.h>
#include <Time/Time.h>
#include <Utils/Utils.h>

namespace Homelab::Wifi
{
    typedef std::string ssid_t;
    typedef float strength_t;

    struct Credentials
    {
        ssid_t ssid;
        std::string password;
    };

    typedef std::function<void(ssid_t ssid)> ConnectCallback;
    typedef std::function<void(ssid_t ssid)> SSIDChangeCallback;
    typedef std::function<void(strength_t strength)> StrengthChangeCallback;

    extern ssid_t SSID_NULL_VALUE;
    extern strength_t STRENGTH_NULL_VALUE;
    extern std::string IP_NULL_VALUE;
    extern std::string HOSTNAME_NULL_VALUE;

    extern std::vector<Credentials *> networks;
    extern Credentials *network;
    extern strength_t strength;
    extern std::string _hostname;
    extern std::string _ip;

    extern std::vector<ConnectCallback> connectCallbacks;
    extern std::vector<SSIDChangeCallback> ssidChangeCallbacks;
    extern std::vector<StrengthChangeCallback> strengthChangeCallbacks;

    extern bool _isConnecting;
    extern uint16_t _connectionAttemptStart;
    extern uint16_t _lastConnectionMessage;
    extern uint16_t maxWait;
    extern uint16_t strengthUpdatePeriod;
    extern uint16_t _lastStrengthUpdate;

    bool isConnecting();
    bool isConnected();
    std::string getMACAddress();
    std::string getIPAddress();
    std::string getHostname();
    ssid_t getSSID();
    strength_t getStrength();

    Credentials *getStrongestNetwork(std::vector<Credentials *> networks);

    void addConnectCallback(ConnectCallback callback);
    void addSSIDChangeCallback(SSIDChangeCallback callback);
    void addStrengthChangeCallback(StrengthChangeCallback callback);

    void callConnectCallbacks(std::string ssid);
    void callSSIDChangeCallbacks(std::string ssid);
    void callStrengthChangeCallbacks(strength_t strength);

    void setHostname(std::string hostname);
    void setIPAddress(std::string ip);
    void setMaxWait(uint16_t maxWait);
    void setStrengthUpdatePeriod(uint16_t strengthUpdatePeriod);

    std::string rawMACAddressToString(byte *mac);
    std::string rawIPAddressToString(IPAddress ip);

    void connect(
        Credentials *network,
        std::string hostname = HOSTNAME_NULL_VALUE,
        std::string ip = IP_NULL_VALUE);
    void connect(
        std::vector<Credentials *> networks,
        std::string hostname = HOSTNAME_NULL_VALUE,
        std::string ip = IP_NULL_VALUE);
    void reconnect();
    void loop();
};

#endif