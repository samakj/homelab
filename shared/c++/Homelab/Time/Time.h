
#ifndef _Homelab_Time_h
#define _Homelab_Time_h

#include <string>
#include <functional>
#include <time.h>
#include "../Logger/Logger.h"

namespace Homelab::Wifi
{
    bool isConnected();
}

namespace Homelab::Time
{
    unsigned long millisDiff(unsigned long start, unsigned long end);
    unsigned long millisSince(unsigned long start);
    std::string getIsoTimestamp();
    std::string formatTime(const char *format);

    namespace NTP
    {
        typedef std::function<void()> ConnectCallback;

        extern std::string server;
        extern uint16_t maxWait;
        extern std::vector<ConnectCallback> connectCallbacks;
        extern bool _isConnecting;

        bool isConnecting();
        bool isConnected();

        void setServer(std::string server);
        void setMaxWait(uint16_t maxWait);

        void addConnectCallbak(ConnectCallback callback);

        void connect(bool force = false);
        void loop();
    }

};

#endif