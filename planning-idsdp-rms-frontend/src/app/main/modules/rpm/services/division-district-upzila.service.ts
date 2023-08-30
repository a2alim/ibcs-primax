import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DivisionDistrictUpzilaService {

  constructor(private http: HttpClient) { 

  }

  public getDivision(): Observable<any> {
    return this.http.get("./assets/jsonFiles/divisions.json");
  }

  public getDistrictsList(): Observable<any> {   
    return this.http.get("./assets/jsonFiles/districts.json");
  }

  public getUpazilaList(): Observable<any> {
    return this.http.get("./assets/jsonFiles/upazilas.json");
  }

  public getBankNameList(): Observable<any> {
    return this.http.get("./assets/jsonFiles/bank-name-list.json");
  }

}
