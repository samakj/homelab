#include <string>
#include <optional>
#include "defs.h"

void ticker(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    std::string message = arg->name;
    message += ": ";

#ifdef _Homelab_Wifi_h
    message += "Wifi ";

    if (Homelab::Wifi->getIsConnected())
    {
        std::optional<Homelab::WifiStrength_t> _strength = Homelab::Wifi->getStrength();

        if (_strength.has_value())
            message += Homelab::serialiseStrength(_strength.value()).c_str();
        else
            message += "unknown";
    }
    else if (Homelab::Wifi->getIsConnected())
        message += " connecting";
    else
        message += " not connected";

    message += " | ";
#endif

#ifdef DHT_SENSORS
    for (Homelab::Sensors::DHT &Sensor : DHT_SENSORS)
    {
        message += "DHT-";
        char buff[8];
        sprintf(buff, "%d", Sensor.pinNo);
        message += buff;
        message += " ";

        std::optional<float>
            temperature = Sensor.getTemperature();

        if (temperature.has_value())
        {
            char temperatureBuffer[16];
            sprintf(temperatureBuffer, "%.1f°c", temperature.value());
            message += temperatureBuffer;
        }
        else
        {
            message += "null";
        }

        message += " - ";

        std::optional<float> humidity = Sensor.getHumidity();

        if (humidity.has_value())
        {
            char humidityBuffer[16];
            sprintf(humidityBuffer, "%.1f%%", humidity.value());
            message += humidityBuffer;
        }
        else
        {
            message += "null";
        }

        message += " | ";
    }
#endif

#ifdef LIGHT_LEVEL_SENSORS
    for (Homelab::Sensors::TEMT6000 &Sensor : LIGHT_LEVEL_SENSORS)
    {
        message += "TEMT6000-";
        char buff[8];
        sprintf(buff, "%d", Sensor.pinNo);
        message += buff;
        message += " ";

        std::optional<float> lux = Sensor.getLux();

        if (lux.has_value())
        {
            char luxBuffer[16];
            sprintf(luxBuffer, "%.1flux", lux.value());
            message += luxBuffer;
        }
        else
        {
            message += "null";
        }

        message += " | ";
    }
#endif

#ifdef BUTTON_PERIPHERALS
    for (Homelab::Peripherals::Button &Peripheral : BUTTON_PERIPHERALS)
    {
        message += "Button-";
        char buff[8];
        sprintf(buff, "%d", Peripheral.pinNo);
        message += buff;
        message += " ";
        message += Peripheral.getState() ? "true" : "false";
        message += " | ";
    }
#endif

#ifdef ROTARY_ENCODER_PERIPHERALS
    for (Homelab::Peripherals::RotaryEncoder &Peripheral : ROTARY_ENCODER_PERIPHERALS)
    {
        message += "Rotary-";
        char buff[32];
        sprintf(buff, "%d,%d %ld", Peripheral.pins[0], Peripheral.pins[1], Peripheral.getPosition());
        message += buff;
        message += " | ";
    }
#endif

    uint16_t tps = (1000 * ticks) / (uint16_t)(millis() - arg->lastRun);

    char tpsBuffer[16];
    if (tps > 1000000)
        sprintf(tpsBuffer, "TPS %.2fm", tps / 1000000.0);
    else if (tps > 1000)
        sprintf(tpsBuffer, "TPS %.1fk", tps / 1000.0);
    else
        sprintf(tpsBuffer, "TPS %d", tps);

    message += tpsBuffer;

    ticks = 0;

    Homelab::Logger::debug(message.c_str());
}

void startTicker()
{
#ifdef _Homelab_Scheduler_h
    Homelab::Scheduler->addTask("Ticker", ticker, 10000);
#endif
}
