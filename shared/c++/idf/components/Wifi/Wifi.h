#ifndef _Wifi_h
#define _Wifi_h

#include "AccessPoint.h"
#include "Credentials.h"
#include "esp_netif.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include <Miscellaneous.h>
#include <algorithm>
#include <string>
#include <vector>

namespace Wifi {
constexpr const char *LOG_TAG = "wifi";
constexpr const uint16_t DEFAULT_SCAN_MAX_SIZE = 16;

extern bool initialisedNetif;
void initialiseNetif();

extern bool initialised;
void initialise();

std::vector<AccessPoint>
scan(std::vector<Credentials> ssids = {}, uint16_t maxSize = DEFAULT_SCAN_MAX_SIZE);
} // namespace Wifi

#endif