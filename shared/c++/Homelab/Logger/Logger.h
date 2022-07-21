#ifndef _Homelab_Logger_h
#define _Homelab_Logger_h

#include <Arduino.h>
#include <ESPAsyncWebServer.h>

#include <algorithm>
#include <string>

namespace Homelab::Time
{
  std::string getIsoTimestamp();
}

namespace Homelab::Logger
{
  enum LogLevel
  {
    DEBUG,
    INFO,
    WARN,
    ERROR
  };

  extern LogLevel level;
  extern bool showTimestamp;
  extern bool formatWithColour;

  void setLogLevel(LogLevel level);
  void setShowTimestamp(bool showTimestamp);
  void setFormatWithColour(bool formatWithColour);

  std::string levelName(LogLevel level);
  std::string levelColour(LogLevel level);
  std::string levelLogPrefix(LogLevel level);

  void log(LogLevel level, std::string message, std::string start = "", std::string end = "\n");
  template <typename... Args>
  void logf(LogLevel level, std::string format, Args... args);

  void debug(std::string message, std::string start = "", std::string end = "\n");
  template <typename... Args>
  void debugf(std::string format, Args... args);

  void info(std::string message, std::string start = "", std::string end = "\n");
  template <typename... Args>
  void infof(std::string format, Args... args);

  void warn(std::string message, std::string start = "", std::string end = "\n");
  template <typename... Args>
  void warnf(std::string format, Args... args);

  void error(std::string message, std::string start = "", std::string end = "\n");
  template <typename... Args>
  void errorf(std::string format, Args... args);
};    // namespace Homelab::Logger

namespace Homelab::Server
{
  void sendLog(Homelab::Logger::LogLevel level, std::string message, AsyncWebSocketClient *client);
}

#include "Logger.tpp"

#endif