#include "ld2410s.h"

Homelab::Sensors::LD2410S::LD2410S(uint8_t _rx, uint8_t _tx, std::string _id) : rx(_rx), tx(_tx), id(_id)
{
#ifdef ESP8266
    this->sensorSerial = new SoftwareSerial();
#else
    this->sensorSerial = &Serial1;
#endif

    std::string id = this->getId();

    Homelab::Server->addSource(
        id,
        [this](JsonVariant &json)
        { return Homelab::Sensors::LD2410S::getJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Sensors::LD2410S::getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Sensors::LD2410S::getConfigureJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Sensors::LD2410S::getConfigureJsonSchemaValue(json); });
    Homelab::Server->addSink(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Sensors::LD2410S::receiveConfigureJsonValue(json); });
}

void Homelab::Sensors::LD2410S::begin()
{
    Homelab::Logger::infof("Connecting to '%s' serial\n", id.c_str());

#ifdef ESP8266
    this->sensorSerial->begin(115200, SWSERIAL_8N1, this->rx, this->tx);
#else
    this->sensorSerial->begin(115200, SERIAL_8N1, this->rx, this->tx);
#endif

    unsigned long start = millis();
    while (!this->sensorSerial && millis() - start < 100)
        ;

    if (!this->sensorSerial)
        Homelab::Logger::errorf("Failed to connect to '%s' serial\n", id.c_str());
    else
        Homelab::Logger::infof("Connected to '%s' serial\n", id.c_str());
}

void Homelab::Sensors::LD2410S::loop()
{
    this->read();
    this->flushFrameBuffer();
}

std::optional<float> Homelab::Sensors::LD2410S::getDistance()
{
    return this->distance;
};
std::optional<boolean> Homelab::Sensors::LD2410S::getPresence()
{
    return this->presence;
};

void Homelab::Sensors::LD2410S::setDistanceTolerance(float tolerance)
{
    this->distanceTolerance = tolerance;
};

void Homelab::Sensors::LD2410S::read()
{
    while (this->sensorSerial->available())
    {
        this->buffer[this->bufferPointer] = this->sensorSerial->read();
        this->checkFrameStart();
        this->checkFrameEnd();
        this->bufferPointer = Homelab::number::circularAdd(this->bufferPointer);
    }
}

void Homelab::Sensors::LD2410S::checkFrameStart()
{
    if (this->checkShortFrameStart())
    {
        this->frameStarted = true;
        this->frameStartPointer = this->bufferPointer;
    }
    if (this->checkStandardFrameStart())
    {
        this->frameStarted = true;
        this->frameStartPointer = Homelab::number::circularSubtract(this->bufferPointer, 3);
    }
    if (this->checkConfigFrameStart())
    {
        this->frameStarted = true;
        this->frameStartPointer = Homelab::number::circularSubtract(this->bufferPointer, 3);
    }
}

bool Homelab::Sensors::LD2410S::checkShortFrameStart()
{
    return !this->frameStarted && this->buffer[this->bufferPointer] == this->SHORT_FRAME_HEADER;
}

bool Homelab::Sensors::LD2410S::checkStandardFrameStart()
{
    return (
        !this->frameStarted &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 3)] == this->STANDARD_FRAME_HEADER[0] &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 2)] == this->STANDARD_FRAME_HEADER[1] &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 1)] == this->STANDARD_FRAME_HEADER[2] &&
        this->buffer[this->bufferPointer] == this->STANDARD_FRAME_HEADER[3]);
}

bool Homelab::Sensors::LD2410S::checkConfigFrameStart()
{
    return (
        !this->frameStarted &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 3)] == this->CONFIG_FRAME_HEADER[0] &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 2)] == this->CONFIG_FRAME_HEADER[1] &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 1)] == this->CONFIG_FRAME_HEADER[2] &&
        this->buffer[this->bufferPointer] == this->CONFIG_FRAME_HEADER[3]);
}

void Homelab::Sensors::LD2410S::checkFrameEnd()
{
    if (this->checkShortFrameEnd() || this->checkStandardFrameEnd() || this->checkConfigFrameEnd())
    {
        this->frameStarted = false;
        this->frameEndPointer = this->bufferPointer;
        this->handleRawFrame();
    }
}

bool Homelab::Sensors::LD2410S::checkShortFrameEnd()
{
    if (!this->frameStarted)
        return false;
    if (this->buffer[this->frameStartPointer] != this->SHORT_FRAME_HEADER)
        return false;

    if (Homelab::number::circularSubtract(this->bufferPointer, this->frameStartPointer) > this->SHORT_FRAME_LENGTH)
    {
        // Started a short frame but its the wrong length, abort frame
        Homelab::Logger::errorf("'%s' encountered a short frame frame with incorrect length", this->getId().c_str());
        this->frameStarted = false;
        this->frameEndPointer = this->frameStartPointer;
        return false;
    }

    return this->buffer[this->bufferPointer] == this->SHORT_FRAME_FOOTER;
}

bool Homelab::Sensors::LD2410S::checkStandardFrameEnd()
{
    if (!this->frameStarted)
        return false;
    if (this->buffer[this->frameStartPointer] != this->STANDARD_FRAME_HEADER[0])
        return false;

    if (
        Homelab::number::circularSubtract(this->bufferPointer, this->frameStartPointer) >
        this->bytesToInt(
            Homelab::number::circularAdd(this->frameStartPointer, 4),
            Homelab::number::circularAdd(this->frameStartPointer, 5)))
    {
        // Started a short frame but its the wrong length, abort frame
        Homelab::Logger::errorf("'%s' encountered a standard frame frame with incorrect length", this->getId().c_str());
        this->frameStarted = false;
        this->frameEndPointer = this->frameStartPointer;
        return false;
    }

    return (
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 3)] == this->STANDARD_FRAME_FOOTER[0] &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 2)] == this->STANDARD_FRAME_FOOTER[1] &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 1)] == this->STANDARD_FRAME_FOOTER[2] &&
        this->buffer[this->bufferPointer] == this->STANDARD_FRAME_FOOTER[3]);
}

bool Homelab::Sensors::LD2410S::checkConfigFrameEnd()
{
    if (!this->frameStarted)
        return false;
    if (this->buffer[this->frameStartPointer] != this->CONFIG_FRAME_HEADER[0])
        return false;

    if (
        Homelab::number::circularSubtract(this->bufferPointer, this->frameStartPointer) >
        this->bytesToInt(
            Homelab::number::circularAdd(this->frameStartPointer, 4),
            Homelab::number::circularAdd(this->frameStartPointer, 5)))
    {
        // Started a short frame but its the wrong length, abort frame
        Homelab::Logger::errorf("'%s' encountered a standard frame frame with incorrect length", this->getId().c_str());
        this->frameStarted = false;
        this->frameEndPointer = this->frameStartPointer;
        return false;
    }

    return (
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 3)] == this->CONFIG_FRAME_FOOTER[0] &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 2)] == this->CONFIG_FRAME_FOOTER[1] &&
        this->buffer[Homelab::number::circularSubtract(this->bufferPointer, 1)] == this->CONFIG_FRAME_FOOTER[2] &&
        this->buffer[this->bufferPointer] == this->CONFIG_FRAME_FOOTER[3]);
}

void Homelab::Sensors::LD2410S::handleRawFrame()
{
    if (this->buffer[this->frameStartPointer] == this->SHORT_FRAME_HEADER)
        this->handleRawShortFrame();
    else if (this->buffer[this->frameStartPointer] == this->STANDARD_FRAME_HEADER[0])
        this->handleRawStandardFrame();
    else if (this->buffer[this->frameStartPointer] == this->CONFIG_FRAME_HEADER[0])
        this->handleRawConfigFrame();
    else
        this->printRawFrame();

    this->frameEndPointer = this->frameStartPointer;
}

void Homelab::Sensors::LD2410S::handleRawShortFrame()
{
    this->frameBuffer.push_back({.type = LD2410SFrameType_t::SHORT,
                                 .command = LD2410SFrameCommand_t::NONE,
                                 .length = 4,
                                 .data = {
                                     this->buffer[Homelab::number::circularAdd(this->frameStartPointer, 1)],
                                     this->buffer[Homelab::number::circularAdd(this->frameStartPointer, 2)],
                                     this->buffer[Homelab::number::circularAdd(this->frameStartPointer, 3)]}});
}

void Homelab::Sensors::LD2410S::handleRawStandardFrame()
{
    LD2410SFrame_t frame = {.type = LD2410SFrameType_t::STANDARD,
                            .command = LD2410SFrameCommand_t::NONE,
                            .length = 0,
                            .data = {}};

    uint8_t i;

    for (
        i = 4;
        Homelab::number::circularAdd(this->frameStartPointer, i) < Homelab::number::circularSubtract(this->frameEndPointer, 3);
        i++)
    {
        frame.data[frame.length] = this->buffer[Homelab::number::circularAdd(this->frameStartPointer, i)];
        frame.length += 1;
    }

    this->frameBuffer.push_back(frame);
}

void Homelab::Sensors::LD2410S::handleRawConfigFrame()
{
    LD2410SFrame_t frame = {.type = LD2410SFrameType_t::CONFIG,
                            .command = this->intToCommand(this->buffer[Homelab::number::circularAdd(this->frameStartPointer, 6)]),
                            .length = 0,
                            .data = {}};

    uint8_t i;

    if (frame.command == LD2410SFrameCommand_t::FIRMWARE || frame.command == LD2410SFrameCommand_t::SERIAL_NUMBER)
    {
        this->printRawFrame();
    }

    for (
        i = 4;
        Homelab::number::circularAdd(this->frameStartPointer, i) < Homelab::number::circularSubtract(this->frameEndPointer, 3);
        i++)
    {
        frame.data[frame.length] = this->buffer[Homelab::number::circularAdd(this->frameStartPointer, i)];
        frame.length += 1;
    }

    this->frameBuffer.push_back(frame);
}

Homelab::Sensors::LD2410SFrame_t Homelab::Sensors::LD2410S::getFrame(unsigned long timeout)
{
    unsigned long start = millis();

    do
        this->read();
    while (!this->frameBuffer.size() && millis() - start < timeout);

    if (this->frameBuffer.size())
    {
        LD2410SFrame_t frame = this->frameBuffer[0];
        this->handleFrame(frame);
        this->frameBuffer.pop_front();
        return frame;
    }

    return {.type = LD2410SFrameType_t::EMPTY,
            .command = LD2410SFrameCommand_t::UNKNOWN,
            .length = 0,
            .data = {}};
}

void Homelab::Sensors::LD2410S::flushFrameBuffer()
{
    while (this->frameBuffer.size())
    {
        LD2410SFrame_t frame = this->frameBuffer[0];
        this->handleFrame(frame);
        this->frameBuffer.pop_front();
    }
}

void Homelab::Sensors::LD2410S::handleFrame(LD2410SFrame_t frame)
{
    switch (frame.type)
    {
    case LD2410SFrameType_t::SHORT:
        this->handleShortFrame(frame);
        break;
    case LD2410SFrameType_t::STANDARD:
        this->handleStandardFrame(frame);
        break;
    case LD2410SFrameType_t::CONFIG:
        this->handleConfigFrame(frame);
        break;
    default:
        break;
    }
};

void Homelab::Sensors::LD2410S::handleShortFrame(LD2410SFrame_t frame)
{
    if (millis() - this->lastShortFrame > this->shortFrameDebounce)
    {
        bool _presence = frame.data[0] > 1;
        uint16_t _distanceCm = this->bytesToInt(frame.data[1], frame.data[2]);
        float _distance = _distanceCm / 100.0;

        if (!this->presence.has_value() || _presence != this->presence.value())
        {
            if (!this->presence.has_value())
                Homelab::Logger::infof("Presence changed from null to %s\n", _presence ? "true" : "false");
            else
                Homelab::Logger::infof("Presence changed from %s to %s\n", this->presence.value() ? "true" : "false", _presence ? "true" : "false");

            this->presence = _presence;
            this->callPresenceChangeCallbacks();
        }
        if (!this->distance.has_value() || abs(_distance - this->distance.value()) > this->distanceTolerance)
        {
            if (!this->distance.has_value())
                Homelab::Logger::infof("Distance changed from null to %.2fm\n", _distance);
            else
                Homelab::Logger::infof("Distance changed from %.2fm to %.2fm\n", this->distance.value(), _distance);

            this->distance = _distance;
            this->callDistanceChangeCallbacks();
        }

        this->lastShortFrame = millis();
    }
};

void Homelab::Sensors::LD2410S::handleStandardFrame(LD2410SFrame_t frame)
{
    this->printFrame(frame);
};

void Homelab::Sensors::LD2410S::handleConfigFrame(LD2410SFrame_t frame)
{
    this->printFrame(frame);
};

Homelab::Sensors::LD2410SFrame_t Homelab::Sensors::LD2410S::waitForFrame(LD2410SFrameCommand_t command, unsigned long timeout)
{
    unsigned long start = millis();

    while (millis() - start < timeout)
    {
        LD2410SFrame_t frame = this->getFrame();

        if (frame.command == command)
            return frame;
    }

    return {.type = LD2410SFrameType_t::EMPTY,
            .command = LD2410SFrameCommand_t::UNKNOWN,
            .length = 0,
            .data = {}};
};

void Homelab::Sensors::LD2410S::sendCommandHeader()
{
    for (uint8_t byte : this->CONFIG_FRAME_HEADER)
    {
        this->sensorSerial->write(byte);
    }
};

void Homelab::Sensors::LD2410S::sendCommandFooter()
{
    for (uint8_t byte : this->CONFIG_FRAME_FOOTER)
    {
        this->sensorSerial->write(byte);
    }
};

bool Homelab::Sensors::LD2410S::enterConfigurationMode(unsigned long timeout)
{
    this->sendCommandHeader();
    this->sensorSerial->write(0x04);
    this->sensorSerial->write(0x00);
    this->sensorSerial->write(LD2410SFrameCommand_t::ENTER_CONFIG_MODE);
    this->sensorSerial->write(0x00);
    this->sensorSerial->write(0x01);
    this->sensorSerial->write(0x00);
    this->sendCommandFooter();

    LD2410SFrame_t frame = this->waitForFrame(LD2410SFrameCommand_t::ENTER_CONFIG_MODE, timeout);

    if (frame.command == LD2410SFrameCommand_t::ENTER_CONFIG_MODE)
        return true;

    Homelab::Logger::errorf("Failed to enter configuration mode on '%s'\n", this->getId().c_str());

    return false;
}

bool Homelab::Sensors::LD2410S::leaveConfigurationMode(unsigned long timeout)
{
    this->sendCommandHeader();
    this->sensorSerial->write(0x04);
    this->sensorSerial->write(0x00);
    this->sensorSerial->write(LD2410SFrameCommand_t::LEAVE_CONFIG_MODE);
    this->sensorSerial->write(0x00);
    this->sensorSerial->write(0x01);
    this->sensorSerial->write(0x00);
    this->sendCommandFooter();

    LD2410SFrame_t frame = this->waitForFrame(LD2410SFrameCommand_t::LEAVE_CONFIG_MODE, timeout);

    if (frame.command == LD2410SFrameCommand_t::LEAVE_CONFIG_MODE)
        return true;

    Homelab::Logger::errorf("Failed to leave configuration mode on '%s'\n", this->getId().c_str());

    return false;
}

void Homelab::Sensors::LD2410S::getFirmwareVersion(unsigned long timeout)
{
    if (!this->enterConfigurationMode())
        return;
    this->sendCommandHeader();
    this->sensorSerial->write(0x02);
    this->sensorSerial->write(0x00);
    this->sensorSerial->write(LD2410SFrameCommand_t::FIRMWARE);
    this->sensorSerial->write(0x00);
    this->sendCommandFooter();

    LD2410SFrame_t frame = this->waitForFrame(LD2410SFrameCommand_t::FIRMWARE, timeout);

    if (frame.command == LD2410SFrameCommand_t::FIRMWARE)
    {
        // Do something
    }

    this->leaveConfigurationMode();
}

void Homelab::Sensors::LD2410S::getSerialNumber(unsigned long timeout)
{
    if (!this->enterConfigurationMode())
        return;
    this->sendCommandHeader();
    this->sensorSerial->write(0x02);
    this->sensorSerial->write(0x00);
    this->sensorSerial->write(LD2410SFrameCommand_t::SERIAL_NUMBER);
    this->sensorSerial->write(0x00);
    this->sendCommandFooter();

    LD2410SFrame_t frame = this->waitForFrame(LD2410SFrameCommand_t::SERIAL_NUMBER, timeout);

    if (frame.command == LD2410SFrameCommand_t::SERIAL_NUMBER)
    {
        // Do something
    }

    this->leaveConfigurationMode();
}

void Homelab::Sensors::LD2410S::printRawFrame()
{
    char buff[256] = "";

    uint8_t i;
    for (
        i = this->frameStartPointer;
        i != Homelab::number::circularAdd(this->frameEndPointer);
        i = Homelab::number::circularAdd(i))
        sprintf(buff + strlen(buff), "%02x ", this->buffer[i]);

    Homelab::Logger::debugf("Raw Frame Received: %03d -> %03d > %s\n", this->frameStartPointer, this->frameEndPointer, buff);
}

void Homelab::Sensors::LD2410S::printFrame(LD2410SFrame_t frame)
{
    char buff[256] = "";

    for (uint8_t i = 0; i < frame.length; i++)
        sprintf(buff + strlen(buff), "%02x ", frame.data[i]);

    Homelab::Logger::debugf("Frame Received: Command %02x > Length %02d > %s\n", frame.command, frame.length, buff);
}

uint16_t Homelab::Sensors::LD2410S::bytesToInt(uint8_t byteA, uint8_t byteB)
{
    return byteA | (byteB << 8);
}

Homelab::Sensors::LD2410SFrameCommand_t Homelab::Sensors::LD2410S::intToCommand(uint8_t integer)
{
    switch (integer)
    {
    case Homelab::Sensors::LD2410SFrameCommand_t::FIRMWARE:
        return Homelab::Sensors::LD2410SFrameCommand_t::FIRMWARE;
    case Homelab::Sensors::LD2410SFrameCommand_t::SERIAL_NUMBER:
        return Homelab::Sensors::LD2410SFrameCommand_t::SERIAL_NUMBER;
    case Homelab::Sensors::LD2410SFrameCommand_t::ENTER_CONFIG_MODE:
        return Homelab::Sensors::LD2410SFrameCommand_t::ENTER_CONFIG_MODE;
    case Homelab::Sensors::LD2410SFrameCommand_t::LEAVE_CONFIG_MODE:
        return Homelab::Sensors::LD2410SFrameCommand_t::LEAVE_CONFIG_MODE;
    default:
        return Homelab::Sensors::LD2410SFrameCommand_t::UNKNOWN;
    }
};

void Homelab::Sensors::LD2410S::addPresenceChangeCallback(std::string name, LD2410SPresenceChangeCallback_t callback)
{
    this->presenceChangeCallbacks[name] = callback;
};
void Homelab::Sensors::LD2410S::addDistanceChangeCallback(std::string name, LD2410SDistanceChangeCallback_t callback)
{
    this->distanceChangeCallbacks[name] = callback;
};

void Homelab::Sensors::LD2410S::deletePresenceChangeCallback(std::string name)
{
    this->presenceChangeCallbacks.erase(name);
};
void Homelab::Sensors::LD2410S::deleteDistanceChangeCallback(std::string name)
{
    this->distanceChangeCallbacks.erase(name);
};

void Homelab::Sensors::LD2410S::callPresenceChangeCallbacks()
{
    for (auto const &keyValuePair : this->presenceChangeCallbacks)
    {
        Homelab::Sensors::LD2410SPresenceChangeCallback_t callback = keyValuePair.second;
        callback(this->presence);
    }
};
void Homelab::Sensors::LD2410S::callDistanceChangeCallbacks()
{
    for (auto const &keyValuePair : this->distanceChangeCallbacks)
    {
        Homelab::Sensors::LD2410SDistanceChangeCallback_t callback = keyValuePair.second;
        callback(this->distance);
    }
};

std::string Homelab::Sensors::LD2410S::getId()
{
    char buff[32];
    sprintf(buff, "%d,%d", this->rx, this->tx);

    return (std::string)buff + "/" + this->id;
}

void Homelab::Sensors::LD2410S::getJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    if (this->presence.has_value())
    {
        json["presence"] = this->presence.value();
    }
    else
    {
        json["presence"] = "null";
    }

    if (this->distance.has_value())
    {
        json["distance"] = this->distance.value();
    }
    else
    {
        json["distance"] = "null";
    }

    json["id"] = this->getId();
    json["type"] = "ld2410s";

    JsonArray _pins = json.createNestedArray("pins");
    _pins.add(this->rx);
    _pins.add(this->tx);
};

void Homelab::Sensors::LD2410S::getJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId()].to<JsonObject>();
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read values of ld2410 sensor (TX " + std::to_string(this->tx) + ", RX " + std::to_string(this->rx) + ")";
    JsonArray produces = get["produces"].to<JsonArray>();
    produces.add("application/json");
    JsonObject responses = get["responses"].to<JsonObject>();
    JsonObject _200 = responses["200"].to<JsonObject>();
    JsonObject content = _200["content"].to<JsonObject>();
    JsonObject applicationJson = content["application/json"].to<JsonObject>();
    JsonObject schema = applicationJson["schema"].to<JsonObject>();
    schema["type"] = "object";
    JsonObject properties = schema["properties"].to<JsonObject>();

    JsonObject id = properties["id"].to<JsonObject>();
    id["type"] = "string";
    id["const"] = this->getId();
    JsonObject type = properties["type"].to<JsonObject>();
    type["type"] = "string";
    type["const"] = "ld2410s";
    JsonObject tx = properties["tx"].to<JsonObject>();
    tx["type"] = "integer";
    tx["const"] = this->tx;
    JsonObject rx = properties["rx"].to<JsonObject>();
    rx["type"] = "integer";
    rx["const"] = this->rx;
    JsonObject distance = properties["distance"].to<JsonObject>();
    distance["type"] = "number";
    distance["example"] = 1.02;
    JsonObject presence = properties["presence"].to<JsonObject>();
    presence["type"] = "boolean";
}

void Homelab::Sensors::LD2410S::getConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    json["id"] = this->getId();
    json["tx"] = this->tx;
    json["rx"] = this->rx;

    json["distanceTolerance"] = this->distanceTolerance;
}

void Homelab::Sensors::LD2410S::getConfigureJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId() + "/config"].to<JsonObject>();

    // ---- GET ----
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read config of ld2410 sensor (TX " + std::to_string(this->tx) + ", RX " + std::to_string(this->rx) + ")";
    JsonArray produces = get["produces"].to<JsonArray>();
    produces.add("application/json");
    JsonObject responses = get["responses"].to<JsonObject>();
    JsonObject _200 = responses["200"].to<JsonObject>();
    JsonObject content = _200["content"].to<JsonObject>();
    JsonObject applicationJson = content["application/json"].to<JsonObject>();
    JsonObject schema = applicationJson["schema"].to<JsonObject>();
    schema["type"] = "object";
    JsonObject properties = schema["properties"].to<JsonObject>();

    JsonObject id = properties["id"].to<JsonObject>();
    id["type"] = "string";
    id["const"] = this->getId();
    JsonObject tx = properties["tx"].to<JsonObject>();
    tx["type"] = "integer";
    tx["const"] = this->tx;
    JsonObject rx = properties["rx"].to<JsonObject>();
    rx["type"] = "integer";
    rx["const"] = this->rx;
    JsonObject distanceTolerance = properties["distanceTolerance"].to<JsonObject>();
    distanceTolerance["type"] = "number";
    distanceTolerance["example"] = 0.15;

    // ---- POST ----
    JsonObject post = path["post"].to<JsonObject>();
    post["summary"] = "Update config of ld2410 sensor (TX " + std::to_string(this->tx) + ", RX " + std::to_string(this->rx) + ")";
    JsonArray postProduces = post["produces"].to<JsonArray>();
    postProduces.add("application/json");
    JsonObject postResponses = post["responses"].to<JsonObject>();
    JsonObject post200 = postResponses["200"].to<JsonObject>();

    JsonObject postRequestBody = post["requestBody"].to<JsonObject>();
    JsonObject postContent = postRequestBody["content"].to<JsonObject>();
    JsonObject postJson = postContent["application/json"].to<JsonObject>();
    JsonObject postSchema = postJson["schema"].to<JsonObject>();
    postSchema["type"] = "object";
    JsonObject postParameters = postSchema["properties"].to<JsonObject>();
    JsonObject postDistanceTolerance = postParameters["distanceTolerance"].to<JsonObject>();
    postDistanceTolerance["in"] = "body";
    postDistanceTolerance["type"] = "number";
    postDistanceTolerance["example"] = 0.15;
}

void Homelab::Sensors::LD2410S::receiveConfigureJsonValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    float _distanceTolerance = json["distanceTolerance"];

    if (json["distanceTolerance"].is<float>() && _distanceTolerance)
    {
        float _distanceTolerance = json["distanceTolerance"];
        this->setDistanceTolerance(_distanceTolerance);
    }
}