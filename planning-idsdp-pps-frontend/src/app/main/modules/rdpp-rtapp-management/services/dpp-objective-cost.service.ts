import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {DppObjectiveCostModel} from '../models/dppObjectiveCost.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";
import {RdppRtappModel} from "../models/rdpp-rtapp-model";
import {IResponseBody} from "../../../core/models/response";
import {IProjectConcept} from "../../project-concept-management/models/project-concept";
import {PageableRequestBodyModel} from "../models/pageable-request-body-model";

@Injectable({
    providedIn: 'root'
})
export class DppObjectiveCostService extends CrudRequestService<DppObjectiveCostModel> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/');
    }

    getByProjectConceptUuid(pcUuid): any {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/getByPcuuid' + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getByProjectConceptUuidAndId(pcUuid, id): any {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/get-pcUuid-id' + '/' + pcUuid + '/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }




    getRdppTappDataByPcUuid(pcUuid): any {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/getByPcuuid' + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }


    createObjectiveCost(objectiveCost: any, modeFinanceList: any, currencyModel: any, developmentPartnerModelList: any): any {
        const data = {
            projectTitleEn: objectiveCost.projectTitleEn,
            projectTitleBn: objectiveCost.projectTitleBn,
            ministryDivision: objectiveCost.ministryDivision,
            implementingAgency: objectiveCost.implementingAgency,
            concernedDivisionId: objectiveCost.concernedDivisionId,
            projectConceptUuid: objectiveCost.projectConceptUuid,
            //  developmentPartnerId: objectiveCost.developmentPartnerId,
            objectivesTargets: objectiveCost.objectivesTargets,
            dateCommencement: objectiveCost.dateCommencement,
            dateCompletion: objectiveCost.dateCompletion,
            modeFinanceList: modeFinanceList,
            currencyRateList: currencyModel,
            developmentPartnersList: developmentPartnerModelList,
        };
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/create';
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    createRdppRtapp(objectiveCost: RdppRtappModel): any {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/create';
        return this.http.post(url, objectiveCost).pipe(map((res: any) => {
            return res;
        }));
    }

    updateObjectiveCost(objectiveCost: any, modeFinanceList: any, currencyModel: any, developmentPartnerModelList: any): any {
        const data = {
            projectTitleEn: objectiveCost.projectTitleEn,
            projectTitleBn: objectiveCost.projectTitleBn,
            ministryDivision: objectiveCost.ministryDivision,
            implementingAgency: objectiveCost.implementingAgency,
            concernedDivisionId: objectiveCost.concernedDivisionId,
            projectConceptUuid: objectiveCost.projectConceptUuid,
            uuid: objectiveCost.uuid,
            //  developmentPartnerId: objectiveCost.developmentPartnerId,
            objectivesTargets: objectiveCost.objectivesTargets,
            dateCommencement: objectiveCost.dateCommencement,
            dateCompletion: objectiveCost.dateCompletion,
            modeFinanceList: modeFinanceList,
            currencyRateList: currencyModel,
            developmentPartnersList: developmentPartnerModelList,
        };
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/update';
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));

    }

    deleteDevelopmentPartnersRow(rowUuid): Observable<any> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/delete-dev-partner/' + rowUuid;
        return this.http.delete(url);
    }

    getObjectiveCostList(): Observable<DppObjectiveCostModel[]> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/get-dpp-master-data';
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getObjectiveCostByPcUuid(uuid: string): Observable<DppObjectiveCostModel> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'objective-cost/get-dpp-master-data/' + uuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getRdppRtappObjectiveCostByPcUuid(uuid: string): Observable<DppObjectiveCostModel> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/get-dpp-master-data/' + uuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getRdppRtappList(page?: number, size?: number): any {
        let requestBodyDTO = new PageableRequestBodyModel();
        requestBodyDTO.page = page;
        requestBodyDTO.size = size;
        return this.http.post(environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/get-rdpp-rtapp-list', requestBodyDTO).pipe(map((res: any) => {
            console.log('call from service');
            console.log(res);
            return res;
        }));
    }

    searchRdppRtapp(projectType: any, projectName, sector, lowAmount, highAmount, status, page?: number, size?: number): any {
        const pageable = {
            page: page,
            size: size,
        };
        return this.http.post(environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/search-rdpp-rtapp', {
            projectType: projectType,
            projectName: projectName,
            sector: sector,
            lowAmount: lowAmount,
            highAmount: highAmount,
            status: status,
            pageable
        }).pipe(map((res: any) => {
            console.log('call from service');
            console.log(res);
            return res;
        }));
    }

    checkCurrentVersionRdppOrRtapp(uuid): any {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/check-current-rdpp-version/' + uuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    checkCurrentProjectVersionById(id: any): any {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/check-current-project-version/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
