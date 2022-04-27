import { utcToZonedTime, format } from 'date-fns-tz';

const timeZone = "Asia/Bangkok";

export function utcToThailandDateString(date: Date): string {
  const zonedDate = utcToZonedTime(date, timeZone);
  const pattern = 'd.M.yyyy HH:mm:ss.SSS \'GMT\' XXX (z)'
  const output = format(zonedDate, pattern, { timeZone })
  return output;
}
