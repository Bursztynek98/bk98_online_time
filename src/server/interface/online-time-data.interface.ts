export interface IOnlineTimeData {
  name: string;
  saveTime: (type: string, identifier: string, time: number) => void;
  getTime: (type: string, identifier: string) => Promise<number>;
  autoSaveInterval?: number;
}
