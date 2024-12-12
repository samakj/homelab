#ifndef _Homelab_Peripherals_Button_h
#define _Homelab_Peripherals_Button_h

#include <Arduino.h>
#include <ArduinoJson.h>
#include <map>
#include <string>

#include "server.h"
#include "utils.h"
#include "logger.h"

namespace Homelab::Peripherals
{
    typedef std::function<void()> ButtonPressReleaseCallback_t;
    typedef std::function<void(bool state)> ButtonStateChangeCallback_t;

    class Button
    {
    private:
        bool state;
        std::string id;

        std::map<std::string, ButtonPressReleaseCallback_t> pressCallbacks = {};
        std::map<std::string, ButtonPressReleaseCallback_t> releaseCallbacks = {};
        std::map<std::string, ButtonStateChangeCallback_t> changeCallbacks = {};

        void callPressCallbacks();
        void callReleaseCallbacks();
        void callChangeCallbacks();

    public:
        Button(uint8_t pinNo, std::string id = "button", uint8_t mode = INPUT, bool isNormallyOpen = true);

        uint8_t pinNo;
        uint8_t mode;
        bool isNormallyOpen;

        void begin();
        void loop();

        void addPressCallback(std::string name, ButtonPressReleaseCallback_t callback);
        void addReleaseCallback(std::string name, ButtonPressReleaseCallback_t callback);
        void addChangeCallback(std::string name, ButtonStateChangeCallback_t callback);

        void deletePressCallback(std::string name);
        void deleteRelaseCallback(std::string name);
        void deleteChangeCallback(std::string name);

        bool getState();

        void setPinMode(uint8_t pinMode);
        void setPinMode(std::string pinMode);
        void setIsNormallyOpen(boolean isNormallyOpen);

        std::string getId();
        void getJsonValue(JsonVariant &json);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
        void receiveConfigureJsonValue(JsonVariant &json);
    };
}

#endif