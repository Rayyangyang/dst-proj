/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}

enum FormatEnums {
  year = 'YYYY',
  month = 'YYYY-MM',
  day = 'YYYY-MM-DD',
  hour = 'YYYY-MM-DD HH',
  minutes = 'YYYY-MM-DD HH:mm',
  second = 'YYYY-MM-DD HH:mm:ss',
}

// 时间戳转换日期
export function stampToDate(timestamp: number, type: string): string {
  const timeStampLen: number = timestamp.toString().length;
  const _timeStamp: number = timeStampLen === 13 ? timestamp / 1000 : timestamp; // 处理ms -> s

  const formatType = FormatEnums[`${type}`];
  return timestamp ? dayjs.unix(_timeStamp).format(formatType || 'YYYY-MM-DD') : '';
}

export const dateUtil = dayjs;
