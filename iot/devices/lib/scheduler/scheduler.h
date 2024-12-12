#ifndef _Homelab_Scheduler_h
#define _Homelab_Scheduler_h

#include <Arduino.h>

#include <map>
#include <string>
#include <functional>

namespace Homelab
{
    struct SchedulerTaskCallbackArg_t
    {
        std::string name;
        uint16_t delayMs;
        uint32_t lastRun;
    };

    typedef std::function<void(SchedulerTaskCallbackArg_t *arg)> SchedulerTask_t;

    struct SchedulerTaskConfig_t
    {
        std::string name;
        SchedulerTask_t task;
        uint16_t delayMs;
        uint32_t lastRun;
    };

    class SchedulerClass
    {
    private:
        static SchedulerClass *instance;
        SchedulerClass() {}

        std::map<std::string, SchedulerTaskConfig_t> configs;
        std::map<std::string, uint32_t> lastRun;

    public:
        SchedulerClass(const SchedulerClass &obj) = delete;
        static SchedulerClass *getInstance();

        void addTask(SchedulerTaskConfig_t config);
        void addTask(std::string name, SchedulerTask_t task, uint16_t delayMs, boolean runImmediately = true);
        void deleteTask(std::string name);
        void deleteTask(SchedulerTaskConfig_t *config);
        void loop();
    };

    extern SchedulerClass *Scheduler;
}

#endif
