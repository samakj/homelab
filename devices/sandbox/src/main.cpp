#include <Arduino.h>
#include <Homelab.h>

#include <string>

#include "callbacks.h"
#include "config.h"
#include "globals.h"

void setup()
{
  Homelab::Logger::info("---- Running setup ----");

  // // Set properties
  Homelab::Time::NTP::setServer(NTP_SERVER);
  Homelab::Wifi::addConnectCallback(onWifiConnect);
  Homelab::Wifi::addSSIDChangeCallback(onWifiSSIDChange);
  Homelab::Wifi::addStrengthChangeCallback(onWifiStrengthChange);
  Homelab::Time::NTP::addConnectCallbak(onNTPConnect);
  DHTSensor.addTemperatureCallback(onDHTTemperatureChange);
  DHTSensor.addHumidityCallback(onDHTHumidityChange);

  // Start wifi connection
  Homelab::Wifi::connect(WifiCredentials, HOSTNAME, IP_ADDRESS);

  // // Setup dht sensor
  DHTSensor.setup();
  Homelab::Logger::info("---- Setup complete ----");
}

unsigned long lastHeartbeat = 0;

void loop()
{
  if(Homelab::Time::millisSince(lastHeartbeat) > 15000)
  {
    Homelab::Logger::info("Heartbeat");
    lastHeartbeat = millis();
  }
  // Homelab::Wifi::loop();
  Homelab::Server::loop();
  Homelab::OTA::loop();
  DHTSensor.loop();
}
