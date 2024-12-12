/** @format */
import { getDeviceEmoji } from '@/common/emojis';

export class Device {
  mac: string;
  ip: string;

  sourceIds: string[] = [];
  sources: { [id: string]: Record<string, any> } = {};

  lastContact?: string;

  constructor(mac: string, ip: string) {
    this.mac = mac;
    this.ip = ip;

    this.getSources();
  }

  getSourceIds = async () =>
    fetch(`http://${this.ip}/sources`)
      .then((response) => response.json())
      .then((sourceIds) => {
        this.updateLastContact();
        if (Array.isArray(sourceIds)) {
          this.sourceIds = sourceIds;
        } else if (Object.keys(sourceIds).length) {
          this.sourceIds = Object.keys(sourceIds);
        } else {
          console.error(`[device] ${this.ip} ${getDeviceEmoji(this.ip)}: Failed to get source ids`);
        }
      })
      .catch(() =>
        console.error(`[device] ${this.ip} ${getDeviceEmoji(this.ip)}: Failed to get source ids`)
      );

  getSources = async () => {
    await this.getSourceIds();

    for (const sourceId of this.sourceIds) {
      await fetch(`http://${this.ip}/${sourceId}`)
        .then((response) => response.json())
        .then((value) => this.updateSourceValue(sourceId, value))
        .catch(() =>
          console.error(
            `[device] ${this.ip} ${getDeviceEmoji(this.ip)}: Failed to get source '${sourceId}'`
          )
        );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  updateSourceValue = (sourceId: string, value: Record<string, any>) => {
    this.updateLastContact();
    this.sources[sourceId] = value;
  };

  updateLastContact = () => {
    this.lastContact = new Date().toISOString();
  };
}
