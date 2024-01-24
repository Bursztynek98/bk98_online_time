import { type IOnlineTimeData } from 'interface/online-time-data.interface';
import { type IPlayersTime } from 'interface/players-time.interface';

export class OnlineTime {
  private readonly name: string;
  private readonly playersTime = new Map<string, IPlayersTime>();
  private readonly saveTime: (
    type: string,
    identifier: string,
    time: number,
  ) => void;

  private readonly getTime: (
    type: string,
    identifier: string,
  ) => Promise<number>;

  constructor(data: IOnlineTimeData) {
    this.name = data.name;
    this.saveTime = data.saveTime;
    this.getTime = data.getTime;
    this.joinEvent = this.joinEvent.bind(this);
    this.leftEvent = this.leftEvent.bind(this);
    this.getPlayerTime = this.getPlayerTime.bind(this);
    Boolean(data.autoSaveInterval) &&
      setInterval(() => {
        this.autoSave();
      }, data.autoSaveInterval);
  }

  private get currentTime(): number {
    return Math.ceil(new Date().getTime() / 1000);
  }

  private savePlayer(identifier: string, time: IPlayersTime): void {
    this.saveTime(
      this.name,
      identifier,
      time.database + (this.currentTime - time.current),
    );
  }

  private autoSave(): void {
    this.playersTime.forEach((time, identifier) => {
      this.savePlayer(identifier, time);
    });
  }

  public async joinEvent(identifier: string): Promise<void> {
    this.playersTime.set(identifier, {
      current: this.currentTime,
      database: await this.getTime(this.name, identifier),
    });
  }

  public leftEvent(identifier: string): void {
    const time = this.playersTime.get(identifier);
    if (time != null) {
      this.savePlayer(identifier, time);
    }
    this.playersTime.delete(identifier);
  }

  public async getPlayerTime(identifier: string): Promise<number> {
    const time = this.playersTime.get(identifier);
    if (time != null) {
      return time.database + (this.currentTime - time.current);
    }
    return await this.getTime(this.name, identifier);
  }
}
