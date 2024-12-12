#include <Arduino.h>
#include <RCSwitch.h>

RCSwitch mySwitch = RCSwitch();

void setup()
{
    Serial.begin(115200);
    pinMode(GPIO_NUM_25, INPUT);
    // mySwitch.enableReceive(digitalPinToInterrupt(GPIO_NUM_25)); // Receiver on interrupt 0 => that is pin #2
}

void loop()
{
    if (mySwitch.available())
    {
        auto raw = mySwitch.getReceivedRawdata();
        auto length = mySwitch.getReceivedBitlength();
        for (unsigned int i = 0; i <= length * 2; i++)
        {
            Serial.print(raw[i]);
            Serial.print(",");
        }
        mySwitch.resetAvailable();
    }
}