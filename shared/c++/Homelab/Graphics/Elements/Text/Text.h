#ifndef _Homelab_Graphics_Elements_Text_h
#define _Homelab_Graphics_Elements_Text_h

#include "../../Collision/Collision.h"

#include "../../Collision/Collision.h"
#include "../../structs.h"
#include "../Rectangle/Rectangle.h"


namespace Homelab::Graphics::Elements
{
    class Text : public Homelab::Graphics::Elements::Rectangle {
        public:
            enum VerticalDatum { TOP, MIDDLE, BOTTOM };
            enum HorizontalDatum { LEFT, CENTER, RIGHT };

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
            virtual std::string setText();
            virtual const GFXfont* setFont();
            virtual uint16_t setColour();
            virtual BoxSides<uint8_t> setPadding();
            virtual VerticalDatum setVerticalDatum();
            virtual HorizontalDatum setHorizontalDatum();

            virtual void applyFontStyles();

            virtual void recalculateBoundingBox();
            virtual void recalculateTextOffset();

            virtual void draw(TFT_eSPI *tft = nullptr);
    };
}

#endif
