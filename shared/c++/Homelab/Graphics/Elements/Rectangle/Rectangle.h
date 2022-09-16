#ifndef _Homelab_Graphics_Elements_Rectangle_h
#define _Homelab_Graphics_Elements_Rectangle_h

#include "../../Collision/Collision.h"
#include "../../structs.h"
#include "../Element/Element.h"

namespace Homelab::Graphics::Elements
{
  class Rectangle : public Homelab::Graphics::Elements::Element
  {
   public:
    DisplayedValue<uint16_t> fill;
    DisplayedValue<uint16_t> background;

    Rectangle(
        int16_t x, int16_t y, int16_t height, int16_t width, uint16_t fill, uint16_t background,
        uint8_t zIndex
    );

    virtual int16_t getFill();
    virtual int16_t getBackground();

    virtual void setFill(uint16_t fill);
    virtual void setBackground(uint16_t background);

    virtual bool hasChangesToDisplay();

    virtual void clear(TFT_eSPI *tft = nullptr);
    virtual void draw(TFT_eSPI *tft = nullptr);
    virtual void loop(TFT_eSPI *tft = nullptr);
  };
}    // namespace Homelab::Graphics::Elements

#endif
