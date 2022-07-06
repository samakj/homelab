#ifndef _Homelab_Utils_h
#define _Homelab_Utils_h

#include <sstream>
#include <string>

namespace Homelab::Utils
{
    namespace string
    {
        std::vector<std::string> split(std::string string, char delimeter = ',');
        std::string join(std::vector<std::string> list, char delimeter = ',');
    }
}

#endif