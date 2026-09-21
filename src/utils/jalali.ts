import { toJalaali, toGregorian, isLeapJalaaliYear, jalaaliMonthLength } from 'jalaali-js';

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export function toPersianNumber(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

export function getTodayJalali(): { year: number; month: number; day: number } {
  const today = new Date();
  const j = toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
  return { year: j.jy, month: j.jm, day: j.jd };
}

export function getTodayJalaliString(): string {
  const { year, month, day } = getTodayJalali();
  return `${toPersianNumber(year)}/${toPersianNumber(String(month).padStart(2, '0'))}/${toPersianNumber(String(day).padStart(2, '0'))}`;
}

export function getMonthName(month: number): string {
  return PERSIAN_MONTHS[month - 1];
}

export function getWeekdayName(date: Date): string {
  const day = date.getDay();
  const persianDay = (day + 1) % 7;
  return PERSIAN_WEEKDAYS[persianDay];
}

export function getJalaliMonthDays(year: number, month: number): number {
  return jalaaliMonthLength(year, month);
}

export function getMonthStartWeekday(year: number, month: number): number {
  const gDate = toGregorian(year, month, 1);
  const date = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
  const day = date.getDay();
  return (day + 1) % 7;
}

export function getJalaliCalendarDays(year: number, month: number): (number | null)[] {
  const days: (number | null)[] = [];
  const startWeekday = getMonthStartWeekday(year, month);
  const totalDays = getJalaliMonthDays(year, month);
  
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }
  return days;
}

export function formatDateJalali(dateStr: string): string {
  const date = new Date(dateStr);
  const jalali = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${toPersianNumber(jalali.jd)} ${getMonthName(jalali.jm)} ${toPersianNumber(jalali.jy)}`;
}

export function getPersianDate(): string {
  const { year, month, day } = getTodayJalali();
  return `${toPersianNumber(day)} ${getMonthName(month)} ${toPersianNumber(year)}`;
}

export function isLeapYear(year: number): boolean {
  return isLeapJalaaliYear(year);
}

export { PERSIAN_MONTHS, PERSIAN_WEEKDAYS };
