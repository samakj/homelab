#include <Arduino.h>
// #include <RotaryEncoder.h>
// #include <algorithm>

#ifdef ESP8266
#include <ESP8266WiFi.h>
#else
#include <WiFi.h>
#endif

#include "defs.h"

void setup()
{
    Serial.begin(115200);

    // Give serial time to connect
    while (!Serial)
        ;
    delay(1000);

    ld2410s.begin();
}

void loop()
{
    ld2410s.loop();
}