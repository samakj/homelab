#include "OTA.h"

uint8_t Homelab::OTA::progress = 0;
std::string Homelab::OTA::location = "sketch";

void Homelab::OTA::begin(std::string hostname, std::string password)
{
    ArduinoOTA.setHostname(hostname.c_str());
    ArduinoOTA.setPassword(password.c_str());

    ArduinoOTA.onStart(
        []()
        {
            std::string _location;
            if (ArduinoOTA.getCommand() == U_FLASH)
                _location = "sketch";
            else
                _location = "filesystem";

            Homelab::OTA::location = _location;
            Homelab::Logger::info("OTA update starting for " + Homelab::OTA::location);
            Homelab::OTA::progress = 0;
        });

    ArduinoOTA.onEnd(
        []()
        {
            Homelab::Logger::info("OTA upload complete, rebooting.");
            JsonDocument json;

            json["type"] = "ota-update";
            json["location"] = Homelab::OTA::location;
            json["progress"] = Homelab::OTA::progress;
            json["rebooting"] = true;

            std::string serialisedJson;
            serializeJson(json, serialisedJson);
            Homelab::Server->sendReport(serialisedJson);
        });

    ArduinoOTA.onProgress(
        [](unsigned int progress, unsigned int total)
        {
            uint8_t _progress = progress / (total / 100);

            if (_progress != Homelab::OTA::progress)
            {
                Homelab::OTA::progress = _progress;
                Homelab::Logger::infof("OTA Progress: %u%%\n", Homelab::OTA::progress);

                JsonDocument json;

                json["type"] = "ota-update";
                json["location"] = Homelab::OTA::location;
                json["progress"] = Homelab::OTA::progress;

                std::string serialisedJson;
                serializeJson(json, serialisedJson);
                Homelab::Server->sendReport(serialisedJson);
            }
        });

    ArduinoOTA.onError(
        [](ota_error_t error)
        {
            Homelab::Logger::errorf("OTA Error[%u]: \n", error);
            if (error == OTA_AUTH_ERROR)
                Homelab::Logger::error("OTA Auth Failed");
            else if (error == OTA_BEGIN_ERROR)
                Homelab::Logger::error("OTA Begin Failed");
            else if (error == OTA_CONNECT_ERROR)
                Homelab::Logger::error("OTA Connect Failed");
            else if (error == OTA_RECEIVE_ERROR)
                Homelab::Logger::error("OTA Receive Failed");
            else if (error == OTA_END_ERROR)
                Homelab::Logger::error("OTA End Failed");
        });

    ArduinoOTA.begin();
    Homelab::Logger::info("OTA initialised");
};

void Homelab::OTA::loop()
{
    ArduinoOTA.handle();
}