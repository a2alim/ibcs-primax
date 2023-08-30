import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberPipe', pure: false })
export class NumberPipe implements PipeTransform {
  banglaNumber: string[] = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯',];
  englishNumber: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',];
  // constructor(public commonservice: CommonService) { }
  // constructor() { }
  public transform(numberVal: number, isBengali: boolean = false): any {
    if (numberVal === null) {
      return this.getCommaNumber(0, isBengali);
    }
    const obj = this.getCommaNumber(numberVal, isBengali);
    return obj;
  }
  getCommaNumber(number, type){
    let isNegative = number < 0;
    if (isNegative) number = 0 - number;
    let isFlot = !this.isInt(number);
    let strFloatNumbersplit;
    let numArray;
    if(isFlot){
      let strFloatNumber = number + '';
      strFloatNumbersplit = strFloatNumber.split('.');
      number = parseInt(strFloatNumbersplit[0]);
      numArray = this.getCommaNumberArray(number, type);
    } else {
        numArray = this.getCommaNumberArray(number, type);
    }
    let numberString = '';

    for(let i = 0; i < numArray.length; i++){
      numberString += numArray[i];
     }
    if(isFlot){
      numberString += '.' + this.getBanglaString(strFloatNumbersplit[1]);
    }
    if (isNegative) numberString = '-' + numberString;
   return numberString;
}

isInt(n) {
   return n % 1 === 0;
}

getBanglaString(number){
 let numStr = number + '';
 let numberString = '';

    for(let i = 0; i < numStr.length; i++){
      numberString += this.getBangla(numStr[i]);
     }
    return numberString
}

getCommaNumberArray(number, type){
    let numberArray;

    if(type){
        numberArray = this.getBengaliNumber(number);
    } else {
        numberArray = this.getNumberArray(number);
    }
    let numRevarse = numberArray.reverse();
    let getCommaArray = this.setCommaToArray(numRevarse)
    return getCommaArray.reverse();
}

setCommaToArray(numArray){
    let commaArray = [];
    for(let i = 0; i < numArray.length; i++){
      commaArray.push(numArray[i]);
      if(i === 2 && i !== numArray.length -1){
        commaArray.push(',');
      }
      if(i > 2 && i%2 === 0 && i !== numArray.length - 1){
        commaArray.push(',');
      }

    }
    return commaArray;
}

getNumberArray(number){
 let numberSrt = number + '';
 let numArray = [];
 for(let i = 0; i < numberSrt.length; i++){
  numArray.push(numberSrt[i]);
 }
 return numArray;
}

getBengaliNumber(number){
 let banArray = [];
 let numArray = this.getNumberArray(number);
 for(let i = 0; i < numArray.length; i++){
  let bnNum = this.getBangla(numArray[i]);
  banArray.push(bnNum);
 }
 // let revarseArray = numArray.reverse();
 return banArray;
}

getBangla(number){
    return this.banglaNumber[number]
}

convertToBanglaNumber(value) {
      if(value) {
          const numbers = {
              0: '০',
              1: '১',
              2: '২',
              3: '৩',
              4: '৪',
              5: '৫',
              6: '৬',
              7: '৭',
              8: '৮',
              9: '৯'
          };

          let output = '';
          const input = value.toString();
          for (let i = 0; i < input.length; ++i) {
              if (numbers.hasOwnProperty(input.charAt(i))) {
                  output = output + numbers[input[i]];
              }else{
                  output = output + input.charAt(i);
              }
          }
          return output;
      } else {
          return '০.০০';
      }
    }

    public convertBanglaTimeConvention(value: any){
        if(value == 'AM'){
            let output = '';
            return output = 'এএম';
        }
        else {
            let output = '';
            return output = 'পিএম';
        }
    }
}
