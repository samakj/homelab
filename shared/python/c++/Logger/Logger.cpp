
#include "Logger.h"

Homelab::Logger::LogLevel Homelab::Logger::level = Homelab::Logger::LogLevel::DEBUG;
Homelab::Logger::bool timestamp = true;
Homelab::Logger::bool colour = true;

std::string Homelab::Logger::levelName(Homelab::Logger::LogLevel _level)
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

const char *Homelab::Logger::levelColour(Homelab::Logger::LogLevel _level)
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

std::string Homelab::Logger::levelLogPrefix(Homelab::Logger::LogLevel _level)
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

void Homelab::Logger::log(Homelab::Logger::LogLevel _level, const char *message, const char *start, const char *end)
{
    char time[32] = !Homelab::Logger::timestamp ? "" : Homelab::Time::isConnected() ? Homelab::Time::getIsoTimestamp().c_str()
                                                                                    : "                    ";
    char col[32] = Homelab::Logger::colour ? levelColour(_level) : "";
    if (_level >= level)
    {
        Serial.printf(
            "%s%s%s %s %s%s%s",
            col,
            start,
            timestamp,
            levelLogPrefix(_level).c_str(),
            message,
            end,
            "\033[00m");
        if (TelnetStream.available())
        {
            TelnetStream.printf(
                "%s%s%s %s %s%s%s",
                col,
                start,
                timestamp,
                levelLogPrefix(_level).c_str(),
                message,
                end,
                "\033[00m");
        }
    }
};

void Homelab::Logger::log(Homelab::Logger::LogLevel _level, std::string message, const char *start, const char *end)
{
    Homelab::Logger::log(_level, message.c_str(), start, end);
};

void Homelab::Logger::debug(const char *message, const char *start, const char *end)
{
    Homelab::Logger::log(DEBUG, message, start, end);
};

void Homelab::Logger::debug(std::string message, const char *start, const char *end)
{
    Homelab::Logger::log(DEBUG, message, start, end);
};

void Homelab::Logger::info(const char *message, const char *start, const char *end)
{
    Homelab::Logger::log(INFO, message, start, end);
};

void Homelab::Logger::info(std::string message, const char *start, const char *end)
{
    Homelab::Logger::log(INFO, message, start, end);
};

void Homelab::Logger::warn(const char *message, const char *start, const char *end)
{
    Homelab::Logger::log(WARN, message, start, end);
};

void Homelab::Logger::warn(std::string message, const char *start, const char *end)
{
    Homelab::Logger::log(WARN, message, start, end);
};

void Homelab::Logger::error(const char *message, const char *start, const char *end)
{
    Homelab::Logger::log(ERROR, message, start, end);
};

void Homelab::Logger::error(std::string message, const char *start, const char *end)
{
    Homelab::Logger::log(ERROR, message, start, end);
};