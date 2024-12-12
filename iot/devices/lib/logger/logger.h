#ifndef _Homelab_Logger_h
#define _Homelab_Logger_h

#include <Arduino.h>
#include <algorithm>
#include <string>

// Find a better way to do this
namespace Homelab
{
    std::string getIsoTimestamp();
}

namespace Homelab::Logger
{
    typedef std::function<void(std::string log)> SendLog_t;

    enum LogLevel
    {
        DEBUG,
        INFO,
        WARN,
        ERROR
    };
    extern Homelab::Logger::LogLevel level;
    extern bool timestamp;
    extern bool colour;
    extern SendLog_t sendLog;

    std::string levelName(Homelab::Logger::LogLevel _level);
    const char *levelColour(Homelab::Logger::LogLevel _level);
    std::string levelLogPrefix(Homelab::Logger::LogLevel _level);
    void log(Homelab::Logger::LogLevel _level, const char *message, const char *start = "", const char *end = "\n");
    void log(Homelab::Logger::LogLevel _level, std::string message, const char *start = "", const char *end = "\n");
    template <typename... Args>
    void logf(Homelab::Logger::LogLevel _level, const char *format, Args... args);
    void debug(const char *message, const char *start = "", const char *end = "\n");
    void debug(std::string message, const char *start = "", const char *end = "\n");
    template <typename... Args>
    void debugf(const char *format, Args... args);
    void info(const char *message, const char *start = "", const char *end = "\n");
    void info(std::string message, const char *start = "", const char *end = "\n");
    template <typename... Args>
    void infof(const char *format, Args... args);
    void warn(const char *message, const char *start = "", const char *end = "\n");
    void warn(std::string message, const char *start = "", const char *end = "\n");
    template <typename... Args>
    void warnf(const char *format, Args... args);
    void error(const char *message, const char *start = "", const char *end = "\n");
    void error(std::string message, const char *start = "", const char *end = "\n");
    template <typename... Args>
    void errorf(const char *format, Args... args);
};

#include "logger.tpp"

#endif