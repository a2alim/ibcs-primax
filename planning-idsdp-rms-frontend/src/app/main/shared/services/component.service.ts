import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedUrlConstant } from '../constant/shared-url.constant';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private _http: HttpClient) { }


  getAllComponents():Observable<any>{
    return this._http.get(SharedUrlConstant.COMPONENT_ENDPOINT);
  }

  getAllModules():Observable<any>{
    return this._http.get(SharedUrlConstant.MODULES_ENDPOINT);
  }

  getAllModuleByComponent(cm_id):Observable<any>{
    return this._http.get(SharedUrlConstant.MODULES_ENDPOINT+cm_id);
  }
  getAllSubModuleByModule(m_id):Observable<any>{
    return this._http.get(SharedUrlConstant.SUBMODULE_ENDPOINT+m_id);
  }
  

}
