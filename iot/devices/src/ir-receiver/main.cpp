#include <Arduino.h>
#include <IRremoteESP8266.h>
// #include <assert.h>
// #include <IRrecv.h>
// #include <IRac.h>
// #include <IRtext.h>
// #include <IRutils.h>
#include <IRsend.h>

const uint16_t kIrLed = D2;

// const uint16_t kRecvPin = D2;
// const uint32_t kBaudRate = 115200;
// const uint16_t kCaptureBufferSize = 1024;
// const uint8_t kTimeout = 15;
// const uint16_t kMinUnknownSize = 12;
// const uint8_t kTolerancePercentage = kTolerance;

// IRrecv irrecv(kRecvPin, kCaptureBufferSize, kTimeout, true);
// decode_results results;

IRsend irsend(kIrLed);

#define POWER 0x20DF10EF
// const uint64_t VOLUME_UP = 0x20DF40BF;
// const uint64_t VOLUME_DOWN = 0x20DFC03F;
// const uint64_t CHANNEL_UP = 0x20DF00FF;
// const uint64_t CHANNEL_DOWN = 0x20DF807F;
// const uint64_t MUTE = 0x20DF906F;
// const uint64_t HOME = 0x20DF3EC1;
// const uint64_t SOURCE = 0x20DFD02F;
// const uint64_t BACK = 0x20DF14EB;
// const uint64_t SETTINGS = 0x20DFC23D;

void setup()
{
    Serial.begin(115200);

    // Give serial time to connect
    while (!Serial)
        ;
    delay(1000);

    // assert(irutils::lowLevelSanityCheck() == 0);
    // Serial.printf("\n" D_STR_IRRECVDUMP_STARTUP "\n", kRecvPin);
    // irrecv.setTolerance(kTolerancePercentage);
    // irrecv.enableIRIn();

    irsend.begin();
}

unsigned long lastSend = 0;
void loop()
{
    // // Check if the IR code has been received.
    // if (irrecv.decode(&results))
    // {
    //     // Display a crude timestamp.
    //     uint32_t now = millis();
    //     Serial.printf(D_STR_TIMESTAMP " : %06u.%03u\n", now / 1000, now % 1000);
    //     // Check if we got an IR message that was to big for our capture buffer.
    //     if (results.overflow)
    //         Serial.printf(D_WARN_BUFFERFULL "\n", kCaptureBufferSize);
    //     // Display the library version the message was captured with.
    //     Serial.println(D_STR_LIBRARY "   : v" _IRREMOTEESP8266_VERSION_STR "\n");
    //     // Display the tolerance percentage if it has been change from the default.
    //     if (kTolerancePercentage != kTolerance)
    //         Serial.printf(D_STR_TOLERANCE " : %d%%\n", kTolerancePercentage);
    //     // Display the basic output of what we found.
    //     Serial.print(resultToHumanReadableBasic(&results));
    //     // Display any extra A/C info if we have it.
    //     String description = IRAcUtils::resultAcToString(&results);
    //     if (description.length())
    //         Serial.println(D_STR_MESGDESC ": " + description);
    //     yield(); // Feed the WDT as the text output can take a while to print.
    //     // Output the results as source code
    //     Serial.println(resultToSourceCode(&results));
    //     Serial.println(); // Blank line between entries
    //     yield();          // Feed the WDT (again)
    // }

    if (millis() - lastSend > 10000)
    {
        irsend.sendNEC(POWER);
        lastSend = millis();
    }
}