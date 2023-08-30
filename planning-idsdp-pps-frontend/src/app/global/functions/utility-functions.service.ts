import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityFunctionsService {

  constructor() { }

  numberWithComma(x) {
    //console.log('x', x)
    
    if(x>0){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".00";
    }
    else{
      return 0.00;
    }
    
  }
}
