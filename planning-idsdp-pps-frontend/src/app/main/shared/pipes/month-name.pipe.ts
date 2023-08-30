import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'monthName', pure: false })
export class MonthNamePipe implements PipeTransform {
  MONTHS = [
    { value: 1, nameBn: 'জানুয়ারী', nameEn: 'January'},
    { value: 2, nameBn: 'ফেব্রুয়ারী', nameEn: 'February'},
    { value: 3, nameBn: 'মার্চ', nameEn: 'March'},
    { value: 4, nameBn: 'এপ্রিল', nameEn: 'April'},
    { value: 5, nameBn: 'মে', nameEn: 'May'},
    { value: 6, nameBn: 'জুন', nameEn: 'June'},
    { value: 7, nameBn: 'জুলাই', nameEn: 'July'},
    { value: 8, nameBn: 'আগস্ট', nameEn: 'August'},
    { value: 9, nameBn: 'সেপ্টেম্বর', nameEn: 'September'},
    {  value: 10, nameBn: 'অক্টোবর', nameEn: 'October'},
    {  value: 11, nameBn: 'নভেম্বর ', nameEn: 'November'},
    {  value: 12, nameBn: 'ডিসেম্বর', nameEn: 'December'}
  ];

  public transform(monthValue: number, isBengali: boolean = false): any {
    if (monthValue === null) {
      return '';
    }
    const obj = this.getMonthName(monthValue, isBengali);
    return obj;
  }

  getMonthName(monthValue: number, isBengali?: boolean) {
    return this.MONTHS.filter(m => m.value === monthValue)[0][isBengali ? 'nameBn' : 'nameEn'];
  }
}
