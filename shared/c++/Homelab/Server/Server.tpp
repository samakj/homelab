template <typename T>
void Homelab::Server::sendReport(T value, std::string metric, std::vector<std::string> tags, AsyncWebSocketClient *client)
{
    DynamicJsonDocument data(512);
    Homelab::Server::addMetaInformation(&data);
    data["metric"] = metric;
    data["message"] = value;

    auto tagsArray = data.createNestedArray("tags");
    for (std::string tag : tags)
        tagsArray.add(tag);

    std::string stateKey = Homelab::Server::getStateKey(metric, tags);

    std::string serialisedData = "";
    serializeJson(data, serialisedData);

    state[stateKey] = serialisedData;

    QueuedMessage *queuedMessage = new QueuedMessage;
    queuedMessage->client = client;
    queuedMessage->message = serialisedData;
    Homelab::Server::queuedReports.push_back(queuedMessage);
};