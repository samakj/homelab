#include <Arduino.h>
#include <RotaryEncoder.h>
#include <algorithm>

#ifdef ESP8266
#include <ESP8266WiFi.h>
#endif

#include "defs.h"
#include "OTA.h"
#include "ticker.h"

uint8_t step = 8;
uint8_t ledMode = 0;
Homelab::Colour::HSL_t colour = {.hue = 0, .saturation = 255, .luminance = 128};
Homelab::Colour::HSL_t white = {.hue = 0, .saturation = 0, .luminance = 128};
bool valueChanged = false;

void updateLeds()
{
    Homelab::Colour::RGB_t rgb = Homelab::Colour::HSLToRGB({.hue = colour.hue, .saturation = colour.saturation, .luminance = std::min(colour.luminance, (uint8_t)127)});
    uint8_t _white = (std::max(colour.luminance, (uint8_t)128) - 128) * 2;

    switch (ledMode)
    {
    case 0:
        NeopixelsPeripheral.animateToColour(0, 0, 0, 0, 300);
        break;
    case 1:
        NeopixelsPeripheral.animateToColour(rgb.red, rgb.green, rgb.blue, _white, 300);
        break;
    case 2:
        NeopixelsPeripheral.animateToColour(0, 0, 0, white.luminance, 300);
        break;
    }
}

void buttonRelease()
{
    if (!valueChanged)
    {
        ledMode = (ledMode + 1) % 3;
        Serial.print(Homelab::getIsoTimestamp().c_str());
        Serial.print(": LED mode changed to ");
        Serial.println(ledMode);
        colour = {.hue = 0, .saturation = 255, .luminance = 128};
        white = {.hue = 0, .saturation = 0, .luminance = 128};
        updateLeds();
    }

    valueChanged = false;
}

void rotaryEncoderIncrease(long _position)
{

    bool buttonPressed = ButtonPeripheral.getState();

    if (buttonPressed && ledMode == 1)
        colour.hue += step;

    if (!buttonPressed && ledMode == 1 && colour.luminance < 255)
        colour.luminance += std::min(step, (uint8_t)(255 - colour.luminance));

    if (ledMode == 2 && white.luminance < 255)
        white.luminance += std::min(step, (uint8_t)(255 - white.luminance));

    updateLeds();

    if (buttonPressed)
    {
        valueChanged = true;
    }
}

void rotaryEncoderDecrease(long _position)
{
    bool buttonPressed = ButtonPeripheral.getState();

    if (buttonPressed && ledMode == 1)
        colour.hue -= step;

    if (!buttonPressed && ledMode == 1 && colour.luminance > 0)
        colour.luminance -= std::min(step, colour.luminance);

    if (ledMode == 2 && white.luminance > 0)
        white.luminance -= std::min(step, white.luminance);

    updateLeds();

    if (buttonPressed)
    {
        valueChanged = true;
    }
}

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

    ButtonPeripheral.addReleaseCallback("ButtonRelease", buttonRelease);
    RotaryEncoderPeripheral.addClockwiseCallback("RotaryEncoderIncrease", rotaryEncoderIncrease);
    RotaryEncoderPeripheral.addCounterClockwiseCallback("RotaryEncoderDecrease", rotaryEncoderDecrease);

    DHTSensor.begin();
    NeopixelsPeripheral.begin();
    ButtonPeripheral.begin();
    RotaryEncoderPeripheral.begin();

    startTicker();

    updateLeds();
}

void loop()
{
    ButtonPeripheral.loop();
    RotaryEncoderPeripheral.loop();
    Homelab::Scheduler->loop();
    ticks++;
}