import { type IOnlineTimeData } from 'interface/online-time-data.interface';
import { OnlineTime } from 'online-time';

exports('onlineTime', (data: IOnlineTimeData) => {
  return new OnlineTime(data);
});
