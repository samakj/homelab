template <typename... Args>
void Homelab::Logger::logf(Homelab::Logger::LogLevel _level, const char *format, Args... args)
{
    size_t size = snprintf(nullptr, 0, format, args...);
    char buffer[size + 8];
    sprintf(buffer, format, args...);
    log(_level, buffer, "", "");
};

template <typename... Args>
void Homelab::Logger::debugf(const char *format, Args... args)
{
    logf(Homelab::Logger::LogLevel::DEBUG, format, args...);
};

template <typename... Args>
void Homelab::Logger::infof(const char *format, Args... args)
{
    logf(Homelab::Logger::LogLevel::INFO, format, args...);
};

template <typename... Args>
void Homelab::Logger::warnf(const char *format, Args... args)
{
    logf(Homelab::Logger::LogLevel::WARN, format, args...);
};

template <typename... Args>
void Homelab::Logger::errorf(const char *format, Args... args)
{
    logf(Homelab::Logger::LogLevel::ERROR, format, args...);
};