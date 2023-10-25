#ifndef _Miscellaneous_h
#define _Miscellaneous_h

#include "esp_event.h"
#include "esp_log.h"
#include "esp_system.h"
#include "nvs_flash.h"

namespace Miscellaneous {
constexpr const char *LOG_TAG = "misc";

extern bool initialisedNVS;
void initialiseNVS();

extern bool initialisedDefaultEventLoop;
void initialiseDefaultEventLoop();
} // namespace Miscellaneous

#endif