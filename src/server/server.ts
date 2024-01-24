import { type IOnlineTimeData } from 'interface/online-time-data.interface';
import { OnlineTime } from 'online-time';

exports('onlineTime', (data: IOnlineTimeData) => {
  if (typeof data?.getTime !== 'function') {
    throw new Error('getTime function is required');
  }
  if (typeof data?.saveTime !== 'function') {
    throw new Error('saveTime function is required');
  }
  if (typeof data?.name !== 'string') {
    throw new Error('name is required');
  }

  return new OnlineTime(data);
});
