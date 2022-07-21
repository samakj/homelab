#ifndef _Homelab_Utils_h
#define _Homelab_Utils_h

#include <ArduinoJson.h>

#include <sstream>
#include <string>
#include <vector>

namespace Homelab::Utils
{
  namespace string
  {
    std::vector<std::string> split(std::string string, char delimeter = ',');
    std::string join(std::vector<std::string> list, char delimeter = ',');
  }    // namespace string

  namespace json
  {
    template <typename T>
    void extendArray(JsonArray * array, std::vector<T> vector = {});
  }
}    // namespace Homelab::Utils

#include "Utils.tpp"

#endif