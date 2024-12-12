/*
 * SendAndReceive.cpp
 *
 * Demonstrates sending IR codes and receiving it simultaneously
 *
 *  This file is part of Arduino-IRremote https://github.com/Arduino-IRremote/Arduino-IRremote.
 *
 ************************************************************************************
 * MIT License
 *
 * Copyright (c) 2021-2023 Armin Joachimsmeyer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 ************************************************************************************
 */

#include <Arduino.h>

// select only NEC and the universal decoder for pulse distance protocols
#define DECODE_NEC            // Includes Apple and Onkyo
#define DECODE_DISTANCE_WIDTH // In case NEC is not received correctly. Universal decoder for pulse distance width protocols

// #define EXCLUDE_UNIVERSAL_PROTOCOLS // Saves up to 1000 bytes program memory.
// #define EXCLUDE_EXOTIC_PROTOCOLS // saves around 650 bytes program memory if all other protocols are active
// #define NO_LED_FEEDBACK_CODE      // saves 92 bytes program memory
// #define RECORD_GAP_MICROS 12000   // Default is 8000. Activate it for some LG air conditioner protocols
// #define SEND_PWM_BY_TIMER         // Disable carrier PWM generation in software and use (restricted) hardware PWM.
// #define USE_NO_SEND_PWM           // Use no carrier PWM, just simulate an active low receiver signal. Overrides SEND_PWM_BY_TIMER definition

// #define DEBUG // Activate this for lots of lovely debug output from the decoders.

#include "PinDefinitionsAndMore.h" // Define macros for input and output pin etc.
#include <IRremote.hpp>
#include "defs.cpp"

#define DELAY_AFTER_SEND 2000
#define DELAY_AFTER_LOOP 5000

void setup()
{
    Serial.begin(115200);

    // Start the receiver and if not 3. parameter specified, take LED_BUILTIN pin from the internal boards definition as default feedback LED
    IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK);
    IrSender.begin(); // Start with IR_SEND_PIN -which is defined in PinDefinitionsAndMore.h- as send pin and enable feedback LED at default feedback LED pin
}

/*
 * Send NEC IR protocol
 */
void send_ir_data()
{
    Serial.printf("Sending  address: 0x%x, command: 0x%x, repeats: %d\n", ADDRESS, POWER_COMMAND, 1);
    IrSender.sendNEC(ADDRESS, POWER_COMMAND, 1);
}

void receive_ir_data()
{
    if (IrReceiver.decode())
    {
        Serial.printf("Received address: 0x%x, command: 0x%x, protocol: %s, raw: 0x%llx\n", IrReceiver.decodedIRData.address, IrReceiver.decodedIRData.command, getProtocolString(IrReceiver.decodedIRData.protocol), IrReceiver.decodedIRData.decodedRawData);
        IrReceiver.resume();
    }
}

unsigned long lastSend = 0;

void loop()
{
    if (millis() - lastSend > 1000)
    {
        send_ir_data();
        lastSend = millis();
        IrReceiver.restartAfterSend(); // Is a NOP if sending does not require a timer.

        // wait for the receiver state machine to detect the end of a protocol
        delay((RECORD_GAP_MICROS / 1000) + 5);
        receive_ir_data();
    }
}