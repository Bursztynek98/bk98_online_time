import { StoreTimeFunction } from 'enum/store-time-function.enum';
import { type IOnlineTimeData } from 'interface/online-time-data.interface';
import { type IPlayersTime } from 'interface/players-time.interface';
import { oxMysqlSaveTime, oxMysqlGetTime } from './ox-mysql-integration';

export class OnlineTime {
  private readonly name: string;
  private readonly playersTime = new Map<string, IPlayersTime>();
  private readonly saveTime: Required<IOnlineTimeData>['saveTime'];
  private readonly getTime: Required<IOnlineTimeData>['getTime'];

  constructor(data: IOnlineTimeData) {
    if (typeof data?.name !== 'string') {
      throw new Error('name is required');
    }
    this.name = data.name;

    switch (data.storeTimeFunction) {
      case StoreTimeFunction.standalone:
        if (typeof data?.saveTime !== 'function') {
          throw new Error('saveTime function is required');
        }
        if (typeof data?.getTime !== 'function') {
          throw new Error('saveTime function is required');
        }
        this.saveTime = data.saveTime;
        this.getTime = data.getTime;
        break;
      case StoreTimeFunction.oxmysql:
        this.saveTime = oxMysqlSaveTime;
        this.getTime = oxMysqlGetTime;
        break;
      default:
        throw new Error(
          `storeTimeFunction type is required (${Object.keys(
            StoreTimeFunction,
          ).join(', ')})`,
        );
    }
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
    )
      .then()
      .catch((error) => {
        throw error;
      });
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
