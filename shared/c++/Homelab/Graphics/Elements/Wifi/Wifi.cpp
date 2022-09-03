#include "Wifi.h"

Homelab::Graphics::Elements::Wifi::Wifi(
    int16_t x,
    int16_t y,
    int16_t height,
    int16_t width,
    uint16_t fill,
    uint16_t background,
    const GFXfont* font,
    uint16_t colour,
    BoxSides<uint8_t> padding,
    VerticalDatum verticalDatum,
    HorizontalDatum horizontalDatum,
    uint8_t zIndex
): Text(
    x,
    y,
    height,
    width,
    fill,
    background,
    'No Wifi',
    font,
    colour,
    padding,
    verticalDatum,
    horizontalDatum,
    zIndex
)
{};

void Homelab::Graphics::Elements::Wifi::loop(TFT_eSPI *tft) 
{
    if (Homelab::Wifi::isConnecting())
        Homelab::Graphics::Elements::Text::setText("Connecting");    
    else if (Homelab::Wifi::NTP::isConnected())
        Homelab::Graphics::Elements::Text::setText(Homelab::Wifi::getSSID());
    else
        Homelab::Graphics::Elements::Text::setText("No Wifi");

    Homelab::Graphics::Elements::Text::loop(tft);
};