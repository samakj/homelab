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
    typedef std::function<void(bool state)> RelayStateChangeCallback_t;

    class Relay
    {
    private:
        bool state;

        std::map<std::string, RelayStateChangeCallback_t> changeCallbacks = {};

        void callChangeCallbacks();

    public:
        Relay(uint8_t pinNo, std::string id = "relay", uint8_t mode = OUTPUT, uint8_t triggerLevel = HIGH);

        uint8_t pinNo;
        uint8_t mode;
        uint8_t triggerLevel;
        std::string id;

        void begin();
        void loop();

        void addChangeCallback(std::string name, RelayStateChangeCallback_t callback);

        void deleteChangeCallback(std::string name);

        bool getState();
        void setState(bool state);
        void setPinMode(uint8_t pinMode);
        void setPinMode(std::string pinMode);
        void setTriggerLevel(uint8_t triggerLevel);

        std::string getId();
        std::string getJsonValue();
        std::string getJsonSchemaValue();
        std::string getConfigureJsonValue();
        std::string getConfigureJsonSchemaValue();
        void receiveJsonValue(std::string json);
        std::string receiveJsonSchemaValue();
        void receiveConfigureJsonValue(std::string json);
        std::string receiveConfigureJsonSchemaValue();
    };
}

#endif