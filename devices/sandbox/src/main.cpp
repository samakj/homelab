#include <Homelab.h>

void setup()
{
    Serial.begin(115200);
    while (!Serial)
        delay(10);

    Homelab::Logger::info("---- Running setup ----");

    Homelab::Logger::info("---- Setup complete ----");
}

void loop()
{
}
