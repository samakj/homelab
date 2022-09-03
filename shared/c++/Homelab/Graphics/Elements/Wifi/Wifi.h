#ifndef _Homelab_Graphics_Elements_Wifi_h
#define _Homelab_Graphics_Elements_Wifi_h

#include "../../../Wifi/Wifi.h"

#include "../../Collision/Collision.h"
#include "../../structs.h"
#include "../Text/Text.h"


namespace Homelab::Graphics::Elements
{
    class Wifi : public Homelab::Graphics::Elements::Text {
        public:
            Wifi(
                int16_t x,
                int16_t y,
                int16_t height,
                int16_t width,
                uint16_t fill,
                uint16_t background,
                const GFXfont* font,
                uint16_t colour,
                BoxSides<uint8_t> padding,
                VerticalDatum verticalDatum,
                HorizontalDatum horizontalDatum,
                uint8_t zIndex
            );

            virtual void loop(TFT_eSPI *tft = nullptr);
    };
}

#endif
