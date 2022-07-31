#include "Element.h"

Homelab::Graphics::Elements::Element::Element(
    int16_t x, int16_t y, int16_t height, int16_t width, uint8_t zIndex
)
{
    this->setX(x);
    this->setY(y);
    this->setHeight(height);
    this->setWidth(width);
    this->setZIndex(zIndex);
};

int16_t Homelab::Graphics::Elements::Element::getX() { return this->x.set; };

int16_t Homelab::Graphics::Elements::Element::getY() { return this->y.set; };

int16_t Homelab::Graphics::Elements::Element::getHeight() { return this->height.set; };

int16_t Homelab::Graphics::Elements::Element::getWidth() { return this->width.set; };

bool Homelab::Graphics::Elements::Element::getVisible() { return this->visible; };

uint8_t Homelab::Graphics::Elements::Element::getZIndex() { return this->zIndex; };

Homelab::Graphics::Box Homelab::Graphics::Elements::Element::getBoundingBox() { return this->boundingBox.set; };

void Homelab::Graphics::Elements::Element::setX(int16_t x)
{
    this->x.set = x;
    this->recalculateBoundingBox();
};

void Homelab::Graphics::Elements::Element::setY(int16_t y)
{
    this->y.set = y;
    this->recalculateBoundingBox();
};

void Homelab::Graphics::Elements::Element::setHeight(int16_t height)
{
    this->height.set = height;
    this->recalculateBoundingBox();
};

void Homelab::Graphics::Elements::Element::setWidth(int16_t width)
{
    this->width.set = width;
    this->recalculateBoundingBox();
};

void Homelab::Graphics::Elements::Element::setVisible(bool visible = true) { this->visible = visible; };

void Homelab::Graphics::Elements::Element::setZIndex(uint8_t zIndex) { this->zIndex = zIndex; };

void Homelab::Graphics::Elements::Element::recalculateBoundingBox()
{
    this->boundingBox.set.topLeft.x = this->x.set;
    this->boundingBox.set.topLeft.y = this->y.set;
    this->boundingBox.set.bottomRight.y = this->x.set + this->width.set;
    this->boundingBox.set.bottomRight.y = this->y.set + this->height.set;
}

void Homelab::Graphics::Elements::Element::containsPoint(Homelab::Graphics::Point point)
{
    return Homelab::Graphics::Collision::boxContainsPoint(this->boundingBox, point);
};

void Homelab::Graphics::Elements::Element::intersectsBox(Homelab::Graphics::Box box)
{
    return Homelab::Graphics::Collision::boxIntersectsBox(this->boundingBox, box);
};

void Homelab::Graphics::Elements::Element::clear(TFT_eSPI *tft) {};

void Homelab::Graphics::Elements::Element::draw(TFT_eSPI *tft) {};

void Homelab::Graphics::Elements::Element::loop(TFT_eSPI *tft) {};