
#include "Logger.h"

Homelab::Logger::LogLevel Homelab::Logger::level = Homelab::Logger::LogLevel::DEBUG;
bool Homelab::Logger::showTimestamp = true;
bool Homelab::Logger::formatWithColour = true;

void Homelab::Logger::setLogLevel(Homelab::Logger::LogLevel _level)
{
  Homelab::Logger::level = _level;
};

void setShowTimestamp(bool _showTimestamp) { Homelab::Logger::showTimestamp = _showTimestamp; };

void setFormatWithColour(bool _formatWithColour)
{
  Homelab::Logger::formatWithColour = _formatWithColour;
};

std::string Homelab::Logger::levelName(Homelab::Logger::LogLevel level)
{
  if(level == Homelab::Logger::DEBUG) return "debug";
  if(level == Homelab::Logger::INFO) return "info";
  if(level == Homelab::Logger::WARN) return "warn";
  if(level == Homelab::Logger::ERROR) return "error";
  return "unknown";
};

const char* Homelab::Logger::levelColour(Homelab::Logger::LogLevel level)
{
  if(level == Homelab::Logger::DEBUG) return "\033[36m";
  if(level == Homelab::Logger::INFO) return "";
  if(level == Homelab::Logger::WARN) return "\033[33m";
  if(level == Homelab::Logger::ERROR) return "\033[31m";
  return "";
};

std::string Homelab::Logger::levelLogPrefix(Homelab::Logger::LogLevel level)
{
  std::string levelName = Homelab::Logger::levelName(level);
  std::transform(levelName.begin(), levelName.end(), levelName.begin(), ::toupper);
  std::string prefix = "[";
  prefix += levelName;
  prefix += "]";
  while(prefix.size() < 8) prefix += " ";
  return prefix;
};

void Homelab::Logger::log(
    Homelab::Logger::LogLevel _level, std::string message, std::string start, std::string end
)
{
  if(!Serial)
  {
    Serial.begin(115200);
    while(!Serial)
    {
      yield();
      delay(10);
    }
  }

  std::string timestamp = !Homelab::Logger::showTimestamp ? "" : Homelab::Time::getIsoTimestamp();

  if(_level >= Homelab::Logger::level)
  {
    Serial.printf(
        "%s%s%s %s %s%s%s", "", start.c_str(), timestamp.c_str(), levelLogPrefix(level).c_str(),
        message.c_str(), end.c_str(), ""
    );
  }

  Homelab::Server::sendLog(_level, message, nullptr);
};

void Homelab::Logger::debug(std::string message, std::string start, std::string end)
{
  Homelab::Logger::log(Homelab::Logger::DEBUG, message, start, end);
};

void Homelab::Logger::info(std::string message, std::string start, std::string end)
{
  Homelab::Logger::log(Homelab::Logger::INFO, message, start, end);
};

void Homelab::Logger::warn(std::string message, std::string start, std::string end)
{
  Homelab::Logger::log(Homelab::Logger::WARN, message, start, end);
};

void Homelab::Logger::error(std::string message, std::string start, std::string end)
{
  Homelab::Logger::log(Homelab::Logger::ERROR, message, start, end);
};