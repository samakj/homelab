#ifndef callbacks_h
#define callbacks_h

#include <Homelab.h>

#include "config.h"
#include "globals.h"
#include "tags.h"

void onWifiConnect(std::string ssid) { Homelab::OTA::setup(HOSTNAME, OTA_PASSWORD); };

void onWifiSSIDChange(std::string ssid)
{
  if(ssid != Homelab::Wifi::SSID_NULL_VALUE)
    Homelab::Server::sendReport(ssid, "name", WIFI_SSID_TAGS);
  else Homelab::Server::sendReport(nullptr, "name", WIFI_SSID_TAGS);
};

void onWifiStrengthChange(float strength)
{
  if(strength != Homelab::Wifi::STRENGTH_NULL_VALUE)
    Homelab::Server::sendReport(strength * 100, "percentage", WIFI_STRENGTH_TAGS);
  else Homelab::Server::sendReport(nullptr, "percentage", WIFI_STRENGTH_TAGS);
};

void onNTPConnect() {};

void onDHTTemperatureChange(float temperature)
{
  if(temperature != Homelab::Sensors::DHT::TEMPERATURE_NULL_VALUE)
    Homelab::Server::sendReport(temperature, "temperature", DHT_TEMPERATURE_TAGS);
  else Homelab::Server::sendReport(nullptr, "temperature", DHT_TEMPERATURE_TAGS);
}

void onDHTHumidityChange(float humidity)
{
  if(humidity != Homelab::Sensors::DHT::HUMIDITY_NULL_VALUE)
    Homelab::Server::sendReport(humidity, "humidity", DHT_HUMIDITY_TAGS);
  else Homelab::Server::sendReport(nullptr, "humidity", DHT_HUMIDITY_TAGS);
}

void onSwitchStateChange(bool state) { Homelab::Server::sendReport(state, "open", SWITCH_TAGS); }

#endif