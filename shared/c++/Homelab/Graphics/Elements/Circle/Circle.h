#ifndef _Homelab_Graphics_Elements_Circle_h
#define _Homelab_Graphics_Elements_Circle_h

#include "../../Collision/Collision.h"
#include "../../structs.h"
#include "../Element/Element.h"


namespace Homelab::Graphics::Elements
{
    class Circle : public Homelab::Graphics::Elements::Element {
        public:
            DisplayedValue<uint16_t> radius;
            DisplayedValue<uint16_t> fill;
            DisplayedValue<uint16_t> background;
        
            Circle(int16_t x, int16_t y, int16_t radius, uint16_t fill, uint16_t background, uint8_t zIndex);

            virtual int16_t getRadius();
            virtual int16_t getFill();
            virtual int16_t getBackground();

            virtual void setRadius(uint16_t radius);
            virtual void setHeight(uint16_t height);
            virtual void setWidth(uint16_t width);
            virtual void setFill(uint16_t fill);
            virtual void setBackground(uint16_t backround);

            virtual void clear(TFT_eSPI *tft = nullptr);
            virtual void draw(TFT_eSPI *tft = nullptr);
            virtual void loop(TFT_eSPI *tft = nullptr);
    };
}

#endif
