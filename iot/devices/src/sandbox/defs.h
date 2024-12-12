#ifndef defs_h
#define defs_h

#include <Arduino.h>

#include "scheduler.h"
#include "sensors.h"
#include "server.h"
#include "peripherals.h"
#include "wifi.h"

#define DHT_SENSORS \
    (std::vector<Homelab::Sensors::DHT>) { DHTSensor }

// #define LIGHT_LEVEL_SENSORS \
//     (std::vector<Homelab::Sensors::TEMT6000>) { LightSensor }

#define BUTTON_PERIPHERALS \
    (std::vector<Homelab::Peripherals::Button>) { ButtonPeripheral }

#define ROTARY_ENCODER_PERIPHERALS \
    (std::vector<Homelab::Peripherals::RotaryEncoder>) { RotaryEncoderPeripheral }

uint16_t deviceId = 1;

Homelab::WifiCredentials_t credentials = {
    .ssid = WIFI_SSID,
    .password = WIFI_PASSWORD,
    .ip = IP_ADDRESS,
    .hostname = HOSTNAME,
};

Homelab::Sensors::DHT DHTSensor(D7, "dht");
Homelab::Sensors::ACS712 CurrentSensor(A0, "current");
Homelab::Peripherals::Neopixels NeopixelsPeripheral(29, 4, "leds");
Homelab::Peripherals::Button ButtonPeripheral(5, "button", INPUT_PULLUP, false);
Homelab::Peripherals::RotaryEncoder RotaryEncoderPeripheral({D5, D6}, "dial");

uint16_t ticks = 0;

#endif