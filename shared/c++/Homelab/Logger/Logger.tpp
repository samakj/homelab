template <typename... Args>
void Homelab::Logger::logf(Homelab::Logger::LogLevel _level, std::string format, Args... args)
{
    size_t size = snprintf(nullptr, 0, format.c_str(), args...);
    char buffer[size + 8];
    sprintf(buffer, format.c_str(), args...);
    Homelab::Logger::log(_level, buffer, "", "");
};

template <typename... Args>
void Homelab::Logger::debugf(std::string format, Args... args)
{
    Homelab::Logger::logf(Homelab::Logger::LogLevel::DEBUG, format, args...);
};

template <typename... Args>
void Homelab::Logger::infof(std::string format, Args... args)
{
    Homelab::Logger::logf(Homelab::Logger::LogLevel::INFO, format, args...);
};

template <typename... Args>
void Homelab::Logger::warnf(std::string format, Args... args)
{
    Homelab::Logger::logf(Homelab::Logger::LogLevel::WARN, format, args...);
};

template <typename... Args>
void Homelab::Logger::errorf(std::string format, Args... args)
{
    Homelab::Logger::logf(Homelab::Logger::LogLevel::ERROR, format, args...);
};