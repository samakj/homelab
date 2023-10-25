#include "AccessPoint.h"

std::string Wifi::AccessPoint::authModeToString() {
  switch (this->authMode) {
  case WIFI_AUTH_OPEN:
    return "WIFI_AUTH_OPEN";
  case WIFI_AUTH_OWE:
    return "WIFI_AUTH_OWE";
  case WIFI_AUTH_WEP:
    return "WIFI_AUTH_WEP";
  case WIFI_AUTH_WPA_PSK:
    return "WIFI_AUTH_WPA_PSK";
  case WIFI_AUTH_WPA2_PSK:
    return "WIFI_AUTH_WPA2_PSK";
  case WIFI_AUTH_WPA_WPA2_PSK:
    return "WIFI_AUTH_WPA_WPA2_PSK";
  case WIFI_AUTH_WPA2_ENTERPRISE:
    return "WIFI_AUTH_WPA2_ENTERPRISE";
  case WIFI_AUTH_WPA3_PSK:
    return "WIFI_AUTH_WPA3_PSK";
  case WIFI_AUTH_WPA2_WPA3_PSK:
    return "WIFI_AUTH_WPA2_WPA3_PSK";
  default:
    return "WIFI_AUTH_UNKNOWN";
  }
}

std::string Wifi::AccessPoint::cipherToString() {
  switch (this->pairwiseCipher) {
  case WIFI_CIPHER_TYPE_NONE:
    return "pairwise:WIFI_CIPHER_TYPE_NONE";
  case WIFI_CIPHER_TYPE_WEP40:
    return "pairwise:WIFI_CIPHER_TYPE_WEP40";
  case WIFI_CIPHER_TYPE_WEP104:
    return "pairwise:WIFI_CIPHER_TYPE_WEP104";
  case WIFI_CIPHER_TYPE_TKIP:
    return "pairwise:WIFI_CIPHER_TYPE_TKIP";
  case WIFI_CIPHER_TYPE_CCMP:
    return "pairwise:WIFI_CIPHER_TYPE_CCMP";
  case WIFI_CIPHER_TYPE_TKIP_CCMP:
    return "pairwise:WIFI_CIPHER_TYPE_TKIP_CCMP";
  case WIFI_CIPHER_TYPE_SMS4:
    return "pairwise:WIFI_CIPHER_TYPE_SMS4";
  case WIFI_CIPHER_TYPE_GCMP:
    return "pairwise:WIFI_CIPHER_TYPE_GCMP";
  case WIFI_CIPHER_TYPE_GCMP256:
    return "pairwise:WIFI_CIPHER_TYPE_GCMP256";
  case WIFI_CIPHER_TYPE_AES_GMAC128:
    return "pairwise:WIFI_CIPHER_TYPE_AES_GMAC128";
  case WIFI_CIPHER_TYPE_AES_GMAC256:
    return "pairwise:WIFI_CIPHER_TYPE_AES_GMAC256";
  case WIFI_CIPHER_TYPE_UNKNOWN:
    return "pairwise:WIFI_CIPHER_TYPE_UNKNOWN";
  case WIFI_CIPHER_TYPE_AES_CMAC128:
    return "pairwise:WIFI_CIPHER_TYPE_AES_CMAC128";
  }

  switch (this->groupCipher) {
  case WIFI_CIPHER_TYPE_NONE:
    return "group:WIFI_CIPHER_TYPE_NONE";
  case WIFI_CIPHER_TYPE_WEP40:
    return "group:WIFI_CIPHER_TYPE_WEP40";
  case WIFI_CIPHER_TYPE_WEP104:
    return "group:WIFI_CIPHER_TYPE_WEP104";
  case WIFI_CIPHER_TYPE_TKIP:
    return "group:WIFI_CIPHER_TYPE_TKIP";
  case WIFI_CIPHER_TYPE_CCMP:
    return "group:WIFI_CIPHER_TYPE_CCMP";
  case WIFI_CIPHER_TYPE_TKIP_CCMP:
    return "group:WIFI_CIPHER_TYPE_TKIP_CCMP";
  case WIFI_CIPHER_TYPE_SMS4:
    return "group:WIFI_CIPHER_TYPE_SMS4";
  case WIFI_CIPHER_TYPE_GCMP:
    return "group:WIFI_CIPHER_TYPE_GCMP";
  case WIFI_CIPHER_TYPE_GCMP256:
    return "group:WIFI_CIPHER_TYPE_GCMP256";
  case WIFI_CIPHER_TYPE_AES_GMAC128:
    return "group:WIFI_CIPHER_TYPE_AES_GMAC128";
  case WIFI_CIPHER_TYPE_AES_GMAC256:
    return "group:WIFI_CIPHER_TYPE_AES_GMAC256";
  case WIFI_CIPHER_TYPE_UNKNOWN:
    return "group:WIFI_CIPHER_TYPE_UNKNOWN";
  case WIFI_CIPHER_TYPE_AES_CMAC128:
    return "group:WIFI_CIPHER_TYPE_AES_CMAC128";
  }

  return "WIFI_CIPHER_TYPE_UNKNOWN";
}

std::string Wifi::AccessPoint::toString(const bool includeAuthMode, const bool includeCipher) {
  char ap[128];

  sprintf(
      ap, "SSID: %24s -> RSSI: %4ddB, CHANNEL: %4d", this->ssid.c_str(), this->rssi, this->channel
  );

  if (includeAuthMode)
    sprintf(ap, ", AUTH: %s", this->authModeToString().c_str());
  if (includeCipher)
    sprintf(ap, ", CIPHER: %s", this->cipherToString().c_str());

  return ap;
}