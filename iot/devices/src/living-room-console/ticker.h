#include <string>
#include <optional>
#include "defs.h"

void ticker(Homelab::SchedulerTaskCallbackArg_t *arg)
{
    std::string message = arg->name;
    message += ": ";

    // WIFI
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

    // DHT
    message += "DHT-";
    char dhtbuff[8];
    sprintf(dhtbuff, "%d", DHTSensor.pinNo);
    message += dhtbuff;
    message += " ";

    std::optional<float>
        temperature = DHTSensor.getTemperature();

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

    std::optional<float> humidity = DHTSensor.getHumidity();

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

    message += "TEMT6000-";
    char temtbuff[8];
    sprintf(temtbuff, "%d", LightSensor.pinNo);
    message += temtbuff;
    message += " ";

    std::optional<float> lux = LightSensor.getLux();

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
    Homelab::Scheduler->addTask("Ticker", ticker, 10000);
}
