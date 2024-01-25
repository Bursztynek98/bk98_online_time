import { type StoreTimeFunction } from 'enum/store-time-function.enum';

export interface IOnlineTimeData {
  name: string;
  storeTimeFunction: StoreTimeFunction;
  saveTime?: (type: string, identifier: string, time: number) => Promise<void>;
  getTime?: (type: string, identifier: string) => Promise<number>;
  autoSaveInterval?: number;
}
