#ifndef _Homelab_Graphics_structs_h
#define _Homelab_Graphics_structs_h

#include <stdint.h>

namespace Homelab::Graphics
{
  struct Point
  {
    int16_t x = 0;
    int16_t y = 0;

    bool operator==(const Point &other) const { return (other.x == this->x && other.y == this->y); }
  };

  struct Line
  {
    Point from;
    Point to;

    bool operator==(const Line &other) const
    {
      return (other.from == this->from && other.to == this->to);
    }
  };

  struct Box
  {
    Point topLeft;
    Point bottomRight;

    bool operator==(const Box &other) const
    {
      return (other.topLeft == this->topLeft && other.bottomRight == this->bottomRight);
    }
  };
}    // namespace Homelab::Graphics

#endif
