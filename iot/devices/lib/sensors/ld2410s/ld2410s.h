#ifndef _Homelab_Sensors_LD2410S
#define _Homelab_Sensors_LD2410S

#include <Arduino.h>
#include <ArduinoJson.h>
#include <map>
#include <deque>
#include <string>

#ifdef ESP8266
#include <SoftwareSerial.h>
#endif

#include "logger.h"
#include "server.h"
#include "utils.h"

namespace Homelab::Sensors
{
    enum LD2410SFrameType_t
    {
        EMPTY,
        SHORT,
        STANDARD,
        CONFIG,
    };
    enum LD2410SFrameCommand_t
    {
        FIRMWARE = 0x00,
        SERIAL_NUMBER = 0x11,

        ENTER_CONFIG_MODE = 0xFF,
        LEAVE_CONFIG_MODE = 0xFE,

        NONE = 0xAA,
        UNKNOWN = 0xDD,
    };

    struct LD2410SFrame_t
    {
        LD2410SFrameType_t type;
        LD2410SFrameCommand_t command;
        uint8_t length;
        uint8_t data[128];
    };

    typedef std::function<void(std::optional<bool> presence)> LD2410SPresenceChangeCallback_t;
    typedef std::function<void(std::optional<float> distance)> LD2410SDistanceChangeCallback_t;

    class LD2410S
    {
    private:
#ifdef ESP8266
        SoftwareSerial *sensorSerial;
#else
        HardwareSerial *sensorSerial;
#endif
        uint8_t buffer[256];
        uint8_t bufferPointer = 0;

        bool frameStarted = false;
        uint8_t frameStartPointer = 0;
        uint8_t frameEndPointer = 0;

        std::deque<LD2410SFrame_t> frameBuffer;

        std::optional<float> distance;
        std::optional<boolean> presence;

        std::map<std::string, LD2410SPresenceChangeCallback_t> presenceChangeCallbacks;
        std::map<std::string, LD2410SDistanceChangeCallback_t> distanceChangeCallbacks;

        void callPresenceChangeCallbacks();
        void callDistanceChangeCallbacks();

    public:
        const uint8_t SHORT_FRAME_HEADER = 0x6E;
        const uint8_t SHORT_FRAME_FOOTER = 0x62;
        const uint8_t SHORT_FRAME_LENGTH = 4;
        const uint8_t STANDARD_FRAME_HEADER[4] = {0xF4, 0xF3, 0xF2, 0xF1};
        const uint8_t STANDARD_FRAME_FOOTER[4] = {0xF8, 0xF7, 0xF6, 0xF5};
        const uint8_t CONFIG_FRAME_HEADER[4] = {0xFD, 0xFC, 0xFB, 0xFA};
        const uint8_t CONFIG_FRAME_FOOTER[4] = {0x04, 0x03, 0x02, 0x01};

        uint8_t rx;
        uint8_t tx;
        std::string id;

        unsigned long lastShortFrame = 0;
        uint8_t shortFrameDebounce = 100;

        float distanceTolerance = 0.1;

        LD2410S(uint8_t rx, uint8_t tx, std::string id = "human-presence");

        void begin();
        void loop();
        void read();

        std::optional<float> getDistance();
        std::optional<boolean> getPresence();

        void setDistanceTolerance(float tolerance);

        void checkFrameStart();
        bool checkShortFrameStart();
        bool checkStandardFrameStart();
        bool checkConfigFrameStart();

        void checkFrameEnd();
        bool checkShortFrameEnd();
        bool checkStandardFrameEnd();
        bool checkConfigFrameEnd();

        void handleRawFrame();
        void handleRawShortFrame();
        void handleRawStandardFrame();
        void handleRawConfigFrame();

        void flushFrameBuffer();
        LD2410SFrame_t getFrame(unsigned long timeout = 10);
        void handleFrame(LD2410SFrame_t frame);
        void handleShortFrame(LD2410SFrame_t frame);
        void handleStandardFrame(LD2410SFrame_t frame);
        void handleConfigFrame(LD2410SFrame_t frame);

        LD2410SFrame_t waitForFrame(LD2410SFrameCommand_t command, unsigned long timeout = 250);

        void sendCommandHeader();
        void sendCommandFooter();
        bool enterConfigurationMode(unsigned long timeout = 250);
        bool leaveConfigurationMode(unsigned long timeout = 250);
        void getFirmwareVersion(unsigned long timeout = 250);
        void getSerialNumber(unsigned long timeout = 250);

        void printRawFrame();
        void printFrame(LD2410SFrame_t frame);
        uint16_t bytesToInt(uint8_t byteA, uint8_t byteB = 0x00);
        LD2410SFrameCommand_t intToCommand(uint8_t integer);

        void addPresenceChangeCallback(std::string name, LD2410SPresenceChangeCallback_t callback);
        void addDistanceChangeCallback(std::string name, LD2410SDistanceChangeCallback_t callback);

        void deletePresenceChangeCallback(std::string name);
        void deleteDistanceChangeCallback(std::string name);

        std::string getId();
        void getJsonValue(JsonVariant &json);
        void getJsonSchemaValue(JsonVariant &json);
        void getConfigureJsonValue(JsonVariant &json);
        void getConfigureJsonSchemaValue(JsonVariant &json);
        void receiveConfigureJsonValue(JsonVariant &json);
        std::string receiveConfigureJsonSchemaValue();
    };
}

#endif