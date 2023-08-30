import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Pipe({ name: 'dateBengali', pure: false })
export class DateBengaliPipe implements PipeTransform {
  constructor(public translate: TranslateService) { }
transform(value: string, dateFormat: string): any {
    let lang: string;
    if (!this.translate.currentLang) {
       lang = this.translate.defaultLang;
    } else {
      lang = this.translate.currentLang;
    }
    if (!value) {
      return '';
    }
    if (!dateFormat) { dateFormat = 'YYYY-MMM-DD'; }
    moment.locale(lang);
        const dateLocale = moment.utc(value).local();
        return dateLocale.format(dateFormat);
    }
}
