#include "Text.h"

Homelab::Graphics::Elements::Text::Text(
    int16_t x,
    int16_t y,
    int16_t height,
    int16_t width,
    uint16_t fill,
    uint16_t background,
    std::string text,
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
    icon,
    font,
    colour,
    padding,
    verticalDatum,
    horizontalDatum,
    zIndex
)
{
    this->setIcon(icon);
};

char Homelab::Graphics:Elements::Icon::getIcon() { return this->icon.set; }

void Homelab::Graphics:Elements::Icon::setText(char icon) {
    this->icon.set = icon;
    this->setText(icon);
}

void Homelab::Graphics::Elements::Icon::hasChangesToDisplay() 
{
    return (
        Homelab::Graphics::Elements::Text::hasChangesToDisplay() ||
        this->icon.hasChanged()
    )
}

void Homelab::Graphics::Elements::Icon::draw(TFT_eSPI *tft) 
{
    Homelab::Graphics::Elements::Rectangle::draw(tft);
    this->icon.displayed = this->icon.set
}

void Homelab::Graphics::Elements::Icon::loop(TFT_eSPI *tft) 
{
    if (this->hasChangesToDisplay())
    {
        this->clear(tft);
        this->draw(tft);
    }
};
