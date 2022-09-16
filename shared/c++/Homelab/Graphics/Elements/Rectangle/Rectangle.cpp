#include "Rectangle.h"

Homelab::Graphics::Elements::Rectangle::Rectangle(
    int16_t x, int16_t y, int16_t height, int16_t width, uint16_t fill, uint16_t background,
    uint8_t zIndex
)
    : Element(x, y, height, width, zIndex)
{
  this->setFill(fill);
  this->setBackground(background);
};

int16_t Homelab::Graphics::Elements::Rectangle::getFill() { return this->fill.set; };

int16_t Homelab::Graphics::Elements::Rectangle::getBackground() { return this->background.set; };

void Homelab::Graphics::Elements::Rectangle::setFill(uint16_t fill) { this->fill.set = fill; };

void Homelab::Graphics::Elements::Rectangle::setBackground(uint16_t background)
{
  this->background.set = background;
};

bool Homelab::Graphics::Elements::Rectangle::hasChangesToDisplay()
{
  return (
      Homelab::Graphics::Elements::Element::hasChangesToDisplay() || this->x.hasChanged() ||
      this->y.hasChanged() || this->height.hasChanged() || this->width.hasChanged() ||
      this->fill.hasChanged() || this->background.hasChanged()
  );
}

void Homelab::Graphics::Elements::Rectangle::clear(TFT_eSPI *tft)
{
  tft->fillRect(
      this->x.displayed, this->y.displayed, this->height.displayed, this->width.displayed,
      this->background.set
  );
};

void Homelab::Graphics::Elements::Rectangle::draw(TFT_eSPI *tft)
{
  tft->fillRect(this->x.set, this->y.set, this->height.set, this->width.set, this->fill.set);
  this->x.displayed = this->x.set;
  this->y.displayed = this->y.set;
  this->height.displayed = this->height.set;
  this->width.displayed = this->width.set;
  this->fill.displayed = this->fill.set;
  this->boundingBox.topLeft = {this->x.displayed, this->y.displayed};
  this->boundingBox.bottomRight = {
      this->x.displayed + this->width.displayed, this->y.displayed + this->height.displayed};
};

void Homelab::Graphics::Elements::Rectangle::loop(TFT_eSPI *tft)
{
  if(this->hasChangesToDisplay())
  {
    this->clear(tft);
    this->draw(tft);
  }
};