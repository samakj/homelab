
#include "Logger.h"

Homelab::Logger::LogLevel Homelab::Logger::level = Homelab::Logger::LogLevel::DEBUG;
bool Homelab::Logger::showTimestamp = true;
bool Homelab::Logger::formatWithColour = true;

void Homelab::Logger::setLogLevel(Homelab::Logger::LogLevel _level)
{
    Homelab::Logger::level = _level;
};

void setShowTimestamp(bool _showTimestamp){
    Homelab::Logger::showTimestamp = _showTimestamp;
};

void setFormatWithColour(bool _formatWithColour){
    Homelab::Logger::formatWithColour = _formatWithColour;
};

std::string Homelab::Logger::levelName(Homelab::Logger::LogLevel level)
{
    switch (level)
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

std::string Homelab::Logger::levelColour(Homelab::Logger::LogLevel level)
{
    switch (level)
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

std::string Homelab::Logger::levelLogPrefix(Homelab::Logger::LogLevel level)
{
    std::string levelName = Homelab::Logger::levelName(level);
    std::transform(levelName.begin(), levelName.end(), levelName.begin(), ::toupper);
    std::string prefix = "[";
    prefix += levelName;
    prefix += "]";
    while (prefix.size() < 8)
        prefix += " ";
    return prefix;
};

void Homelab::Logger::log(Homelab::Logger::LogLevel _level, std::string message, std::string start, std::string end)
{
    if (!Serial)
    {
        Serial.begin(115200);
        while (!Serial)
        {
            yield();
            delay(10);
        }
    }

    #ifdef _Homelab_Time_h
    std::string timestamp = !Homelab::Logger::showTimestamp ? "" : Homelab::Time::getIsoTimestamp();
    #else
    std::string timestamp = "";
    #endif
    std::string colour = Homelab::Logger::formatWithColour ? Homelab::Logger::levelColour(level) : "";

    if (_level >= Homelab::Logger::level)
    {
        Serial.printf(
            "%s%s%s %s %s\033[0m%s",
            colour.c_str(),
            start.c_str(),
            timestamp.c_str(),
            levelLogPrefix(level).c_str(),
            message.c_str(),
            end.c_str());
    }

    #ifdef _Homelab_Server_h
    Homelab::Server::sendLog(_level, message);
    #endif
};

void Homelab::Logger::debug(std::string message, std::string start, std::string end)
{
    Homelab::Logger::log(DEBUG, message, start, end);
};

void Homelab::Logger::info(std::string message, std::string start, std::string end)
{
    Homelab::Logger::log(INFO, message, start, end);
};

void Homelab::Logger::warn(std::string message, std::string start, std::string end)
{
    Homelab::Logger::log(WARN, message, start, end);
};

void Homelab::Logger::error(std::string message, std::string start, std::string end)
{
    Homelab::Logger::log(ERROR, message, start, end);
};