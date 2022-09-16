#include "Collision.h"

bool Homelab::Graphics::Collision::boxContainsPoint(
    Homelab::Graphics::Box box, Homelab::Graphics::Point point
)
{
  return (
      box.topLeft.x <= point.x && box.topLeft.y <= point.y && box.bottomRight.x >= point.x &&
      box.bottomRight.y >= point.y
  );
}

bool Homelab::Graphics::Collision::boxContainsBox(
    Homelab::Graphics::Box box, Homelab::Graphics::Box box2
)
{
  return (
      Homelab::Graphics::Collision::boxContainsPoint(box, box2.topLeft) &&
      Homelab::Graphics::Collision::boxContainsPoint(box, box2.bottomRight)
  );
}

bool Homelab::Graphics::Collision::boxIntersectsBox(
    Homelab::Graphics::Box box, Homelab::Graphics::Box box2
)
{
  return (
      Homelab::Graphics::Collision::boxContainsPoint(box, box2.topLeft) ||
      Homelab::Graphics::Collision::boxContainsPoint(box, box2.bottomRight) ||
      Homelab::Graphics::Collision::boxContainsPoint(box, {box2.topLeft.x, box2.bottomRight.y}) ||
      Homelab::Graphics::Collision::boxContainsPoint(box, {box2.bottomRight.x, box2.topLeft.y}) ||
      Homelab::Graphics::Collision::boxContainsBox(box, box2)
  );
  // return (
  //     (box.topLeft.y > box2.topLeft.y && box.topLeft.y < box2.bottomRight.y && box.topLeft.y <
  //     box2.bottomRight.y && box.bottomRight.y > box2.topLeft.y) || (box.bottomRight.y >
  //     box2.topLeft.y && box.bottomRight.y < box2.bottomRight.y && box.topLeft.y <
  //     box2.bottomRight.y && box.bottomRight.y > box2.topLeft.y) || (box.topLeft.x >
  //     box2.topLeft.x && box.topLeft.x < box2.bottomRight.x && box.topLeft.x < box2.bottomRight.x
  //     && box.bottomRight.x > box2.topLeft.x) || (box.bottomRight.x > box2.topLeft.x &&
  //     box.bottomRight.x < box2.bottomRight.x && box.topLeft.x < box2.bottomRight.x &&
  //     box.bottomRight.x > box2.topLeft.x)
  // );
}

std::vector<Homelab::Graphics::Box> Homelab::Graphics::Collision::uncontainedBoxs(
    Homelab::Graphics::Box oldBox, Homelab::Graphics::Box newBox
)
{
  std::vector<Homelab::Graphics::Box> boxs = {};

  if(Homelab::Graphics::Collision::boxContainsBox(newBox, oldBox)) return boxs;

  if(Homelab::Graphics::Collision::boxIntersectsBox(newBox, oldBox))
  {
    if(oldBox.topLeft.x < newBox.topLeft.x)
    {
      Homelab::Graphics::Box box;
      Homelab::Graphics::Point p1, p2;
      p1.x = oldBox.topLeft.x;
      p1.y = oldBox.topLeft.y;
      p2.x = newBox.topLeft.x;
      p2.y = oldBox.bottomRight.y;
      box.topLeft = p1;
      box.bottomRight = p2;
      boxs.push_back(box);
    }
    if(oldBox.bottomRight.x > newBox.bottomRight.x)
    {
      Homelab::Graphics::Box box;
      Homelab::Graphics::Point p1, p2;
      p1.x = newBox.bottomRight.x;
      p1.y = oldBox.topLeft.y;
      p2.x = oldBox.bottomRight.x;
      p2.y = oldBox.bottomRight.y;
      box.topLeft = p1;
      box.bottomRight = p2;
      boxs.push_back(box);
    }
    if(oldBox.topLeft.y < newBox.topLeft.y)
    {
      Homelab::Graphics::Box box;
      Homelab::Graphics::Point p1, p2;
      p1.x = newBox.topLeft.x;
      p1.y = oldBox.topLeft.y;
      p2.x = newBox.bottomRight.x;
      p2.y = newBox.topLeft.y;
      box.topLeft = p1;
      box.bottomRight = p2;
      boxs.push_back(box);
    }
    if(oldBox.bottomRight.y > newBox.bottomRight.y)
    {
      Homelab::Graphics::Box box;
      Homelab::Graphics::Point p1, p2;
      p1.x = newBox.topLeft.x;
      p1.y = newBox.bottomRight.y;
      p2.x = newBox.bottomRight.x;
      p2.y = oldBox.bottomRight.y;
      box.topLeft = p1;
      box.bottomRight = p2;
      boxs.push_back(box);
    }
  }
  else { boxs.push_back(oldBox); }

  return boxs;
}