import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalValidationService {

  constructor() { }

  formValidation(validationEntityList){
    console.log('validationEntityList = ', validationEntityList);
  }
}
