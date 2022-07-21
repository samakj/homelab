
#include "Utils.h"

std::vector<std::string> Homelab::Utils::string::split(std::string string, char delimeter)
{
  std::vector<std::string> out = {};
  std::istringstream stream(string);
  uint8_t counter = 0;
  for(std::string part; std::getline(stream, part, delimeter); counter++) out.push_back(part);
  return out;
}

std::string Homelab::Utils::string::join(std::vector<std::string> list, char delimeter)
{
  std::string out = "";
  for(std::string part : list)
  {
    out += part;
    out += delimeter;
  }
  out.pop_back();
  return out;
}