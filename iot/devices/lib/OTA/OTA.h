#ifndef _Homelab_OTA_h
#define _Homelab_OTA_h

#include <Arduino.h>
#include <ArduinoOTA.h>
#include <ArduinoJson.h>
#include <string>

#include "logger.h"
#include "server.h"

namespace Homelab::OTA
{
    extern uint8_t progress;
    extern std::string location;

    void begin(std::string hostname, std::string password);
    void loop();
};

#endif