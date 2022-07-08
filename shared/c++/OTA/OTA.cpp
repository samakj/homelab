#include "OTA.h"

void Homelab::OTA::setup(std::string hostname, std::string password)
{
    ArduinoOTA.setHostname(hostname.c_str());
    ArduinoOTA.setPassword(password.c_str());

    ArduinoOTA.onStart(
        []()
        {
            std::string type;
            if (ArduinoOTA.getCommand() == U_FLASH)
                type = "sketch";
            else
                type = "filesystem";
            Homelab::Logger::info("Start updating " + type);
        });

    ArduinoOTA.onEnd(
        []()
        { Homelab::Logger::info("\nOTA upload complete, rebooting."); });

    ArduinoOTA.onProgress(
        [](unsigned int progress, unsigned int total)
        { Homelab::Logger::infof("Progress: %u%%\r", (progress / (total / 100))); });

    ArduinoOTA.onError(
        [](ota_error_t error)
        {
            Homelab::Logger::errorf("Error[%u]: ", error);
            if (error == OTA_AUTH_ERROR)
                Homelab::Logger::error("Auth Failed");
            else if (error == OTA_BEGIN_ERROR)
                Homelab::Logger::error("Begin Failed");
            else if (error == OTA_CONNECT_ERROR)
                Homelab::Logger::error("Connect Failed");
            else if (error == OTA_RECEIVE_ERROR)
                Homelab::Logger::error("Receive Failed");
            else if (error == OTA_END_ERROR)
                Homelab::Logger::error("End Failed");
        });

    ArduinoOTA.begin();
    Homelab::Logger::info("OTA initialised");
    TelnetStream.begin();
    Homelab::Logger::info("Telnet initialised");
};

void Homelab::OTA::loop()
{
    ArduinoOTA.handle();
};