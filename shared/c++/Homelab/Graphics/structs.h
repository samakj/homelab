#ifndef _Homelab_Graphics_structs_h
#define _Homelab_Graphics_structs_h

#include <stdint.h>

namespace Homelab::Graphics {
    struct Point
    {
        int16_t x = 0;
        int16_t y = 0;
    };

    struct Line
    {
        Point from;
        Point to;
    };

    struct Box
    {
        Point topLeft;
        Point bottomRight;
    };
}

#endif
    