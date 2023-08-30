import {Injectable} from "@angular/core";
import {CrudRequestService} from "../../../core/services/crud-request.service";
import {DppObjectiveCostModel} from "../models/dppObjectiveCost.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {map} from "rxjs/operators";
import {RdppRtappModel} from "../models/rdpp-rtapp-model";
import {Observable} from "rxjs";
import {PageableRequestBodyModel} from "../models/pageable-request-body-model";

@Injectable({
    providedIn: 'root'
})
export class RdppObjectiveCostService extends CrudRequestService<DppObjectiveCostModel> {
    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/');
    }

    getByProjectConceptUuid(pcUuid): any {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'objective-cost/getByPcuuid' + '/' + pcUuid;
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
            id: objectiveCost.id,
            status: objectiveCost.status,
            projectConceptMasterId: objectiveCost.projectConceptMasterId,
            paripatraVersionId: objectiveCost.paripatraVersionId,
            dppMasterId: objectiveCost.dppMasterId,
            responsiblePreparation: objectiveCost.responsiblePreparation,
            designationContactPerson: objectiveCost.designationContactPerson,
            revisedVersion: objectiveCost.revisedVersion,
            referenceId: objectiveCost.referenceId,
            concernedDivisionName: objectiveCost.concernedDivisionName,
            referenceUuid: objectiveCost.referenceUuid,
            timeExtension: objectiveCost.timeExtension,
            costExtension: objectiveCost.costExtension,
            cumulativeDate: objectiveCost.cumulativeDate,

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

    // getObjectiveCostByPcUuid(uuid: string): Observable<DppObjectiveCostModel> {
    //     const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/get-dpp-master-data/' + uuid;
    //     return this.http.get(url).pipe(map((res: any) => {
    //         return res;
    //     }));
    // }

    getObjectiveCostByRdppMasterId(rdppMasterId: number): Observable<DppObjectiveCostModel> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/get-dpp-master-data-by/' + rdppMasterId;
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

    getCumulativeDate(rdppMasterId: number, conceptUuid: string): any {
        return this.http.get(environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/getCumulativeDate/' + rdppMasterId + '/' + conceptUuid);
    }

    getObjectiveCostByReferenceUuid(referenceUuid: string): Observable<DppObjectiveCostModel> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/find-objective-cost-by-reference-uuid/' + referenceUuid;
        return this.http.get(url).pipe(map((res: any) => { return res; }));
    }

    findObjectiveCostByUuid(uuid: string): Observable<any> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/find-objective-cost-by-uuid/' + uuid;
        return this.http.get(url).pipe(map((res: any) => { return res; }));
    }

    getEstimatedCosts(conceptUuid: string): Observable<any> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'objective-cost/estimated-cost/' + conceptUuid;
        return this.http.get(url);
    }

    getYearWiseEstimatedCosts(conceptUuid: string): Observable<any> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'rdppAnnualPhasingCost/get-year-wise-estimated-cost-by/' + conceptUuid;
        return this.http.get(url);
    }
}
