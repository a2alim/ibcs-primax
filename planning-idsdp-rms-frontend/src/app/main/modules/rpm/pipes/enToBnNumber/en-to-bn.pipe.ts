import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enToBn'
})
export class EnToBnPipe implements PipeTransform {

  transform(value:any, lang:any) {    
    if(lang == 'en')
    {
      return value;
    }
    if (value == null || value == "" ) {
      return '০';
    }
    if (value == 'NaN' || value == 'undefined') {
      return value;
    }

    var finalEnlishToBanglaNumber = {
          '0': '০',
          '1': '১',
          '2': '২',
          '3': '৩',
          '4': '৪',
          '5': '৫',
          '6': '৬',
          '7': '৭',
          '8': '৮',
          '9': '৯',
          ':': ':',
          '/': '/',
          '-': '-',
          '.': '.',
          ',': ',',
          ' ':' ',
          'a': "a",
          'm': "m",
          'A': "A",        
          'M': "M",
          "p":"p",
          "P":"P",
          '০':'০',
          '১':'১',
          '২':'২',
          '৩':'৩',
          '৪':'৪',
          '৫':'৫',
          '৬':'৬',
          '৭':'৭',
          '৮':'৮',
          '৯':'৯',
    };
    var str = '' + value;
    var filterVal = str.split("");
    //console.log('filterVal = ', filterVal);
    var retStr = '';
    
    for (var i = 0; i < filterVal.length; i++) {
      var x = filterVal[i];
      retStr = retStr + finalEnlishToBanglaNumber[x];
    }
    return retStr;
  }

}
