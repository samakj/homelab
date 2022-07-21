#include "Switch.h"

Homelab::Sensors::Switch::Switch(uint8_t _pinNo, uint8_t _outPin, bool _defaultState)
    : pinNo(_pinNo), outPin(_outPin), state(_defaultState) {};

void Homelab::Sensors::Switch::addSwitchCallback(Homelab::Sensors::Switch::SwitchCallback callback)
{
  this->switchCallbacks.push_back(callback);
};

void Homelab::Sensors::Switch::setup()
{
  pinMode(this->pinNo, INPUT_PULLUP);
  if(this->outPin >= 0) pinMode(this->outPin, OUTPUT);
  Homelab::Logger::infof("Switch sensor initialised on pin %d\n", this->pinNo);
};

void Homelab::Sensors::Switch::loop()
{
  bool _state = digitalRead(this->pinNo);
  if(_state != this->state)
  {
    Homelab::Logger::debugf(
        "Switch state changes from %s to %s\n", this->state ? "ON" : "OFF", _state ? "ON" : "OFF"
    );
    this->state = _state;
    for(Homelab::Sensors::Switch::SwitchCallback callback : this->switchCallbacks)
      callback(this->state);
  }
};