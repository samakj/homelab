#ifndef _Homelab_OTA_h
#define _Homelab_OTA_h

#include <ArduinoOTA.h>
#include <TelnetStream.h>
#include <string>

#include "../Logger/Logger.h"

namespace Homelab::OTA
{
    void setup(std::string hostname, std::string password);
    void loop();
};

#endif