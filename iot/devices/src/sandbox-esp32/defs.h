#ifndef defs_h
#define defs_h

#include <Arduino.h>

#include "scheduler.h"
#include "server.h"
#include "wifi.h"
#include "sensors.h"

uint16_t deviceId = 1;

Homelab::WifiCredentials_t credentials = {
    .ssid = "Happy Wifi, Happy Lifi",
    .password = "marjorie",
    .ip = IP_ADDRESS,
    .hostname = HOSTNAME,
};

Homelab::Sensors::LD2410S ld2410s(32, 33);

uint16_t ticks = 0;

#endif