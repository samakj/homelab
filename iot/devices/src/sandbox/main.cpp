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

    ButtonPeripheral.addReleaseCallback("ButtonRelease", buttonRelease);
    RotaryEncoderPeripheral.addClockwiseCallback("RotaryEncoderIncrease", rotaryEncoderIncrease);
    RotaryEncoderPeripheral.addCounterClockwiseCallback("RotaryEncoderDecrease", rotaryEncoderDecrease);

    DHTSensor.begin();
    // LightSensor.begin();
    NeopixelsPeripheral.begin();
    ButtonPeripheral.begin();
    RotaryEncoderPeripheral.begin();

    startTicker();

    updateLeds();

    /////
    // pinMode(A0, INPUT);
    CurrentSensor.begin();
}

unsigned long last = 0;
uint16_t readCount = 0;
uint16_t maxReadCount = 200;
uint16_t readValueCount[1024];
uint32_t readTotal = 0;
uint16_t minRead = 1024;
uint16_t maxRead = 0;
uint16_t noiseFloor = 2;
#define HISTORY_SIZE 4
float ampsHistory[HISTORY_SIZE];
uint8_t ampHistoryPointer = 0;
float ampsSmoothedValue = 0;

void loop()
{
    ArduinoOTA.handle();
    ButtonPeripheral.loop();
    RotaryEncoderPeripheral.loop();
    Homelab::Scheduler->loop();
    ticks++;

    // ////
    // if (millis() - last > 5)
    // {
    //     uint16_t readValue = analogRead(A0);

    //     readValueCount[readValue]++;
    //     readTotal += readValue;

    //     if (readValue < minRead)
    //         minRead = readValue;
    //     if (readValue > maxRead)
    //         maxRead = readValue;

    //     readCount++;
    //     last = millis();

    //     if (readCount >= maxReadCount)
    //     {
    //         uint16_t readAverage = readTotal / readCount;
    //         uint32_t weightedAnalogueValueDiff = 0;
    //         uint16_t includedReadCount = 0;

    //         if (maxRead - minRead > noiseFloor * 4)
    //             for (uint16_t i = 0; i < 1024; i++)
    //                 if (abs(i - readAverage) > noiseFloor && readValueCount[i])
    //                 {
    //                     weightedAnalogueValueDiff += readValueCount[i] * (abs(i - readAverage) - noiseFloor);
    //                     includedReadCount += readValueCount[i];
    //                     // Reset in loop to avoid second loop
    //                     readValueCount[i] = 0;
    //                 }

    //         weightedAnalogueValueDiff /= max((uint16_t)1, includedReadCount);

    //         float analogueVoltageDiff = 3.3 * weightedAnalogueValueDiff / (1024.0);
    //         float sensorVoltageDiff = analogueVoltageDiff / 0.666;
    //         float sensorRMSVoltageDiff = sensorVoltageDiff * 0.707106;
    //         float amps = sensorRMSVoltageDiff / 0.185; // 0.1 for 20A version
    //                                                    // Serial.printf("\ninclude read count: %d, diff: %d, v diff: %f, sensor v diff: %f, rms v diff: %f, amps: %f\n", includedReadCount, weightedAnalogueValueDiff, analogueVoltageDiff, sensorVoltageDiff, sensorRMSVoltageDiff, amps);

    //         Serial.printf("A: %03d, %03d, %03d\n", maxRead - minRead, readAverage, includedReadCount);

    //         readCount = 0;
    //         readTotal = 0;
    //         minRead = 1024;
    //         maxRead = 0;

    //         float historyAverage = 0;
    //         for (uint8_t i = 0; i < HISTORY_SIZE; i++)
    //             historyAverage += ampsHistory[i];
    //         historyAverage /= (float)HISTORY_SIZE;
    //         // Serial.printf("\n%f, %f, %f\n", historyAverage, ampsSmoothedValue, abs(amps - historyAverage));

    //         if (abs(amps - historyAverage) <= 0.1 * historyAverage && ampsSmoothedValue != amps)
    //         {
    //             ampsSmoothedValue = amps;
    //             // Serial.printf("\n---- %f ----\n", amps);
    //         }

    //         ampsHistory[ampHistoryPointer] = amps;
    //         ampHistoryPointer = (ampHistoryPointer + 1) % HISTORY_SIZE;
    //     }
    // }
    CurrentSensor.loop();
}

// #define SUM_MAX 500
// #define ADC_MAX 1024
// #define Noise_Filter 4
// #define Scaling 185.0
// #define Delay_Time 2

// int count = 0;
// int adc_avr = 0;
// int adc_min = 1024;
// int adc_max = 0;
// uint16_t vals[ADC_MAX + 1];
// unsigned long time_m;
// unsigned long time_mn;
// float Ieff;

// void do_measurements(int n)
// {
//     uint16_t last_adc_read;

//     // Take n measurements each loop
//     for (; n > 0; n--)
//     {
//         count++;
//         // Run when the total count of measurements is abouut the max calculate values
//         if (count >= SUM_MAX)
//         {
//             float U, Ueff;
//             float Sum_U_Square = 0.0;
//             count = 0;

//             // Divide the running total by the count to get the avergae
//             adc_avr = adc_avr / SUM_MAX;
//             int max_count = vals[adc_max];
//             int min_count = vals[adc_min];

//             // Loop throught the possible values of adc in vals list
//             for (int i = 0; i < ADC_MAX + 1; i++)
//             {
//                 if (i == adc_avr)
//                     Serial.print("XXX ");
//                 else if (!vals[i])
//                     Serial.print("  . ");
//                 else
//                     Serial.printf("%3d ", vals[i]);
//                 if (!(i % 64))
//                     Serial.println(" ");

//                 // If the adc has reported this value at least once
//                 if (vals[i] != 0)
//                 {
//                     // If this value is too close to average (midpoint of wave) then ignore it
//                     if (abs(i - adc_min) < Noise_Filter)
//                     // if (i - adc_min < Noise_Filter || adc_max - i < Noise_Filter)
//                     {
//                         U = ((float)(i - adc_avr)) / 1024 * 5000;
//                         Sum_U_Square += U * U * vals[i];
//                     }
//                     // Reset this values count
//                     vals[i] = 0;
//                 }
//             }
//             Ueff = sqrt(Sum_U_Square / SUM_MAX);
//             Ieff = Ueff / Scaling;
//             time_mn = millis();
//             time_m = time_mn;

//             Serial.printf("\n%3d, %.5fmv, %.5fA, %.1fW\n", adc_avr, Ueff, Ieff, Ieff * 240);

//             float max_weighting = ((adc_max - adc_avr) / 1024.0 * 5000) * max_count;
//             float min_weighting = ((adc_avr - adc_min) / 1024.0 * 5000) * min_count;
//             float total = max_count + min_count;
//             Ueff = sqrt((max_weighting + min_weighting) / (total));
//             Ieff = Ueff / Scaling;

//             Serial.printf("%3d, %.5fmv, %.5fA, %.1fW\n", adc_max - adc_min, Ueff, Ieff, Ieff * 240);

//             max_weighting = ((adc_max - adc_avr) / 1024.0 * 5000);
//             min_weighting = ((adc_avr - adc_min) / 1024.0 * 5000);
//             total = 2;
//             Ueff = sqrt((max_weighting + min_weighting) / (total));
//             Ieff = Ueff / Scaling;

//             Serial.printf("%3d, %.5fmv, %.5fA, %.1fW\n", adc_max - adc_min, Ueff, Ieff, Ieff * 240);

//             adc_avr = 0;
//             adc_min = 1024;
//             adc_max = 0;
//         }

//         // Read adc value
//         last_adc_read = analogRead(A0);
//         if (last_adc_read > ADC_MAX)
//         {
//             Serial.println("ADC error");
//             continue;
//         }
//         // Increment the list item with the adc read value
//         vals[last_adc_read]++;

//         if (last_adc_read > adc_max)
//             adc_max = last_adc_read;

//         if (last_adc_read < adc_min)
//             adc_min = last_adc_read;

//         // Add to adc running total
//         adc_avr += last_adc_read;
//         delay(Delay_Time);
//     }
// }

// void setup()
// {
//     Serial.begin(115200);
//     time_m = millis();
// }

// void loop()
// {
//     do_measurements(1);
// }