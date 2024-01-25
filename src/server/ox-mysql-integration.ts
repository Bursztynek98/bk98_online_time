import { oxmysql } from '@overextended/oxmysql';

export async function oxMysqlSaveTime(
  type: string,
  identifier: string,
  time: number,
): Promise<void> {
  await oxmysql.insert(
    'INSERT INTO onlineTime (type, identifier, time) VALUES (@type, @identifier, @time) ON DUPLICATE KEY UPDATE time=@time',
    {
      type,
      identifier,
      time,
    },
  );
}

export async function oxMysqlGetTime(
  type: string,
  identifier: string,
): Promise<number> {
  const data = await oxmysql.scalar<number | undefined>(
    'SELECT time FROM onlineTime WHERE identifier = @identifier AND type = @type LIMIT 1',
    {
      identifier,
      type,
    },
  );
  return data ?? 0;
}
