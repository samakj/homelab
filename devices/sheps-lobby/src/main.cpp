#include <Arduino.h>
#include <Homelab.h>

#include <string>

#include "callbacks.h"
#include "config.h"
#include "globals.h"

void setup()
{
  Homelab::Logger::info("---- Running setup ----");

  // Set properties
  Homelab::Time::NTP::setServer(NTP_SERVER);
  Homelab::Wifi::addConnectCallback(onWifiConnect);
  Homelab::Wifi::addSSIDChangeCallback(onWifiSSIDChange);
  Homelab::Wifi::addStrengthChangeCallback(onWifiStrengthChange);
  Homelab::Time::NTP::addConnectCallbak(onNTPConnect);
  DHTSensor.addTemperatureCallback(onDHTTemperatureChange);
  DHTSensor.addHumidityCallback(onDHTHumidityChange);
  SwitchSensor.addSwitchCallback(onSwitchStateChange);

  // Start WiFi connection
  Homelab::Wifi::connect(WifiCredentials, HOSTNAME, IP_ADDRESS);

  // Setup DHT sensor
  DHTSensor.setup();

  // Setup Switch sensor
  SwitchSensor.setup();

  Homelab::Logger::info("---- Setup complete ----");
}

void loop()
{
  Homelab::Wifi::loop();
  Homelab::Time::NTP::loop();
  Homelab::Server::loop();
  Homelab::OTA::loop();
  DHTSensor.loop();
  SwitchSensor.loop();
}
