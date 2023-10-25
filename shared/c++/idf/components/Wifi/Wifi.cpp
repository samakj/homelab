#include "Wifi.h"

bool Wifi::initialisedNetif = false;
void Wifi::initialiseNetif() {
  if (!Wifi::initialisedNetif) {
    Miscellaneous::initialiseNVS();
    ESP_ERROR_CHECK(esp_netif_init());
    Miscellaneous::initialiseDefaultEventLoop();
    esp_netif_t *netif = esp_netif_create_default_wifi_sta();
    assert(netif);
    Wifi::initialisedNetif = true;
  }
};

bool Wifi::initialised = false;
void Wifi::initialise() {
  if (!Wifi::initialised) {
    Wifi::initialiseNetif();
    wifi_init_config_t config = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&config));
    Wifi::initialised = true;
  }
}

std::vector<Wifi::AccessPoint> Wifi::scan(std::vector<Credentials> credentials, uint16_t maxSize) {
  Wifi::initialise();

  // --------------

  wifi_ap_record_t apRecords[maxSize];
  uint16_t apCount = 0;

  // ---------------

  ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
  ESP_ERROR_CHECK(esp_wifi_start());

  // ---------------

  esp_wifi_scan_start(NULL, true);
  ESP_ERROR_CHECK(esp_wifi_scan_get_ap_records(&maxSize, apRecords));
  ESP_ERROR_CHECK(esp_wifi_scan_get_ap_num(&apCount));

  bool filterSsids = !!credentials.size();
  std::vector<Wifi::AccessPoint> aps = {};

  for (int i = 0; (i < maxSize) && (i < apCount); i++) {
    wifi_ap_record_t apRecord = apRecords[i];
    Wifi::AccessPoint accessPoint = {
        reinterpret_cast<char const *>(apRecord.ssid),
        apRecord.rssi,
        reinterpret_cast<char const *>(apRecord.bssid),
        apRecord.primary,
        apRecord.authmode,
        apRecord.pairwise_cipher,
        apRecord.group_cipher,
    };
    auto apMatches = [&](Wifi::Credentials credentials) {
      return accessPoint.ssid == credentials.ssid;
    };
    if (!filterSsids ||
        find_if(begin(credentials), end(credentials), apMatches) != std::end(credentials))
      aps.push_back(accessPoint);
  }

  return aps;
}