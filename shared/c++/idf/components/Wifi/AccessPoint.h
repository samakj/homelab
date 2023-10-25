#ifndef _Wifi_AccessPoint_h
#define _Wifi_AccessPoint_h

#include "esp_wifi.h"
#include <string>

namespace Wifi {
struct Credentials;

struct AccessPoint {
  std::string ssid;
  int8_t rssi;
  std::string mac;
  uint8_t channel;
  wifi_auth_mode_t authMode;
  wifi_cipher_type_t pairwiseCipher;
  wifi_cipher_type_t groupCipher;

  std::string toString(const bool includeAuthMode = false, const bool includeCipher = false);
  std::string authModeToString();
  std::string cipherToString();
};
} // namespace Wifi

#endif