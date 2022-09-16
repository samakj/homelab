#include "Time.h"

Homelab::Graphics::Elements::Time::Time(
    int16_t x, int16_t y, int16_t height, int16_t width, uint16_t fill, uint16_t background,
    const GFXfont* font, uint16_t colour, BoxSides<uint8_t> padding, VerticalDatum verticalDatum,
    HorizontalDatum horizontalDatum, uint8_t zIndex
)
    : Text(
          x, y, height, width, fill, background, "--:--:--", font, colour, padding, verticalDatum,
          horizontalDatum, zIndex
      ) {};

void Homelab::Graphics::Elements::Time::loop(TFT_eSPI* tft)
{
  if(Homelab::Time::NTP::isConnected())
  {
    std::string time = Homelab::Time::formatTime("%T");
    Homelab::Graphics::Elements::Text::setText(time);
  }
  Homelab::Graphics::Elements::Text::loop(tft);
};