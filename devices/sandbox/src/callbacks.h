#ifndef callbacks_h
#define callbacks_h

#include <Homelab.h>

#include "config.h"
#include "globals.h"
#include "tags.h"

void onWifiConnect(std::string ssid)
{
    Homelab::OTA::setup(HOSTNAME, OTA_PASSWORD);
    Homelab::Time::NTP::connect();
    Homelab::Server::setup();
};

void onWifiSSIDChange(std::string ssid)
{
    Homelab::Server::sendReport(ssid.c_str(), "name", WIFI_SSID_TAGS);
};

void onWifiStrengthChange(float strength)
{
    Homelab::Server::sendReport(strength * 100, "strength", WIFI_STRENGTH_TAGS);
};

void onNTPConnect(){};

void onDHTTemperatureChange(float temperature)
{
    Homelab::Server::sendReport(temperature, "temperature", DHT_TEMPERATURE_TAGS);
}

void onDHTHumidityChange(float humidity)
{
    Homelab::Server::sendReport(humidity, "humidity", DHT_HUMIDITY_TAGS);
}

#endif