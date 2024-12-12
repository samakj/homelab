#include "logger.h"

namespace Homelab::Logger
{
    Homelab::Logger::LogLevel level = Homelab::Logger::LogLevel::DEBUG;
    bool timestamp = true;
    bool colour = true;
    SendLog_t sendLog = [](std::string log) {};

    std::string levelName(Homelab::Logger::LogLevel _level)
    {
        switch (_level)
        {
        case Homelab::Logger::LogLevel::DEBUG:
            return "debug";
        case Homelab::Logger::LogLevel::INFO:
            return "info";
        case Homelab::Logger::LogLevel::WARN:
            return "warn";
        case Homelab::Logger::LogLevel::ERROR:
            return "error";
        default:
            return "unknown";
        }
    };

    const char *levelColour(Homelab::Logger::LogLevel _level)
    {
        switch (_level)
        {
        case Homelab::Logger::LogLevel::DEBUG:
            return "\033[36m";
        case Homelab::Logger::LogLevel::INFO:
            return "";
        case Homelab::Logger::LogLevel::WARN:
            return "\033[33m";
        case Homelab::Logger::LogLevel::ERROR:
            return "\033[31m";
        default:
            return "";
        }
    };

    std::string levelLogPrefix(Homelab::Logger::LogLevel _level)
    {
        std::string _levelName = Homelab::Logger::levelName(_level);
        std::transform(_levelName.begin(), _levelName.end(), _levelName.begin(), ::toupper);
        std::string prefix = "[";
        prefix += _levelName;
        prefix += "]";
        while (prefix.size() < 8)
            prefix += " ";
        return prefix;
    };

    void log(Homelab::Logger::LogLevel _level, const char *message, const char *start, const char *end)
    {
        std::string _timestamp = Homelab::getIsoTimestamp();

        if (_level >= level)
        {
            Serial.printf(
                "%s%s%s %s %s%s%s",
                colour ? levelColour(_level) : "",
                start,
                timestamp ? _timestamp.c_str() : "",
                levelLogPrefix(_level).c_str(),
                message,
                end,
                "\033[00m");
        }

        std::string log = "{";

        log += "\"level\":\"";
        log += Homelab::Logger::levelName(_level);
        log += "\",";
        log += "\"timestamp\":\"";
        log += _timestamp;
        log += "\",";
        log += "\"message\":\"";
        log += message;
        log += "\"";
        log += "}";

        sendLog(log);
    };

    void log(Homelab::Logger::LogLevel _level, std::string message, const char *start, const char *end)
    {
        Homelab::Logger::log(_level, message.c_str(), start, end);
    };

    void debug(const char *message, const char *start, const char *end)
    {
        Homelab::Logger::log(DEBUG, message, start, end);
    };

    void debug(std::string message, const char *start, const char *end)
    {
        Homelab::Logger::log(DEBUG, message, start, end);
    };

    void info(const char *message, const char *start, const char *end)
    {
        Homelab::Logger::log(INFO, message, start, end);
    };

    void info(std::string message, const char *start, const char *end)
    {
        Homelab::Logger::log(INFO, message, start, end);
    };

    void warn(const char *message, const char *start, const char *end)
    {
        Homelab::Logger::log(WARN, message, start, end);
    };

    void warn(std::string message, const char *start, const char *end)
    {
        Homelab::Logger::log(WARN, message, start, end);
    };

    void error(const char *message, const char *start, const char *end)
    {
        Homelab::Logger::log(ERROR, message, start, end);
    };

    void error(std::string message, const char *start, const char *end)
    {
        Homelab::Logger::log(ERROR, message, start, end);
    };
}