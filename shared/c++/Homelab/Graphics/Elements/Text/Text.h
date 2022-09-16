#ifndef _Homelab_Graphics_Elements_Text_h
#define _Homelab_Graphics_Elements_Text_h

#include <string>

#include "../../Collision/Collision.h"
#include "../../structs.h"
#include "../Rectangle/Rectangle.h"

namespace Homelab::Graphics::Elements
{
  enum VerticalDatum
  {
    TOP,
    MIDDLE,
    BOTTOM
  };

  enum HorizontalDatum
  {
    LEFT,
    CENTER,
    RIGHT
  };

  template <>
  struct DisplayedValue<VerticalDatum>
  {
    VerticalDatum set;
    VerticalDatum displayed;

    DisplayedValue(VerticalDatum _set = TOP, VerticalDatum _displayed = TOP)
        : set(_set), displayed(_displayed)
    {
    }

    bool hasChanged() { return set == displayed; };
  };

  template <>
  struct DisplayedValue<HorizontalDatum>
  {
    HorizontalDatum set;
    HorizontalDatum displayed;

    DisplayedValue(HorizontalDatum _set = LEFT, HorizontalDatum _displayed = LEFT)
        : set(_set), displayed(_displayed)
    {
    }

    bool hasChanged() { return set == displayed; };
  };

  class Text : public Homelab::Graphics::Elements::Rectangle
  {
   public:
    uint16_t textHeight;
    uint16_t textWidth;
    int16_t textOffsetX;
    int16_t textOffsetY;
    bool isConstHeight;
    bool isConstWidth;
    DisplayedValue<std::string> text;
    DisplayedValue<const GFXfont*> font;
    DisplayedValue<uint16_t> colour;
    DisplayedValue<BoxSides<uint8_t>> padding;
    DisplayedValue<VerticalDatum> verticalDatum;
    DisplayedValue<HorizontalDatum> horizontalDatum;

    Text(
        int16_t x, int16_t y, int16_t height, int16_t width, uint16_t fill, uint16_t background,
        std::string text, const GFXfont* font, uint16_t colour, BoxSides<uint8_t> padding,
        VerticalDatum verticalDatum, HorizontalDatum horizontalDatum, uint8_t zIndex
    );

    virtual std::string getText();
    virtual const GFXfont* getFont();
    virtual uint16_t getColour();
    virtual BoxSides<uint8_t> getPadding();
    virtual VerticalDatum getVerticalDatum();
    virtual HorizontalDatum getHorizontalDatum();
    virtual int16_t getTextHeight();
    virtual int16_t getTextWidth();

    virtual void setHeight(int16_t height);
    virtual void setWidth(int16_t width);
    virtual void setText(std::string text);
    virtual void setFont(const GFXfont* font);
    virtual void setColour(uint16_t colour);
    virtual void setPadding(BoxSides<uint8_t> padding);
    virtual void setVerticalDatum(VerticalDatum datum);
    virtual void setHorizontalDatum(HorizontalDatum datum);

    virtual void applyFontStyles(TFT_eSPI* tft = nullptr);

    virtual void recalculateBoundingBox();
    virtual void recalculateTextOffset();

    virtual bool hasChangesToDisplay();

    virtual void draw(TFT_eSPI* tft = nullptr);
    virtual void loop(TFT_eSPI* tft = nullptr);
  };
}    // namespace Homelab::Graphics::Elements

#endif
