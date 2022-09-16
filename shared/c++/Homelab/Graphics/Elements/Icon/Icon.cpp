#include "Icon.h"

Homelab::Graphics::Elements::Icon::Icon(
    int16_t x, int16_t y, int16_t height, int16_t width, uint16_t fill, uint16_t background,
    char icon, const GFXfont *font, uint16_t colour, BoxSides<uint8_t> padding,
    VerticalDatum verticalDatum, HorizontalDatum horizontalDatum, uint8_t zIndex
)
    : Text(
          x, y, height, width, fill, background, "", font, colour, padding, verticalDatum,
          horizontalDatum, zIndex
      )
{
  this->setIcon(icon);
};

char Homelab::Graphics::Elements::Icon::getIcon() { return this->icon.set; }

void Homelab::Graphics::Elements::Icon::setIcon(char icon)
{
  this->icon.set = icon;
  std::string s;
  s.push_back(icon);
  this->setText(s);
}

bool Homelab::Graphics::Elements::Icon::hasChangesToDisplay()
{
  return (Homelab::Graphics::Elements::Text::hasChangesToDisplay() || this->icon.hasChanged());
}

void Homelab::Graphics::Elements::Icon::draw(TFT_eSPI *tft)
{
  Homelab::Graphics::Elements::Rectangle::draw(tft);
  this->icon.displayed = this->icon.set;
}

void Homelab::Graphics::Elements::Icon::loop(TFT_eSPI *tft)
{
  if(this->hasChangesToDisplay())
  {
    this->clear(tft);
    this->draw(tft);
  }
};
