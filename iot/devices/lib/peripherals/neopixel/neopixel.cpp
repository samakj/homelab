#include "neopixel.h"

std::string Homelab::Peripherals::NeopixelColour_t::toString()
{
    char buff[32];
    sprintf(buff, "red=%d, green=%d, blue=%d, white=%d", this->red, this->green, this->blue, this->white);
    return buff;
}
std::string Homelab::Peripherals::OptionalNeopixelColour_t::toString()
{
    char buff[32];

    if (this->red.has_value())
        sprintf(buff + strlen(buff), "red=%d, ", this->red.value());
    if (this->green.has_value())
        sprintf(buff + strlen(buff), "green=%d, ", this->green.value());
    if (this->blue.has_value())
        sprintf(buff + strlen(buff), "blue=%d, ", this->blue.value());
    if (this->white.has_value())
        sprintf(buff + strlen(buff), "white=%d, ", this->white.value());

    std::string str = buff;
    if (str.size())
    {
        str.pop_back();
        str.pop_back();
        return str;
    }

    return "-";
}

Homelab::Peripherals::Neopixels::Neopixels(uint16_t _noPixels, int8_t _pinNo, std::string _id, neoPixelType _type) : noPixels(_noPixels), pinNo(_pinNo), id(_id), type(_type)
{
    std::string id = this->getId();

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
        this->pixelColours.push_back({.red = 0, .green = 0, .blue = 0, .white = 0});

    Homelab::Server->addSource(id, [this]()
                               { return Homelab::Peripherals::Neopixels::getJsonValue(); }, [this]()
                               { return Homelab::Peripherals::Neopixels::getJsonSchemaValue(); });
    Homelab::Server->addSource(id + "/config", [this]()
                               { return Homelab::Peripherals::Neopixels::getConfigureJsonValue(); }, [this]()
                               { return Homelab::Peripherals::Neopixels::getConfigureJsonSchemaValue(); });
    Homelab::Server->addSink(id, [this](std::string json)
                             { return Homelab::Peripherals::Neopixels::receiveJsonValue(json); }, [this]()
                             { return Homelab::Peripherals::Neopixels::receiveJsonSchemaValue(); });
}

Homelab::Peripherals::NeopixelColour_t Homelab::Peripherals::Neopixels::unpack(uint32_t colour)
{
    NeopixelColour_t _colour = {
        .red = (uint8_t)((colour >> 16) & 0xFF),
        .green = (uint8_t)((colour >> 8) & 0xFF),
        .blue = (uint8_t)((colour) & 0xFF),
        .white = (uint8_t)((colour >> 24) & 0xFF)};

    return _colour;
}

void Homelab::Peripherals::Neopixels::setPixelColour(uint16_t pixelIndex, uint8_t red, uint8_t green, uint8_t blue, uint8_t white)
{
    this->client->setPixelColor(pixelIndex, red, green, blue, white);
    this->pixelColours[pixelIndex].red = red;
    this->pixelColours[pixelIndex].green = green;
    this->pixelColours[pixelIndex].blue = blue;
    this->pixelColours[pixelIndex].white = white;

    this->hasChanged = true;
}

void Homelab::Peripherals::Neopixels::setPixelColour(uint16_t pixelIndex, uint32_t _colour)
{
    this->client->setPixelColor(pixelIndex, _colour);

    NeopixelColour_t colour = this->unpack(_colour);
    this->pixelColours[pixelIndex].red = colour.red;
    this->pixelColours[pixelIndex].green = colour.green;
    this->pixelColours[pixelIndex].blue = colour.blue;
    this->pixelColours[pixelIndex].white = colour.white;

    this->hasChanged = true;
}

void Homelab::Peripherals::Neopixels::setColour(uint8_t red, uint8_t green, uint8_t blue, uint8_t white)
{
    this->animation.reset();

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
        this->setPixelColour(pixelIndex, red, green, blue, white);

    this->hasChanged = true;
}

void Homelab::Peripherals::Neopixels::setColour(uint32_t colour)
{
    this->animation.reset();

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
        this->setPixelColour(pixelIndex, colour);

    this->hasChanged = true;
}

void Homelab::Peripherals::Neopixels::setState(Homelab::Peripherals::OptionalNeopixelState_t state)
{
    this->animation.reset();

    NeopixelState_t current = this->getState();

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
        if (state.pixelColours.size() > pixelIndex)
        {
            OptionalNeopixelColour_t pixelColour = state.pixelColours[pixelIndex];
            this->setPixelColour(
                pixelIndex,
                pixelColour.red.has_value() ? pixelColour.red.value() : current.pixelColours[pixelIndex].red,
                pixelColour.green.has_value() ? pixelColour.green.value() : current.pixelColours[pixelIndex].green,
                pixelColour.blue.has_value() ? pixelColour.blue.value() : current.pixelColours[pixelIndex].blue,
                pixelColour.white.has_value() ? pixelColour.white.value() : current.pixelColours[pixelIndex].white);
        }
}

void Homelab::Peripherals::Neopixels::animateTo(Homelab::Peripherals::OptionalNeopixelState_t target, uint16_t durationMs)
{
    this->animation.reset();

    NeopixelState_t initial = this->getState();
    NeopixelState_t _target = {};

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
        if (target.pixelColours.size() > pixelIndex)
        {
            OptionalNeopixelColour_t pixelColour = target.pixelColours[pixelIndex];
            _target.pixelColours.push_back({.red = pixelColour.red.has_value() ? pixelColour.red.value() : initial.pixelColours[pixelIndex].red,
                                            .green = pixelColour.green.has_value() ? pixelColour.green.value() : initial.pixelColours[pixelIndex].green,
                                            .blue = pixelColour.blue.has_value() ? pixelColour.blue.value() : initial.pixelColours[pixelIndex].blue,
                                            .white = pixelColour.white.has_value() ? pixelColour.white.value() : initial.pixelColours[pixelIndex].white});
        }
        else
        {
            _target.pixelColours.push_back(initial.pixelColours[pixelIndex]);
        }

    Animation_t _animation = {.initial = initial, .target = _target, .start = millis(), .durationMs = durationMs};

    this->animation = _animation;
    this->hasChanged = true;
}

void Homelab::Peripherals::Neopixels::animateToColour(OptionalNeopixelColour_t target, uint16_t durationMs)
{
    this->animation.reset();

    OptionalNeopixelState_t _target = {};

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
    {
        _target.pixelColours.push_back(target);
    }

    this->animateTo(_target, durationMs);
};

void Homelab::Peripherals::Neopixels::animateToColour(uint8_t red, uint8_t green, uint8_t blue, uint8_t white, uint16_t durationMs)
{
    this->animation.reset();

    OptionalNeopixelState_t _target = {};

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
    {
        _target.pixelColours.push_back({red, green, blue, white});
    }

    this->animateTo(_target, durationMs);
};

Homelab::Peripherals::NeopixelState_t Homelab::Peripherals::Neopixels::getState()
{
    std::vector<NeopixelColour_t> pixelColours = this->getColour();

    NeopixelState_t state = {
        .pixelColours = pixelColours,
    };
    return state;
};

Homelab::Peripherals::NeopixelColour_t Homelab::Peripherals::Neopixels::getPixelColour(uint16_t pixelIndex)
{
    return this->unpack(this->client->getPixelColor(pixelIndex));
};

std::vector<Homelab::Peripherals::NeopixelColour_t> Homelab::Peripherals::Neopixels::getColour()
{
    std::vector<NeopixelColour_t> pixelColours = {};

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
        pixelColours.push_back(this->getPixelColour(pixelIndex));

    return pixelColours;
};

Homelab::Peripherals::NeopixelColour_t Homelab::Peripherals::Neopixels::getInterpolatedPixelColour(uint16_t pixelIndex)
{
    if (this->animation.has_value())
    {
        Animation_t _animation = this->animation.value();

        float progress = min((float)(millis() - _animation.start) / (float)_animation.durationMs, 1.0f);
        float easedProgress = this->easeInOut(progress);

        NeopixelColour_t initialColour = _animation.initial.pixelColours[pixelIndex];
        NeopixelColour_t targetColour = _animation.target.pixelColours[pixelIndex];

        return {
            .red = initialColour.red + (int8_t)((float)(targetColour.red - initialColour.red) * easedProgress),
            .green = initialColour.green + (int8_t)((float)(targetColour.green - initialColour.green) * easedProgress),
            .blue = initialColour.blue + (int8_t)((float)(targetColour.blue - initialColour.blue) * easedProgress),
            .white = initialColour.white + (int8_t)((float)(targetColour.white - initialColour.white) * easedProgress),
        };
    }

    return this->getPixelColour(pixelIndex);
};

void Homelab::Peripherals::Neopixels::applyAnimationStep()
{
    if (this->animation.has_value())
    {
        for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
        {
            NeopixelColour_t colour = this->getInterpolatedPixelColour(pixelIndex);

            this->setPixelColour(pixelIndex, colour.red, colour.green, colour.blue, colour.white);
        }

        this->hasChanged = true;
    }
};

float Homelab::Peripherals::Neopixels::easeInOut(float progress)
{
    return progress < 0.5 ? 4 * pow(progress, 3) : 1 - pow(-2 * progress + 2, 3) / 2;
};

std::string Homelab::Peripherals::Neopixels::getId()
{
    char buff[32];
    sprintf(buff, "%d", this->pinNo);

    return (std::string)buff + "/" + this->id;
}

std::string Homelab::Peripherals::Neopixels::getJsonValue()
{

    JsonDocument json;
    JsonArray jsonPixelColours = json.createNestedArray("pixelColours");

    std::vector<NeopixelColour_t> pixelColours = this->getColour();

    std::optional<NeopixelColour_t> sharedColour;

    for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
        if (pixelColours.size() > pixelIndex)
        {
            NeopixelColour_t colour = pixelColours[pixelIndex];

            if (!pixelIndex)
            {
                sharedColour = colour;
            }
            else if (sharedColour.has_value())
            {
                NeopixelColour_t sharedColourValue = sharedColour.value();
                if (sharedColourValue.red != colour.red || sharedColourValue.green != colour.green || sharedColourValue.blue != colour.blue || sharedColourValue.white != colour.white)
                    sharedColour.reset();
            }

            JsonObject pixelColour = jsonPixelColours.createNestedObject();
            pixelColour["red"] = colour.red;
            pixelColour["green"] = colour.green;
            pixelColour["blue"] = colour.blue;
            pixelColour["white"] = colour.white;
        }

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["type"] = "neopixel";

    if (sharedColour.has_value())
    {
        NeopixelColour_t sharedColourValue = sharedColour.value();
        JsonObject colour = json.createNestedObject("colour");
        colour["red"] = sharedColourValue.red;
        colour["green"] = sharedColourValue.green;
        colour["blue"] = sharedColourValue.blue;
        colour["white"] = sharedColourValue.white;
    }

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
};

std::string Homelab::Peripherals::Neopixels::getJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"temperature\":{\"type\":\"float\"},"
           "\"colour\":{\"type\":\"object\",\"properties\":{"
           "\"red\":{\"type\":\"integer\"},"
           "\"green\":{\"type\":\"integer\"},"
           "\"blue\":{\"type\":\"integer\"},"
           "\"white\":{\"type\":\"integer\"}"
           "}},"
           "\"pixelColours\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{"
           "\"red\":{\"type\":\"integer\"},"
           "\"green\":{\"type\":\"integer\"},"
           "\"blue\":{\"type\":\"integer\"},"
           "\"white\":{\"type\":\"integer\"}"
           "}}},"
           "\"type\":{\"type\":\"string\"},"
           "\"pin\":{\"type\":\"integer\"},"
           "\"id\":{\"type\":\"string\"}"
           "}"
           "}";
}

std::string Homelab::Peripherals::Neopixels::getConfigureJsonValue()
{
    JsonDocument json;

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["noPixels"] = this->noPixels;

    std::string serialisedJson;
    serializeJson(json, serialisedJson);
    return serialisedJson;
}

std::string Homelab::Peripherals::Neopixels::getConfigureJsonSchemaValue()
{
    return "{"
           "\"type\":\"object\","
           "\"properties\":{"
           "\"id\":{\"type\":\"string\"},"
           "\"pin\":{\"type\":\"integer\"}"
           "\"noPixels\":{\"type\":\"integer\"}"
           "},"
           "\"required\":["
           "\"id\","
           "\"pin\""
           "\"noPixels\""
           "]"
           "}";
}

void Homelab::Peripherals::Neopixels::receiveJsonValue(std::string _json)
{

    JsonDocument json;
    DeserializationError error = deserializeJson(json, _json);

    if (error)
        Homelab::Logger::errorf("Failed to deserialise neopixels json: %s\n", error.c_str());
    else
    {
        uint16_t duration = 300;

        if (json["duration"].is<uint16_t>())
        {
            duration = json["duration"];
        }

        if (json["pixelColours"].is<JsonArray>())
        {
            Homelab::Peripherals::OptionalNeopixelState_t newState;
            JsonArray pixelColours = json["pixelColours"];
            for (uint16_t pixelIndex = 0; pixelIndex < this->noPixels; pixelIndex++)
            {
                JsonVariant pixelColour = pixelColours[pixelIndex];
                Homelab::Peripherals::OptionalNeopixelColour_t colour;

                if (!pixelColour.isNull() && (pixelColour["red"].is<uint8_t>() || pixelColour["green"].is<uint8_t>() || pixelColour["blue"].is<uint8_t>() || pixelColour["white"].is<uint8_t>()))
                {
                    if (pixelColour["red"].is<uint8_t>())
                        colour.red = pixelColour["red"];
                    if (pixelColour["green"].is<uint8_t>())
                        colour.green = pixelColour["green"];
                    if (pixelColour["blue"].is<uint8_t>())
                        colour.blue = pixelColour["blue"];
                    if (pixelColour["white"].is<uint8_t>())
                        colour.white = pixelColour["white"];
                }

                newState.pixelColours.push_back(colour);
            }

            Homelab::Logger::infof("Setting neopixels '%s' pixel colours individually, duration %d\n", this->getId().c_str(), duration);
            this->animateTo(newState, duration);
        }
        else if (json["colour"]["red"].is<uint8_t>() || json["colour"]["green"].is<uint8_t>() || json["colour"]["blue"].is<uint8_t>() || json["colour"]["white"].is<uint8_t>())
        {
            Homelab::Peripherals::OptionalNeopixelColour_t colour = {};

            if (json["colour"]["red"].is<uint8_t>())
                colour.red = json["colour"]["red"];
            if (json["colour"]["green"].is<uint8_t>())
                colour.green = json["colour"]["green"];
            if (json["colour"]["blue"].is<uint8_t>())
                colour.blue = json["colour"]["blue"];
            if (json["colour"]["white"].is<uint8_t>())
                colour.white = json["colour"]["white"];

            Homelab::Logger::infof("Setting neopixels '%s' to %s, duration %d\n", this->getId().c_str(), colour.toString().c_str(), duration);
            this->animateToColour(colour, duration);
        }
    }
}

std::string Homelab::Peripherals::Neopixels::receiveJsonSchemaValue()
{
    return "{"
           "\"type\": \"object\","
           "\"properties\": {"
           "\"colour\":{\"type\":\"object\",\"properties\":{"
           "\"red\":{\"type\":\"integer\"},"
           "\"green\":{\"type\":\"integer\"},"
           "\"blue\":{\"type\":\"integer\"},"
           "\"white\":{\"type\":\"integer\"}"
           "}},"
           "\"pixelColours\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{"
           "\"red\":{\"type\":\"integer\"},"
           "\"green\":{\"type\":\"integer\"},"
           "\"blue\":{\"type\":\"integer\"},"
           "\"white\":{\"type\":\"integer\"}"
           "}}}"
           "}"
           "}"
           "}";
}

void Homelab::Peripherals::Neopixels::begin()
{
    this->client = new Adafruit_NeoPixel(this->noPixels, this->pinNo, this->type);
    Homelab::Scheduler->addTask(this->getId(), std::bind(&Homelab::Peripherals::Neopixels::displayTask, this, std::placeholders::_1), 1000 / 60);
    this->client->begin();
    this->client->show();

    Homelab::Logger::infof("Neopixels of length %d started on pin %d\n", this->noPixels, this->pinNo);
}

void Homelab::Peripherals::Neopixels::displayTask(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    if (this->animation.has_value())
        this->applyAnimationStep();

    if (this->hasChanged)
    {
        this->client->show();
        this->hasChanged = false;

        if (!this->animation.has_value())
        {
            Homelab::Server->sendReport(this->getJsonValue());
        }
    }

    if (this->animation.has_value() && millis() - this->animation.value().start > this->animation.value().durationMs)
    {
        this->animation.reset();
        Homelab::Server->sendReport(this->getJsonValue());
    }
};