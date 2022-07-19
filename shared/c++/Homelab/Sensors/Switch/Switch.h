#ifndef _Homelab_Sensors_Switch_h
#define _Homelab_Sensors_Switch_h

#include <Arduino.h>
#include <functional>
#include <vector>

#include <Logger/Logger.h>
#include <Time/Time.h>

namespace Homelab::Sensors
{
    class Switch
    {
    public:
        typedef std::function<void(bool state)> SwitchCallback;

        static const uint8_t PIN_NULL_VALUE = 0;

        uint8_t pinNo = -1;
        uint8_t outPin = -1;

        bool state = false;

        std::vector<SwitchCallback> switchCallbacks = {};

    private:
    public:
        Switch(
            uint8_t pinNo,
            uint8_t outPin = -1,
            bool defaultState = false);

        void addSwitchCallback(
            SwitchCallback switchCallback = nullptr);
        void setup();
        void loop();

    private:
    };
}

#endif
