import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {LinkagesAndTargetSdgsModel} from '../models/linkages-and-target-sdgs.model';
import {LINKAGETARGET} from '../constants/linkages-and-target.constant';
import {map} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinkagesAndTargetService extends CrudRequestService<LinkagesAndTargetSdgsModel>  {

    constructor(private http: HttpClient) {
        super(http, LINKAGETARGET);
    }

    //For create linkage and target api call
    createLinkageAndTarget(linkageTargetSdgs: any, linkageTargetFiveYear: any, linkageTargetPerspectivePlan: any, linkageTargetDeltaPlan: any, linkageTargetClimate: any, linkageTargetPoverty: any, linkageTargetGender: any, projectConceptMasterId: any): any {
        const data = {
            linkageTargetSdgs: linkageTargetSdgs,
            linkageTargetFiveYear: linkageTargetFiveYear,
            linkageTargetPerspectivePlan: linkageTargetPerspectivePlan,
            linkageTargetDeltaPlan: linkageTargetDeltaPlan,
            linkageTargetClimate: linkageTargetClimate,
            linkageTargetPoverty: linkageTargetPoverty,
            linkageTargetGender: linkageTargetGender,
        };
        // console.log(linkageTargetSdgs + 'called');
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'pcLinkageTarget/create' + '/' + projectConceptMasterId;
        return this.http.post(url, data, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }

    //For get linkage and target api call
    getLinkageAndTargetListByProject(projectConceptMasterId: any): any {
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'pcLinkageTarget/getLinkageAndTargetListByProject' + '/' + projectConceptMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    //For update linkage and target api call
    updateLinkageAndTarget(linkageTargetSdgs: any, linkageTargetFiveYear: any, linkageTargetPerspectivePlan: any, linkageTargetDeltaPlan: any, linkageTargetClimate: any, linkageTargetPoverty: any, linkageTargetGender: any, projectConceptMasterId: any) {
        const data = {
            linkageTargetSdgs: linkageTargetSdgs,
            linkageTargetFiveYear: linkageTargetFiveYear,
            linkageTargetPerspectivePlan: linkageTargetPerspectivePlan,
            linkageTargetDeltaPlan: linkageTargetDeltaPlan,
            linkageTargetClimate: linkageTargetClimate,
            linkageTargetPoverty: linkageTargetPoverty,
            linkageTargetGender: linkageTargetGender,
        };
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'pcLinkageTarget/update' + '/' + projectConceptMasterId;
        return this.http.put(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    //For delete linkage and target api call
    deleteLinkageAndTarget(uuid: any){
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'pcLinkageTarget/delete' + '/' + uuid;
        return this.http.delete(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
