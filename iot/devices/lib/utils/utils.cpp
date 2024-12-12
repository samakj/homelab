#include "utils.h"

std::vector<std::string> Homelab::string::split(std::string string, char delimeter)
{
    std::vector<std::string> out = {};
    std::istringstream stream(string);
    uint8_t counter = 0;
    for (std::string part; std::getline(stream, part, delimeter); counter++)
        out.push_back(part);
    return out;
}

std::string Homelab::string::join(std::vector<std::string> list, char delimeter)
{
    std::string out = "";
    for (std::string part : list)
    {
        out += part;
        out += delimeter;
    }
    out.pop_back();
    return out;
}

void Homelab::string::replaceAll(std::string &s, std::string const &toReplace, std::string const &replaceWith)
{
    std::string buf;
    std::size_t pos = 0;
    std::size_t prevPos;

    // Reserves rough estimate of final size of string.
    buf.reserve(s.size());

    while (true)
    {
        prevPos = pos;
        pos = s.find(toReplace, pos);
        if (pos == std::string::npos)
            break;
        buf.append(s, prevPos, pos - prevPos);
        buf += replaceWith;
        pos += toReplace.size();
    }

    buf.append(s, prevPos, s.size() - prevPos);
    s.swap(buf);
}

void Homelab::string::leftTrim(std::string &s)
{
    if (std::isspace(s.front()))
        s.erase(0, 1);
}

void Homelab::string::rightTrim(std::string &s)
{
    if (std::isspace(s.back()))
        s.erase(s.size() - 1, 1);
}

void Homelab::string::trim(std::string &s)
{
    Homelab::string::leftTrim(s);
    Homelab::string::rightTrim(s);
}

std::vector<std::string> Homelab::GPIO::serialisedPinModes = {
    "INPUT",
#ifdef INPUT_PULLUP
    "INPUT_PULLUP",
#endif
#ifdef INPUT_PULLDOWN_16
    "INPUT_PULLDOWN_16",
#endif
    "OUTPUT",
#ifdef OUTPUT_OPEN_DRAIN
    "OUTPUT_OPEN_DRAIN",
#endif
#ifdef WAKEUP_PULLUP
    "WAKEUP_PULLUP",
#endif
#ifdef WAKEUP_PULLDOWN
    "WAKEUP_PULLDOWN",
#endif
};

bool Homelab::GPIO::isSerialisedPinMode(std::string pinMode)
{
    for (std::string &_pinMode : Homelab::GPIO::serialisedPinModes)
        if (_pinMode == pinMode)
            return true;

    return false;
}

std::string Homelab::GPIO::serialisePinMode(uint8_t pinMode)
{
    switch (pinMode)
    {
    case INPUT:
        return (std::string) "INPUT";
#ifdef INPUT_PULLUP
    case INPUT_PULLUP:
        return (std::string) "INPUT_PULLUP";
#endif
#ifdef INPUT_PULLDOWN_16
    case INPUT_PULLDOWN_16:
        return (std::string) "INPUT_PULLDOWN_16";
#endif
    case OUTPUT:
        return (std::string) "OUTPUT";
#ifdef OUTPUT_OPEN_DRAIN
    case OUTPUT_OPEN_DRAIN:
        return (std::string) "OUTPUT_OPEN_DRAIN";
#endif
#ifdef WAKEUP_PULLUP
    case WAKEUP_PULLUP:
        return (std::string) "WAKEUP_PULLUP";
#endif
#ifdef WAKEUP_PULLDOWN
    case WAKEUP_PULLDOWN:
        return (std::string) "WAKEUP_PULLDOWN";
#endif
    }

    char buff[8];
    sprintf(buff, "0x%02x", pinMode);

    return (std::string)buff;
};

uint8_t Homelab::GPIO::deserialisePinMode(std::string pinMode)
{
#ifdef INPUT_PULLUP
    if (pinMode == "INPUT_PULLUP")
        return INPUT_PULLUP;
#endif
#ifdef INPUT_PULLDOWN_16
    if (pinMode == "INPUT_PULLDOWN_16")
        return INPUT_PULLDOWN_16;
#endif
    if (pinMode == "OUTPUT")
        return OUTPUT;
#ifdef OUTPUT_OPEN_DRAIN
    if (pinMode == "OUTPUT_OPEN_DRAIN")
        return OUTPUT_OPEN_DRAIN;
#endif
#ifdef WAKEUP_PULLUP
    if (pinMode == "WAKEUP_PULLUP")
        return WAKEUP_PULLUP;
#endif
#ifdef WAKEUP_PULLDOWN
    if (pinMode == "WAKEUP_PULLDOWN")
        return WAKEUP_PULLDOWN;
#endif
    return INPUT;
};

Homelab::Colour::HSL_t Homelab::Colour::RGBToHSL(Homelab::Colour::RGB_t rgb)
{
    Homelab::Colour::HSL_t hsl = {
        .hue = 0,
        .saturation = 0,
        .luminance = 0,
    };

    uint8_t max = std::max(rgb.red, std::max(rgb.green, rgb.blue));
    uint8_t min = std::min(rgb.red, std::min(rgb.green, rgb.blue));

    hsl.hue = hsl.saturation = hsl.luminance = (uint8_t)(((uint16_t)(max) + (uint16_t)(min)) / 2);

    if (min == max)
        hsl.hue = hsl.saturation = 0;
    else
    {
        float r = rgb.red / 255.0f;
        float g = rgb.green / 255.0f;
        float b = rgb.blue / 255.0f;
        float h = 0;
        float s = 0;
        float l = 0;

        float d = (max - min) / 255.0f;
        l = d / 2;
        s = d >= 0.5 ? d / (2 - max - min) : d / (max + min);

        if (max == r)
        {
            h = (g - b) / d + (g < b ? 6 : 0);
        }
        else if (max == g)
        {
            h = (b - r) / d + 2;
        }
        else if (max == b)
        {
            h = (r - g) / d + 4;
        }

        h /= 6;

        hsl.hue = (uint8_t)round(h * 255);
        hsl.saturation = (uint8_t)round(s * 255);
        hsl.luminance = (uint8_t)round(l * 255);
    }

    return hsl;
}

float Homelab::Colour::hueToRGB(float p, float q, float t)
{
    if (t < 0)
        t += 1;
    if (t > 1)
        t -= 1;
    if (t < 1. / 6)
        return p + (q - p) * 6 * t;
    if (t < 1. / 2)
        return q;
    if (t < 2. / 3)
        return p + (q - p) * (2. / 3 - t) * 6;

    return p;
}

Homelab::Colour::RGB_t Homelab::Colour::HSLToRGB(Homelab::Colour::HSL_t hsl)
{
    Homelab::Colour::RGB_t rgb = {
        .red = 0,
        .green = 0,
        .blue = 0,
    };

    if (hsl.saturation == 0)
        rgb.red = rgb.green = rgb.blue = hsl.luminance;
    else
    {
        float h = hsl.hue / 255.0f;
        float s = hsl.saturation / 255.0f;
        float l = hsl.luminance / 255.0f;

        float q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        float p = 2 * l - q;

        rgb.red = (uint8_t)round(Homelab::Colour::hueToRGB(p, q, h + 1. / 3) * 255);
        rgb.green = (uint8_t)round(Homelab::Colour::hueToRGB(p, q, h) * 255);
        rgb.blue = (uint8_t)round(Homelab::Colour::hueToRGB(p, q, h - 1. / 3) * 255);
    }

    return rgb;
}

uint8_t Homelab::number::circularAdd(uint8_t value, uint8_t increment)
{
    if (255 - increment < value)
    {
        uint8_t max = (255 - increment);
        return value - max;
    }
    return value + increment;
}

uint8_t Homelab::number::circularSubtract(uint8_t largerValue, uint8_t smallerValue)
{
    if (largerValue < smallerValue)
    {
        uint8_t offset = (255 - smallerValue);
        return offset + largerValue;
    }
    return largerValue - smallerValue;
}