#include <Arduino.h>
#include <RotaryEncoder.h>
#include <algorithm>

#ifdef ESP8266
#include <ESP8266WiFi.h>
#endif

#include "defs.h"
#include "OTA.h"
#include "ticker.h"

void setup()
{
    Serial.begin(115200);

    // Give serial time to connect
    while (!Serial)
        ;
    delay(1000);

    Homelab::OTA::begin(HOSTNAME, OTA_PASSWORD);

    Homelab::Wifi->setCredentials(credentials);
    Homelab::Wifi->addConnectCallback("NTPConnect", std::bind(&Homelab::NTPClass::wifiConnectCallback, Homelab::NTP));
    Homelab::Wifi->addConnectCallback("ServerSetup", std::bind(&Homelab::ServerClass::setup, Homelab::Server));
    Homelab::Wifi->connect();

    Homelab::Server->addSource(Homelab::Wifi->getId(), []()
                               { return Homelab::Wifi->getJsonValue(); }, []()
                               { return Homelab::Wifi->getJsonSchemaValue(); });
    Homelab::Server->addSource(Homelab::Wifi->getId() + "/config", []()
                               { return Homelab::Wifi->getConfigureJsonValue(); }, []()
                               { return Homelab::Wifi->getConfigureJsonSchemaValue(); });
    Homelab::Server->addSource(Homelab::NTP->getId(), []()
                               { return Homelab::NTP->getJsonValue(); }, []()
                               { return Homelab::NTP->getJsonSchemaValue(); });
    Homelab::Server->addSource(Homelab::NTP->getId() + "/config", []()
                               { return Homelab::NTP->getConfigureJsonValue(); }, []()
                               { return Homelab::NTP->getConfigureJsonSchemaValue(); });

    DHTSensor.begin();
    IRSenderPeripheral.begin();
    LightSensor.begin();
    NeopixelsPeripheral.begin();

    startTicker();
}

void loop()
{
    ArduinoOTA.handle();
    Homelab::Scheduler->loop();
    ticks++;
}