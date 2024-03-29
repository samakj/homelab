#ifndef _Homelab_Graphics_Elements_Icon_h
#define _Homelab_Graphics_Elements_Icon_h

#include "../../Collision/Collision.h"
#include "../../structs.h"
#include "../Text/Text.h"

namespace Homelab::Graphics::Elements
{
  class Icon : public Homelab::Graphics::Elements::Text
  {
   public:
    DisplayedValue<char> icon;

    Icon(
        int16_t x, int16_t y, int16_t height, int16_t width, uint16_t fill, uint16_t background,
        char icon, const GFXfont *font, uint16_t colour, BoxSides<uint8_t> padding,
        VerticalDatum verticalDatum, HorizontalDatum horizontalDatum, uint8_t zIndex
    );

    virtual char getIcon();

    virtual void setIcon(char icon);

    virtual bool hasChangesToDisplay();

    virtual void draw(TFT_eSPI *tft = nullptr);
    virtual void loop(TFT_eSPI *tft = nullptr);
  };
}    // namespace Homelab::Graphics::Elements

#endif
