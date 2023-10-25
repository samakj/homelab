#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "nvs_flash.h"
#include <Wifi.h>
#include <stdio.h>
#include <vector>

constexpr const char *LOG_TAG = "main";
const Wifi::Credentials Patty = {"Patty", ""};
const std::vector<Wifi::Credentials> credentials = {Patty};

extern "C" void app_main(void) {
  while (1) {
    std::vector<Wifi::AccessPoint> accessPoints = Wifi::scan(credentials);

    for (Wifi::AccessPoint accessPoint : accessPoints)
      ESP_LOGI(LOG_TAG, "%s", accessPoint.toString().c_str());
    ESP_LOGI(LOG_TAG, "--------");
    vTaskDelay(5000 / portTICK_PERIOD_MS);
  }
}