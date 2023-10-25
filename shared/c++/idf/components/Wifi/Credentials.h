#ifndef _Wifi_Credentials_h
#define _Wifi_Credentials_h

#include <string>

namespace Wifi {
struct Credentials {
  std::string ssid;
  std::string password;
};
} // namespace Wifi

#endif