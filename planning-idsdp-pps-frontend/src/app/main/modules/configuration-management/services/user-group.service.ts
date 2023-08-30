import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {UserGroup} from '../models/user-group.model';
import {GET_ACTIVE_USER_GROUP, USER_GROUP} from '../constants/user-group.constant';
import { map } from 'rxjs/operators';
import {user} from "../../../../mock-api/common/user/data";


@Injectable({
    providedIn: 'root'
})
export class UserGroupService extends CrudRequestService<UserGroup> {

    baseUrl = '';

    constructor(private http: HttpClient) {
        super(http, USER_GROUP);
    }

    // for get ActiveUserGroup
    getActiveUserGroup(page?: number, size?: number): Observable<IResponseBody<UserGroup>> {
        return this.http.get<IResponseBody<UserGroup>>(this._BASE_URL + GET_ACTIVE_USER_GROUP + '/' + page + '/' + size);
    }

    getAllUserByMinistry(ministryId):Observable<any>{
        return this.http.get(this._BASE_URL + 'findByMinistry/'+ministryId);
    }

    getUserByPlanningMinister(planningMinister):Observable<any>{
        return this.http.get(this._BASE_URL + 'findUserByPlanningMinister/'+ planningMinister);
    }

    getUserByNotInPlanningMinister(planningMinister: any):Observable<any>{
        return this.http.get(this._BASE_URL + 'findUserByNotInPlanningMinister/'+ planningMinister);
    }

    getUserByEcnec(ecnec):Observable<any>{
        return this.http.get(this._BASE_URL + 'findUserByEcnec/'+ ecnec);
    }

    getUserByNotInEcnec(ecnec):Observable<any>{
        return this.http.get(this._BASE_URL + 'findUserByNotInEcnec/'+ ecnec);
    }

    removeUserByUserId(id): Observable<any> {
        return this.http.get(this._BASE_URL + 'removeUserByUserId/'+ id);
    }

    getAllUserByAgency(agencyId):Observable<any>{
        return this.http.get(this._BASE_URL + 'findByAgency/'+agencyId);
    }

    getAllUserBySectorDivison(sectorDivisonId):Observable<any>{
        return this.http.get(this._BASE_URL + 'findBySectorDivison/' + sectorDivisonId);
    }

    getNotInAgency(agencyId):Observable<any>{
        return this.http.get(this._BASE_URL + 'findByNotInAgency/'+agencyId);
    }
    getNotInMinistry(ministryId):Observable<any>{
        return this.http.get(this._BASE_URL + 'findByNotInMinistry/'+ministryId);
    }

    getNotInSectorDivison(sectorDivisonId):Observable<any>{
        return this.http.get(this._BASE_URL + 'findByNotInSectorDivison/' + sectorDivisonId);
    }

    createUserGroup(userGroups:UserGroup[]):Observable<any>{
        return this.http.post(this._BASE_URL + 'createUserGroup/', userGroups);
    }

    getUserGroup():Observable<any>{
        return this.http.get(this._BASE_URL + 'getUserGroup').pipe(map((res: any) => {
            return res;
        }));
    }

    getUserListByDesk(userGroupType):Observable<any>{
        return this.http.get(this._BASE_URL + 'getAllByDesk/'+userGroupType);
    }

    getUserGroupByUserId(): Observable<any> {
        return this.http.get(this._BASE_URL + 'getUserGroupByUserId');
    }

    findUserGroupByUserId(userId): Observable<any>{
        return this.http.get(this._BASE_URL + 'findUserGroupByUserId/' + userId);
    }

    geUserInfoByUserId(userId): Observable<any> {
        return this.http.get(this._BASE_URL + 'findByUserId/' + userId);
    }

    getUsersForNotification(model: any): Observable<any> {
        return this.http.post(this._BASE_URL + 'find-user-list-for-notification/', model);
    }

}
