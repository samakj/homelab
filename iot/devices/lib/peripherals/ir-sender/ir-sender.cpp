#include "ir-sender.h"
#include <IRremote.hpp>

Homelab::Peripherals::IRSender::IRSender(uint8_t _pinNo, std::string _id) : pinNo(_pinNo), id(_id)
{
    std::string id = this->getId();

    Homelab::Server->addSource(
        id,
        [this](JsonVariant &json)
        { return Homelab::Peripherals::IRSender::getJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Peripherals::IRSender::getJsonSchemaValue(json); });
    Homelab::Server->addSource(
        id + "/config",
        [this](JsonVariant &json)
        { return Homelab::Peripherals::IRSender::getConfigureJsonValue(json); },
        [this](JsonVariant &json)
        { return Homelab::Peripherals::IRSender::getConfigureJsonSchemaValue(json); });
    Homelab::Server->addSink(
        id,
        [this](JsonVariant &json)
        { return Homelab::Peripherals::IRSender::receiveJsonValue(json); });
}

void Homelab::Peripherals::IRSender::begin()
{
    IrSender.begin(this->pinNo);
}

void Homelab::Peripherals::IRSender::sendNEC(uint16_t address, uint16_t command, uint8_t repeats, bool report)
{
    IrSender.sendNEC(address, command, 1);

    if (report)
    {
        JsonDocument json;
        json["id"] = this->getId();
        json["pin"] = this->pinNo;
        json["type"] = "ir-send";
        json["address"] = address;
        json["command"] = command;
        json["repeats"] = repeats;

        Logger::infof("Sending NEC IR command: address=0x%x, command=0x%x, repeats=%d\n", address, command, repeats);
    }
}

void Homelab::Peripherals::IRSender::sendTVCommand(TV::Command command, bool longPress)
{
    uint8_t repeats = longPress ? 5 : 0;
    IrSender.sendNEC(TV::ADDRESS, command, repeats);

    JsonDocument json;
    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["type"] = "ir-send";
    json["address"] = TV::ADDRESS;
    json["command"] = command;
    json["repeats"] = repeats;
    json["source"] = "tv";
    json["commandString"] = this->serialiseTVCommand(command);

    Logger::infof("Sending TV IR command: command=%s, address=0x%x, command=0x%x, repeats=%d\n", this->serialiseTVCommand(command).c_str(), TV::ADDRESS, command, repeats);
}

std::string Homelab::Peripherals::IRSender::serialiseTVCommand(TV::Command command)
{
    switch (command)
    {
    case (TV::Command::POWER):
        return "power";
    case (TV::Command::UP):
        return "up";
    case (TV::Command::DOWN):
        return "down";
    case (TV::Command::LEFT):
        return "left";
    case (TV::Command::RIGHT):
        return "right";
    case (TV::Command::OK):
        return "ok";
    case (TV::Command::_0):
        return "0";
    case (TV::Command::_1):
        return "1";
    case (TV::Command::_2):
        return "2";
    case (TV::Command::_3):
        return "3";
    case (TV::Command::_4):
        return "4";
    case (TV::Command::_5):
        return "5";
    case (TV::Command::_6):
        return "6";
    case (TV::Command::_7):
        return "7";
    case (TV::Command::_8):
        return "8";
    case (TV::Command::_9):
        return "9";
    case (TV::Command::GUIDE):
        return "guide";
    case (TV::Command::MUTE):
        return "mute";
    case (TV::Command::HOME):
        return "home";
    case (TV::Command::SOURCE):
        return "source";
    case (TV::Command::BACK):
        return "back";
    case (TV::Command::SETTINGS):
        return "settings";
    case (TV::Command::RED_BUTTON):
        return "red-button";
    case (TV::Command::GREEN_BUTTON):
        return "green-button";
    case (TV::Command::YELLOW_BUTTON):
        return "yellow-button";
    case (TV::Command::BLUE_BUTTON):
        return "blue-button";
    case (TV::Command::NETFLIX):
        return "netflix";
    case (TV::Command::PRIME):
        return "prime";
    case (TV::Command::DISNEY):
        return "disney";
    case (TV::Command::RAKTUKEN):
        return "raktuken";
    case (TV::Command::LG_CHANNELS):
        return "lg-channels";

    default:
        return "unknown";
    }
}

Homelab::Peripherals::TV::Command Homelab::Peripherals::IRSender::deserialiseTVCommand(std::string command)
{
    if (command == "power")
        return TV::Command::POWER;
    if (command == "up")
        return TV::Command::UP;
    if (command == "down")
        return TV::Command::DOWN;
    if (command == "left")
        return TV::Command::LEFT;
    if (command == "right")
        return TV::Command::RIGHT;
    if (command == "ok")
        return TV::Command::OK;
    if (command == "0")
        return TV::Command::_0;
    if (command == "1")
        return TV::Command::_1;
    if (command == "2")
        return TV::Command::_2;
    if (command == "3")
        return TV::Command::_3;
    if (command == "4")
        return TV::Command::_4;
    if (command == "5")
        return TV::Command::_5;
    if (command == "6")
        return TV::Command::_6;
    if (command == "7")
        return TV::Command::_7;
    if (command == "8")
        return TV::Command::_8;
    if (command == "9")
        return TV::Command::_9;
    if (command == "guide")
        return TV::Command::GUIDE;
    if (command == "mute")
        return TV::Command::MUTE;
    if (command == "home")
        return TV::Command::HOME;
    if (command == "source")
        return TV::Command::SOURCE;
    if (command == "back")
        return TV::Command::BACK;
    if (command == "settings")
        return TV::Command::SETTINGS;
    if (command == "red-button")
        return TV::Command::RED_BUTTON;
    if (command == "green-button")
        return TV::Command::GREEN_BUTTON;
    if (command == "yellow-button")
        return TV::Command::YELLOW_BUTTON;
    if (command == "blue-button")
        return TV::Command::BLUE_BUTTON;
    if (command == "netflix")
        return TV::Command::NETFLIX;
    if (command == "prime")
        return TV::Command::PRIME;
    if (command == "disney")
        return TV::Command::DISNEY;
    if (command == "raktuken")
        return TV::Command::RAKTUKEN;
    if (command == "lg-channels")
        return TV::Command::LG_CHANNELS;

    return TV::Command::UNKNOWN;
}

std::string Homelab::Peripherals::IRSender::getId()
{
    char buff[32];
    sprintf(buff, "%d", this->pinNo);

    return (std::string)buff + "/" + this->id;
}

void Homelab::Peripherals::IRSender::getJsonValue(JsonVariant &_json)
{

    JsonObject json = _json.to<JsonObject>();

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
    json["type"] = "ir-send";
};

void Homelab::Peripherals::IRSender::getJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    // ---- GET ----
    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId()].to<JsonObject>();
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read values of ir sender peripheral (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject pin = properties["pin"].to<JsonObject>();
    pin["type"] = "integer";
    pin["const"] = this->pinNo;
    JsonObject type = properties["type"].to<JsonObject>();
    type["type"] = "string";
    type["const"] = "ir-send";

    // ---- POST ----
    JsonObject post = path["post"].to<JsonObject>();
    post["summary"] = "Update config values of dht sensor (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject postSource = postParameters["source"].to<JsonObject>();
    postSource["in"] = "body";
    JsonArray postSourceEnum = postSource["enum"].to<JsonArray>();
    postSourceEnum.add("tv");
    JsonObject postAction = postParameters["action"].to<JsonObject>();
    postAction["in"] = "body";
    JsonArray postActionEnum = postAction["enum"].to<JsonArray>();
    postActionEnum.add("power");
    postActionEnum.add("up");
    postActionEnum.add("down");
    postActionEnum.add("left");
    postActionEnum.add("right");
    postActionEnum.add("ok");
    postActionEnum.add("0");
    postActionEnum.add("1");
    postActionEnum.add("2");
    postActionEnum.add("3");
    postActionEnum.add("4");
    postActionEnum.add("5");
    postActionEnum.add("6");
    postActionEnum.add("7");
    postActionEnum.add("8");
    postActionEnum.add("9");
    postActionEnum.add("guide");
    postActionEnum.add("mute");
    postActionEnum.add("home");
    postActionEnum.add("source");
    postActionEnum.add("back");
    postActionEnum.add("settings");
    postActionEnum.add("red-button");
    postActionEnum.add("green-button");
    postActionEnum.add("yellow-button");
    postActionEnum.add("blue-button");
    postActionEnum.add("netflix");
    postActionEnum.add("prime");
    postActionEnum.add("disney");
    postActionEnum.add("raktuken");
    postActionEnum.add("lg-channels");
    JsonObject postLongPress = postParameters["longPress"].to<JsonObject>();
    postLongPress["in"] = "body";
    postLongPress["type"] = "boolean";
    JsonObject postAddress = postParameters["address"].to<JsonObject>();
    postAddress["in"] = "body";
    postAddress["type"] = "integer";
    postAddress["example"] = Homelab::Peripherals::TV::ADDRESS;
    JsonObject postCommand = postParameters["command"].to<JsonObject>();
    postCommand["in"] = "body";
    postCommand["type"] = "integer";
    postCommand["example"] = Homelab::Peripherals::TV::Command::POWER;
    JsonObject postRepeats = postParameters["repeats"].to<JsonObject>();
    postRepeats["in"] = "body";
    postRepeats["type"] = "integer";
    postRepeats["example"] = 5;
}

void Homelab::Peripherals::IRSender::getConfigureJsonValue(JsonVariant &_json)
{
    JsonDocument json;

    json["id"] = this->getId();
    json["pin"] = this->pinNo;
}

void Homelab::Peripherals::IRSender::getConfigureJsonSchemaValue(JsonVariant &_json)
{
    JsonObject json = _json.to<JsonObject>();

    JsonObject paths = json["paths"].to<JsonObject>();
    JsonObject path = paths["/" + this->getId() + "/config"].to<JsonObject>();

    // ---- GET ----
    JsonObject get = path["get"].to<JsonObject>();
    get["summary"] = "Read config values of ir sender peripheral (Pin " + std::to_string(this->pinNo) + ")";
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
    JsonObject pin = properties["pin"].to<JsonObject>();
    pin["type"] = "integer";
    pin["const"] = this->pinNo;
}

void Homelab::Peripherals::IRSender::receiveJsonValue(JsonVariant &_json)
{

    JsonDocument json = _json.to<JsonObject>();

    if (json["source"].is<std::string>() && json["action"].is<std::string>())
    {
        std::string source = json["source"];
        std::string action = json["action"];
        bool longPress = json["longPress"];
        TV::Command command = this->deserialiseTVCommand(action);

        if (source == "tv" && command != TV::Command::UNKNOWN)
        {
            this->sendTVCommand(command, longPress);
        }
    }
    else if (json["address"].is<uint16_t>() && json["command"].is<uint16_t>())
    {

        uint16_t address = json["address"];
        uint16_t command = json["command"];
        uint16_t repeats = json["repeats"];

        this->sendNEC(address, command, repeats);
    }
}