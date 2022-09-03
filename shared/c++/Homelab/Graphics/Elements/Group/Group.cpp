#include "Group.h"

Homelab::Graphics::Elements::Group::Group(
    std::vector<Homelab::Graphics::Elements::Element*> _children,
    uint8_t zIndex
): Element(0, 0, 0, 0, zIndex), children(_children)
{
    this->recalculateDimensions();
}

void  Homelab::Graphics::Elements::Group::addChild(Homelab::Graphics::Elements::Element* child) {
    this->children.push_back(child);
    std::sort(this->children.begin(), this->children.end(), Homelab::Graphics::Elements::Element::compareZIndex);
    this->recalculateDimensions();
}

void  Homelab::Graphics::Elements::Group::addChildren(std::vector<Homelab::Graphics::Elements::Element*> children) {
    this->children.insert(this->children.end(), children);
    std::sort(this->children.begin(), this->children.end(), Homelab::Graphics::Elements::Element::compareZIndex);
    this->recalculateDimensions();
}

void Homelab::Graphics::Elements::Group::recalculateDimensions()
{
    int16_t minX = numeric_limits<int16_t>::max();
    int16_t minY = numeric_limits<int16_t>::max();
    int16_t maxX = numeric_limits<int16_t>::min();
    int16_t maxY = numeric_limits<int16_t>::min();

    for (Homelab::Graphics::Elements::Element* child : this->children)
    {
        int16_t x = child->getX();
        int16_t y = child->getY();
        int16_t height = child->getHeight();
        int16_t width = child->getWidth();
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x + width > maxX) maxX = x + width;
        if (y + height < maxY) maxY = y + height;
    }

    this->setX(minX);
    this->setY(minY);
    this->setHeight(maxY - minY);
    this->setWidth(maxX - minX);
    this->recalculateBoundingBox();
}

bool Homelab::Graphics::Elements::Group::hasChangesToDisplay()
{
    for (Homelab::Graphics::Elements::Element* child : this->children)
        if (child->hasChangesToDisplay())
            return true;
    return false;
}

void Homelab::Graphics::Elements::Group::clear(TFT_eSPI *tft = nullptr)
{
    for (Homelab::Graphics::Elements::Element* child : this->children)
        child->clear(tft)
}

void Homelab::Graphics::Elements::Group::draw(TFT_eSPI *tft = nullptr)
{
    for (Homelab::Graphics::Elements::Element* child : this->children)
        child->draw(tft)
}

void Homelab::Graphics::Elements::Group::loop(TFT_eSPI *tft = nullptr)
{
    bool lowerElementRedrawn = false;
    for (Homelab::Graphics::Elements::Element* child : this->children)
        if (lowerElementRedrawn || child->hasChangesToDisplay())
        {
            child->clear(tft)
            child->draw(tft)
        }
}