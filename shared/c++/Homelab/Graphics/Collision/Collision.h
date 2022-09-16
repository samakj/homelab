#ifndef _Homelab_Graphics_Collision_h
#define _Homelab_Graphics_Collision_h

#include <stdint.h>

#include <vector>

#include "../structs.h"

namespace Homelab::Graphics::Collision
{
  bool boxContainsPoint(Homelab::Graphics::Box boundingBox, Homelab::Graphics::Point point);
  bool boxContainsBox(Homelab::Graphics::Box boundingBox, Homelab::Graphics::Box boundingBox2);
  bool boxIntersectsBox(Homelab::Graphics::Box boundingBox, Homelab::Graphics::Box boundingBox2);
  std::vector<Homelab::Graphics::Box> uncontainedBoxs(
      Homelab::Graphics::Box boundingBox, Homelab::Graphics::Box boundingBox2
  );
}    // namespace Homelab::Graphics::Collision

#endif
