#ifndef _Homelab_Peripherals_IR_Sender_h
#define _Homelab_Peripherals_IR_Sender_h

#include <Arduino.h>
#include <ArduinoJson.h>

#include "datetime.h"
#include "logger.h"
#include "server.h"

namespace Homelab::Peripherals
{
    namespace TV
    {
        const uint8_t ADDRESS = 0x4;

        enum Command
        {
            POWER = 0x8,

            UP = 0x40,
            DOWN = 0x41,
            LEFT = 0x7,
            RIGHT = 0x6,

            OK = 0x44,

            _0 = 0x10,
            _1 = 0x11,
            _2 = 0x12,
            _3 = 0x13,
            _4 = 0x14,
            _5 = 0x15,
            _6 = 0x16,
            _7 = 0x17,
            _8 = 0x18,
            _9 = 0x19,

            GUIDE = 0xAB,
            MUTE = 0x9,
            HOME = 0x7C,
            SOURCE = 0xB,
            BACK = 0x28,
            SETTINGS = 0x43,

            RED_BUTTON = 0x72,
            GREEN_BUTTON = 0x71,
            YELLOW_BUTTON = 0x63,
            BLUE_BUTTON = 0x61,

            NETFLIX = 0x56,
            PRIME = 0x5C,
            DISNEY = 0x31,
            RAKTUKEN = 0x49,
            LG_CHANNELS = 0x48,

            UNKNOWN = 0x00,
        };
    }

    class IRSender
    {
    private:
        uint8_t pinNo;
        std::string id;

    public:
        IRSender(uint8_t pinNo, std::string id = "ir-sender");

        void begin();

        void sendNEC(uint16_t address, uint16_t command, uint8_t repeats = 0, bool report = true);
        void sendTVCommand(TV::Command command, bool longPress = false);

        std::string serialiseTVCommand(TV::Command command);
        TV::Command deserialiseTVCommand(std::string command);

        std::string getId();
        void getJsonValue(JsonVariant &json);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
        void receiveJsonValue(JsonVariant &json);
    };
}

#endif