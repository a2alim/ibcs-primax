import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gateWayBaseEndPoint } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor(private _httpClient: HttpClient) { }

  userListByGroupApi =  gateWayBaseEndPoint + 'api/users/usergroup/';

  getAllUserListByUserGroup(usergroup:string):Observable<any>{
    return this._httpClient.get(this.userListByGroupApi+usergroup);
  }
}
