#ifndef globals_h
#define globals_h

#include <Homelab.h>

#include "config.h"

Homelab::Wifi::Credentials PurleyParkWifiCredentials(PURLEY_PARK_SSID, PURLEY_PARK_PASSWORD);
Homelab::Wifi::Credentials TheValeWifiCredentials(THE_VALE_SSID, THE_VALE_PASSWORD);
std::vector<Homelab::Wifi::Credentials*> WifiCredentials = {&PurleyParkWifiCredentials, &TheValeWifiCredentials};

Homelab::Sensors::DHT DHTSensor(DHT_PIN);

#endif