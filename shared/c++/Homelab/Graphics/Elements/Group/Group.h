#ifndef _Homelab_Graphics_Elements_Group_h
#define _Homelab_Graphics_Elements_Group_h

#include <vector>

#include "../Element/Element.h"

namespace Homelab::Graphics::Elements
{
  class Group : public Homelab::Graphics::Elements::Element
  {
   public:
    std::vector<Homelab::Graphics::Elements::Element *> children;

    Group(std::vector<Homelab::Graphics::Elements::Element *> children, uint8_t zIndex);

    void addChild(Homelab::Graphics::Elements::Element *child);
    void addChildren(std::vector<Homelab::Graphics::Elements::Element *> child);

    void recalculateDimensions();

    virtual bool hasChangesToDisplay();

    virtual void clear(TFT_eSPI *tft = nullptr);
    virtual void draw(TFT_eSPI *tft = nullptr);
    virtual void loop(TFT_eSPI *tft = nullptr);
  };
}    // namespace Homelab::Graphics::Elements

#endif