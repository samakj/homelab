#include "Circle.h"

Homelab::Graphics::Elements::Circle::Circle(
    int16_t x, int16_t y, int16_t radius, uint16_t fill, uint16_t background, uint8_t zIndex
): Element(x, y, radius * 2, radius * 2, zIndex)
{
    this->setFill(radius);
    this->setFill(fill);
    this->setBackground(background);
};

int16_t Homelab::Graphics::Elements::Circle::getRadius() { return this->radius.set; };

int16_t Homelab::Graphics::Elements::Circle::getFill() { return this->fill.set; };

int16_t Homelab::Graphics::Elements::Circle::getBackground() { return this->background.set; };

void Homelab::Graphics::Elements::Circle::setRadius(uint16_t radius)
{
    this->radius.set = radius;
    this->height.set = radius;
    this->width.set = radius;
    this->recalculateBoundingBox();
};

void Homelab::Graphics::Elements::Circle::setHeight(uint16_t height)
{
    this->setRadius(height / 2);
};

void Homelab::Graphics::Elements::Circle::setWidth(uint16_t width)
{
    this->setRadius(width / 2);
};

void Homelab::Graphics::Elements::Circle::setFill(uint16_t fill) { this->fill.set = fill; };

void Homelab::Graphics::Elements::Circle::setBackground(uint16_t background) { this->background.set = background; };

void Homelab::Graphics::Elements::Circle::recalculateBoundingBox()
{ 
    this->boundingBox.set.topLeft = {this->x.set - this->radius.set, this->y.set - this->radius.set};
    this->boundingBox.set.bottomRight = {this->x.set + this->radius.set, this->y.set + this->radius.set};
};

void Homelab::Graphics::Elements::Circle::clear(TFT_eSPI *tft) 
{
    tft->fillCircle(this->x.displayed, this->y.displayed, this->radius.displayed, this->background.set);
};

void Homelab::Graphics::Elements::Circle::draw(TFT_eSPI *tft) {
    tft->fillCircle(this->x.set, this->y.set, this->radius.set, this->fill.set);
    this->x.displayed = this->x.set;
    this->y.displayed = this->y.set;
    this->radius.displayed = this->radius.set;
    this->height.displayed = this->radius.set * 2;
    this->width.displayed = this->radius.set * 2;
    this->fill.displayed = this->fill.set;
    this->boundingBox.displayed.topLeft = {this->x.displayed - this->radius.displayed, this->y.displayed - this->radius.displayed};
    this->boundingBox.displayed.bottomRight = {this->x.displayed + this->radius.displayed, this->y.displayed + this->radius.displayed};
};

void Homelab::Graphics::Elements::Circle::loop(TFT_eSPI *tft) 
{
    if (
        this->x.hasChanged() ||
        this->y.hasChanged() ||
        this->radius.hasChanged() ||
        this->height.hasChanged() ||
        this->width.hasChanged() ||
        this->fill.hasChanged() ||
        this->background.hasChanged()
    )
    {
        this->clear(tft);
        this->draw(tft);
    }
};