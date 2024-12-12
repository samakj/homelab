#include "scheduler.h"

Homelab::SchedulerClass *Homelab::SchedulerClass::instance = NULL;

Homelab::SchedulerClass *Homelab::SchedulerClass::getInstance()
{
    if (instance == NULL)
        instance = new Homelab::SchedulerClass();
    return instance;
}
void Homelab::SchedulerClass::addTask(SchedulerTaskConfig_t config)
{
    this->configs[config.name] = config;
}
void Homelab::SchedulerClass::addTask(std::string name, SchedulerTask_t task, uint16_t delayMs, boolean runImmediately)
{
    this->configs[name] = {
        .name = name,
        .task = task,
        .delayMs = delayMs,
        .lastRun = runImmediately ? 0 : millis(),
    };
}

void Homelab::SchedulerClass::deleteTask(std::string name)
{
    this->configs.erase(name);
    this->lastRun.erase(name);
}

void Homelab::SchedulerClass::deleteTask(SchedulerTaskConfig_t *config)
{
    this->configs.erase(config->name);
    this->lastRun.erase(config->name);
}

void Homelab::SchedulerClass::loop()
{
    // Copy to new map so that its safe to add and delete during iteration
    std::map<std::string, SchedulerTaskConfig_t> _configs;
    _configs = this->configs;

    for (auto const &keyValuePair : _configs)
    {
        std::string name = keyValuePair.first;
        SchedulerTaskConfig_t config = keyValuePair.second;
        uint32_t lastRun = this->lastRun[name];
        SchedulerTaskCallbackArg_t arg = {
            .name = name,
            .delayMs = config.delayMs,
            .lastRun = lastRun,
        };

        if (millis() - lastRun >= config.delayMs)
        {
            config.task(&arg);
            this->lastRun[name] = millis();
        }
    }
};

Homelab::SchedulerClass *Homelab::Scheduler = Homelab::SchedulerClass::getInstance();