import type { DayOfWeek } from '../../../types';
interface GetWeekdaysNamesInput {
    locale: string;
    format?: string;
    firstDayOfWeek?: DayOfWeek;
}
export declare function getWeekdayNames({ locale, format, firstDayOfWeek, }: GetWeekdaysNamesInput): string[];
export {};
//# sourceMappingURL=get-weekdays-names.d.ts.map