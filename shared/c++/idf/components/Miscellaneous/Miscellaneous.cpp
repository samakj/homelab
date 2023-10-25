#include "Miscellaneous.h"

bool Miscellaneous::initialisedNVS = false;
void Miscellaneous::initialiseNVS() {
  if (!Miscellaneous::initialisedNVS) {
    esp_err_t initilisationError = nvs_flash_init();

    if (initilisationError == ESP_ERR_NVS_NO_FREE_PAGES ||
        initilisationError == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_LOGI(Miscellaneous::LOG_TAG, "Erasing flash");
      ESP_ERROR_CHECK(nvs_flash_erase());
      initilisationError = nvs_flash_init();
    }

    ESP_ERROR_CHECK(initilisationError);
    Miscellaneous::initialisedNVS = true;
  }
}

bool Miscellaneous::initialisedDefaultEventLoop = false;
void Miscellaneous::initialiseDefaultEventLoop() {
  if (!Miscellaneous::initialisedDefaultEventLoop) {
    ESP_ERROR_CHECK(esp_event_loop_create_default());
    Miscellaneous::initialisedDefaultEventLoop = true;
  }
};
