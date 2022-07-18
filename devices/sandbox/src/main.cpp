#include <Arduino.h>
#include <string>

#include <Homelab.h>

void setup()
{
    Homelab::Logger::info("---- Running setup ----");

    Homelab::Logger::info("---- Setup complete ----");
}

void loop()
{
    Serial.println(Homelab::Time::formatTime("%T").c_str());
    delay(1000);
}
