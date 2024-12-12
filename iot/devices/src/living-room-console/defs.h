#ifndef defs_h
#define defs_h

#include <Arduino.h>

#include "scheduler.h"
#include "sensors.h"
#include "server.h"
#include "peripherals.h"
#include "wifi.h"

uint16_t deviceId = 1;

Homelab::WifiCredentials_t credentials = {
    .ssid = WIFI_SSID,
    .password = WIFI_PASSWORD,
    .ip = IP_ADDRESS,
    .hostname = HOSTNAME,
};

Homelab::Sensors::DHT DHTSensor(D7, "dht");
Homelab::Sensors::TEMT6000 LightSensor(A0, "light-level");
Homelab::Peripherals::Neopixels NeopixelsPeripheral(46, D1, "leds");
Homelab::Peripherals::IRSender IRSenderPeripheral(D5, "ir-sender");

uint16_t ticks = 0;

#endif