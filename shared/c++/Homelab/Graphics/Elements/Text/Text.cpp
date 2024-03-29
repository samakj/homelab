#include "Text.h"

Homelab::Graphics::Elements::Text::Text(
    int16_t x, int16_t y, int16_t height, int16_t width, uint16_t fill, uint16_t background,
    std::string text, const GFXfont* font, uint16_t colour, BoxSides<uint8_t> padding,
    VerticalDatum verticalDatum, HorizontalDatum horizontalDatum, uint8_t zIndex
)
    : Rectangle(x, y, height, width, fill, background, zIndex)
{
  this->setText(text);
  this->setFont(font);
  this->setColour(colour);
  this->setPadding(padding);
  this->setVerticalDatum(verticalDatum);
  this->setHorizontalDatum(horizontalDatum);
  this->textHeight = 0;
  this->textWidth = 0;
  this->isConstHeight = !!height;
  this->isConstWidth = !!width;
};

std::string Homelab::Graphics::Elements::Text::getText() { return this->text.set; }

const GFXfont* Homelab::Graphics::Elements::Text::getFont() { return this->font.set; }

uint16_t Homelab::Graphics::Elements::Text::getColour() { return this->colour.set; }

Homelab::Graphics::Elements::BoxSides<uint8_t> Homelab::Graphics::Elements::Text::getPadding()
{
  return this->padding.set;
}

Homelab::Graphics::Elements::VerticalDatum Homelab::Graphics::Elements::Text::getVerticalDatum()
{
  return this->verticalDatum.set;
}

Homelab::Graphics::Elements::HorizontalDatum Homelab::Graphics::Elements::Text::getHorizontalDatum()
{
  return this->horizontalDatum.set;
}

int16_t Homelab::Graphics::Elements::Text::getTextHeight() { return this->textHeight; }

int16_t Homelab::Graphics::Elements::Text::getTextWidth() { return this->textWidth; }

void Homelab::Graphics::Elements::Text::setText(std::string text)
{
  this->text.set = text;
  this->textHeight = 0;
  this->textWidth = 0;
}

void Homelab::Graphics::Elements::Text::setFont(const GFXfont* font)
{
  this->font.set = font;
  this->textHeight = 0;
  this->textWidth = 0;
}

void Homelab::Graphics::Elements::Text::setColour(uint16_t colour) { this->colour.set = colour; }

void Homelab::Graphics::Elements::Text::setPadding(BoxSides<uint8_t> padding)
{
  this->padding.set = padding;
  this->isConstHeight = (padding.top >= 0 || padding.bottom >= 0);
  this->isConstWidth = (padding.left >= 0 || padding.right >= 0);
  this->recalculateBoundingBox();
  this->recalculateTextOffset();
}

void Homelab::Graphics::Elements::Text::setVerticalDatum(
    Homelab::Graphics::Elements::VerticalDatum datum
)
{
  this->verticalDatum.set = datum;
}

void Homelab::Graphics::Elements::Text::setHorizontalDatum(
    Homelab::Graphics::Elements::HorizontalDatum datum
)
{
  this->horizontalDatum.set = datum;
}

void Homelab::Graphics::Elements::Text::setHeight(int16_t height)
{
  this->height.set = height;
  this->padding.set.top = 0;
  this->padding.set.bottom = 0;
  this->isConstHeight = true;
  this->recalculateBoundingBox();
  this->recalculateTextOffset();
}

void Homelab::Graphics::Elements::Text::setWidth(int16_t width)
{
  this->width.set = width;
  this->padding.set.left = 0;
  this->padding.set.right = 0;
  this->isConstWidth = true;
  this->recalculateBoundingBox();
  this->recalculateTextOffset();
}

void Homelab::Graphics::Elements::Text::applyFontStyles(TFT_eSPI* tft)
{
  tft->setTextDatum(TL_DATUM);
  tft->setFreeFont(this->font.set);
  tft->setTextColor(this->colour.set);
}

void Homelab::Graphics::Elements::Text::recalculateBoundingBox()
{
  if(!this->isConstHeight)
    this->height.set = this->textHeight + this->padding.set.top + this->padding.set.bottom;
  if(!this->isConstWidth)
    this->width.set = this->textWidth + this->padding.set.left + this->padding.set.right;
  if(this->verticalDatum.displayed == Homelab::Graphics::Elements::VerticalDatum::TOP)
  {
    this->boundingBox.topLeft.y = this->y.set;
    this->boundingBox.bottomRight.y = this->y.set + this->height.set;
  }
  else if(this->verticalDatum.displayed == Homelab::Graphics::Elements::VerticalDatum::MIDDLE)
  {
    this->boundingBox.topLeft.y = this->y.set - 0.5 * this->height.set;
    this->boundingBox.bottomRight.y = this->y.set + 0.5 * this->height.set;
  }
  else if(this->verticalDatum.displayed == Homelab::Graphics::Elements::VerticalDatum::BOTTOM)
  {
    this->boundingBox.topLeft.y = this->y.set - this->height.set;
    this->boundingBox.bottomRight.y = this->y.set;
  }
  if(this->horizontalDatum.displayed == Homelab::Graphics::Elements::HorizontalDatum::LEFT)
  {
    this->boundingBox.topLeft.x = this->x.set;
    this->boundingBox.bottomRight.x = this->x.set + this->width.set;
  }
  else if(this->horizontalDatum.displayed == Homelab::Graphics::Elements::HorizontalDatum::CENTER)
  {
    this->boundingBox.topLeft.x = this->x.set - 0.5 * this->width.set;
    this->boundingBox.bottomRight.x = this->x.set + 0.5 * this->width.set;
  }
  else if(this->horizontalDatum.displayed == Homelab::Graphics::Elements::HorizontalDatum::RIGHT)
  {
    this->boundingBox.topLeft.x = this->x.set - this->width.set;
    this->boundingBox.bottomRight.x = this->x.set;
  }
}

void Homelab::Graphics::Elements::Text::recalculateTextOffset()
{
  if(this->isConstHeight) this->textOffsetY = (this->height.set + this->textHeight) / 2;
  else this->textOffsetY = this->padding.set.top;
  if(this->isConstWidth) this->textOffsetX = (this->width.set + this->textWidth) / 2;
  else this->textOffsetX = this->padding.set.left;
}

bool Homelab::Graphics::Elements::Text::hasChangesToDisplay()
{
  return (
      Homelab::Graphics::Elements::Element::hasChangesToDisplay() || this->x.hasChanged() ||
      this->y.hasChanged() || this->height.hasChanged() || this->width.hasChanged() ||
      this->fill.hasChanged() || this->background.hasChanged() || this->text.hasChanged() ||
      this->font.hasChanged() || this->colour.hasChanged() || this->padding.hasChanged() ||
      this->verticalDatum.hasChanged() || this->horizontalDatum.hasChanged()
  );
}

void Homelab::Graphics::Elements::Text::draw(TFT_eSPI* tft)
{
  this->applyFontStyles(tft);
  if(!this->textHeight || !this->textWidth)
  {
    if(!this->textHeight) this->textHeight = (uint16_t)tft->fontHeight();
    if(!this->textWidth) this->textWidth = (uint16_t)tft->textWidth(this->text.set.c_str());
    this->recalculateBoundingBox();
    this->recalculateTextOffset();
  }

  Homelab::Graphics::Elements::Rectangle::draw(tft);
  tft->drawString(
      this->text.set.c_str(), this->boundingBox.topLeft.x + this->textOffsetX,
      this->boundingBox.topLeft.y + this->textOffsetY
  );
  this->text.displayed = this->text.set;
  this->font.displayed = this->font.set;
  this->colour.displayed = this->colour.set;
  this->padding.displayed = this->padding.set;
  this->verticalDatum.displayed = this->verticalDatum.set;
  this->horizontalDatum.displayed = this->horizontalDatum.set;
};

void Homelab::Graphics::Elements::Text::loop(TFT_eSPI* tft)
{
  if(this->hasChangesToDisplay())
  {
    this->clear(tft);
    this->draw(tft);
  }
};