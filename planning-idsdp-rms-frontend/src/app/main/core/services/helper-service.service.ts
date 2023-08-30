import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HelperServiceService {
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

  constructor(
    private toastr: ToastrService,
  ) { }

  isEditable(data:any,activeList:any):boolean{
    let res:any=false;
    for(let i of activeList){
      let cv=i.id;
     
      if(cv===data){
        res=true;
        break;
      }
      }
      if(!res){
        this.toastr.warning("Parent data is disabled", "Uneditable!", this.config);
    }
      return res;
  }
}
