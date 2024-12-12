#ifndef _Homelab_Peripherals_Neopixel_h
#define _Homelab_Peripherals_Neopixel_h

#include <Arduino.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <algorithm>
#include <string>

#include "scheduler.h"
#include "datetime.h"
#include "server.h"

namespace Homelab::Peripherals
{
    struct NeopixelColour_t
    {
        uint8_t red;
        uint8_t green;
        uint8_t blue;
        uint8_t white;

        std::string toString();
    };

    struct OptionalNeopixelColour_t
    {
        std::optional<uint8_t> red;
        std::optional<uint8_t> green;
        std::optional<uint8_t> blue;
        std::optional<uint8_t> white;

        std::string toString();
    };

    struct NeopixelState_t
    {
        std::vector<NeopixelColour_t> pixelColours;
    };

    struct OptionalNeopixelState_t
    {
        std::vector<OptionalNeopixelColour_t> pixelColours;
    };

    struct Animation_t
    {
        NeopixelState_t initial;
        NeopixelState_t target;
        uint32_t start;
        uint16_t durationMs;
    };

    class Neopixels
    {
    private:
        Adafruit_NeoPixel *client;
        uint16_t noPixels;
        uint8_t pinNo;
        neoPixelType type;
        std::vector<NeopixelColour_t> pixelColours;

        bool hasChanged = false;
        std::string id;

        std::optional<Animation_t> animation;

    public:
        Neopixels(uint16_t _noPixels, uint8_t _pin, std::string _id = "neopixels", neoPixelType _type = NEO_GRBW + NEO_KHZ800);

        NeopixelColour_t unpack(uint32_t colour);

        void setPixelColour(uint16_t pixelIndex, uint32_t colour);
        void setPixelColour(uint16_t pixelIndex, uint8_t red, uint8_t green, uint8_t blue, uint8_t white);
        void setColour(uint32_t colour);
        void setColour(uint8_t red, uint8_t green, uint8_t blue, uint8_t white);
        void setState(OptionalNeopixelState_t state);

        void animateTo(OptionalNeopixelState_t target, uint16_t durationMs);
        void animateToColour(OptionalNeopixelColour_t target, uint16_t durationMs);
        void animateToColour(uint8_t red, uint8_t green, uint8_t blue, uint8_t white, uint16_t durationMs);

        NeopixelState_t getState();
        NeopixelColour_t getPixelColour(uint16_t pixelIndex);
        std::vector<NeopixelColour_t> getColour();
        NeopixelColour_t getInterpolatedPixelColour(uint16_t pixelIndex, unsigned long ms);

        void applyAnimationStep();
        float easeInOut(float progress);

        std::string getId();
        void getJsonValue(JsonVariant &json);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
        void receiveJsonValue(JsonVariant &json);

        void begin();

        void displayTask(Homelab::SchedulerTaskCallbackArg_t *arg);
    };
}

#endif