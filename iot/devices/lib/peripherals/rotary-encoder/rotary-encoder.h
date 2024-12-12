#ifndef _Homelab_Peripherals_Rotary_Encoder_h
#define _Homelab_Peripherals_Rotary_Encoder_h

#include <Arduino.h>
#include <ArduinoJson.h>
#include <map>
#include <RotaryEncoder.h>
#include <string>

#include "server.h"

class _RotaryEncoder : public RotaryEncoder
{
public:
    _RotaryEncoder(int pin1, int pin2, LatchMode mode = LatchMode::FOUR0) : RotaryEncoder(pin1, pin2, mode) {}
};

namespace Homelab::Peripherals
{
    typedef std::function<void(long position)> RotaryEncoderRotationCallback_t;
    typedef std::function<void(long position, _RotaryEncoder::Direction direction)> RotaryEncoderStateChangeCallback_t;

    class RotaryEncoder
    {
    private:
        _RotaryEncoder *client = nullptr;
        std::string id;

        long position;
        unsigned long lastReport;

        std::map<std::string, RotaryEncoderRotationCallback_t> clockwiseCallbacks = {};
        std::map<std::string, RotaryEncoderRotationCallback_t> counterClockwiseCallbacks = {};
        std::map<std::string, RotaryEncoderStateChangeCallback_t> changeCallbacks = {};

        void callClockwiseCallbacks();
        void callCounterClockwiseCallbacks();
        void callChangeCallbacks(_RotaryEncoder::Direction direction);

    public:
        RotaryEncoder(std::vector<uint8_t> pins, std::string id = "rotary-encoder", _RotaryEncoder::LatchMode mode = _RotaryEncoder::LatchMode::TWO03);

        std::vector<uint8_t> pins;
        _RotaryEncoder::LatchMode mode;

        void begin();
        void loop();

        void addClockwiseCallback(std::string name, RotaryEncoderRotationCallback_t callback);
        void addCounterClockwiseCallback(std::string name, RotaryEncoderRotationCallback_t callback);
        void addChangeCallback(std::string name, RotaryEncoderStateChangeCallback_t callback);

        void deleteClockwiseCallback(std::string name);
        void deletCounterClockwiseCallback(std::string name);
        void deleteChangeCallback(std::string name);

        std::string getId();
        long getPosition();
        void getJsonValue(JsonVariant &json, _RotaryEncoder::Direction direction = _RotaryEncoder::Direction::NOROTATION);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
    };
}

#endif