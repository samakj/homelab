#ifndef _Homelab_OTA_h
#define _Homelab_OTA_h

#include <ArduinoOTA.h>
#include <Logger/Logger.h>

#include <string>

namespace Homelab::OTA
{
  void setup(std::string hostname, std::string password);
  void loop();
};    // namespace Homelab::OTA

#endif