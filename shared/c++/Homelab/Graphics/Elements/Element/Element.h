#ifndef _Homelab_Graphics_Elements_Element_h
#define _Homelab_Graphics_Elements_Element_h

#include <TFT_eSPI.h>

#include "../../Collision/Collision.h"
#include "../../structs.h"

namespace Homelab::Graphics::Elements
{
  template <typename T>
  struct DisplayedValue
  {
    T set;
    T displayed;

    DisplayedValue(T _set = 0, T _displayed = 0) : set(_set), displayed(_displayed) {}

    bool hasChanged() { return set == displayed; };
  };

  template <>
  struct DisplayedValue<Homelab::Graphics::Box>
  {
    Homelab::Graphics::Box set;
    Homelab::Graphics::Box displayed;

    DisplayedValue(
        Homelab::Graphics::Box _set = {{0, 0}, {0, 0}},
        Homelab::Graphics::Box _displayed = {{0, 0}, {0, 0}}
    )
        : set(_set), displayed(_displayed)
    {
    }

    bool hasChanged() { return set == displayed; };
  };

  template <typename T>
  struct BoxSides
  {
    T top;
    T bottom;
    T left;
    T right;

    bool operator==(const BoxSides &other) const
    {
      return (
          other.top == this->top && other.bottom == this->bottom && other.left == this->left &&
          other.right == this->right
      );
    }
  };

  template <typename T>
  struct DisplayedValue<BoxSides<T>>
  {
    BoxSides<T> set;
    BoxSides<T> displayed;

    DisplayedValue(BoxSides<T> _set = {0, 0, 0, 0}, BoxSides<T> _displayed = {0, 0, 0, 0})
        : set(_set), displayed(_displayed)
    {
    }

    bool hasChanged() { return set == displayed; };
  };

  class Element
  {
   public:
    DisplayedValue<int16_t> x;
    DisplayedValue<int16_t> y;
    DisplayedValue<int16_t> height;
    DisplayedValue<int16_t> width;
    Homelab::Graphics::Box boundingBox;

    bool redraw = true;
    bool visible = false;
    uint8_t zIndex = 1;

    static bool compareZIndex(Element *a, Element *b) { return a->getZIndex() < b->getZIndex(); }

    Element(int16_t x, int16_t y, int16_t height, int16_t width, uint8_t zIndex);

    virtual int16_t getX();
    virtual int16_t getY();
    virtual int16_t getHeight();
    virtual int16_t getWidth();
    virtual bool getVisible();
    virtual uint8_t getZIndex();
    virtual Homelab::Graphics::Box getBoundingBox();

    virtual void setX(int16_t x);
    virtual void setY(int16_t y);
    virtual void setHeight(int16_t height);
    virtual void setWidth(int16_t width);
    virtual void setVisible(bool visible = true);
    virtual void setZIndex(uint8_t zIndex);

    virtual void recalculateBoundingBox();

    virtual bool containsPoint(Homelab::Graphics::Point point);
    virtual bool intersectsBox(Homelab::Graphics::Box box);

    virtual bool hasChangesToDisplay();

    virtual void clear(TFT_eSPI *tft = nullptr);
    virtual void draw(TFT_eSPI *tft = nullptr);
    virtual void loop(TFT_eSPI *tft = nullptr);
  };
}    // namespace Homelab::Graphics::Elements

#endif
