#ifndef _Homelab_Utils_h
#define _Homelab_Utils_h

#include <Arduino.h>
#include <algorithm>
#include <sstream>
#include <string>
#include <vector>

namespace Homelab
{
    namespace string
    {
        std::vector<std::string> split(std::string string, char delimeter = ',');
        std::string join(std::vector<std::string> list, char delimeter = ',');
        void replaceAll(std::string &s, std::string const &toReplace, std::string const &replaceWith);
        void leftTrim(std::string &s);
        void rightTrim(std::string &s);
        void trim(std::string &s);
    }

    namespace GPIO
    {
        extern std::vector<std::string> serialisedPinModes;
        bool isSerialisedPinMode(std::string);
        std::string serialisePinMode(uint8_t pinMode);
        uint8_t deserialisePinMode(std::string pinMode);
    }

    namespace Colour
    {
        struct RGB_t
        {

            uint8_t red;
            uint8_t green;
            uint8_t blue;
        };
        struct HSL_t
        {

            uint8_t hue;
            uint8_t saturation;
            uint8_t luminance;
        };

        HSL_t RGBToHSL(RGB_t rbg);
        RGB_t HSLToRGB(HSL_t hsl);

        float hueToRGB(float p, float q, float t);
    }

    namespace number
    {
        uint8_t circularAdd(uint8_t valueA, uint8_t valueB = 1);
        uint8_t circularSubtract(uint8_t largerValue, uint8_t smallerValue = 1);
    }
}

#endif