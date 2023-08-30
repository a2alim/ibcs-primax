import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {DppObjectiveCostModel} from '../models/dppObjectiveCost.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FsLinkWithDppModel} from "../models/FsLinkWithDpp.model";

@Injectable({
    providedIn: 'root'
})
export class DppObjectiveCostService extends CrudRequestService<DppObjectiveCostModel> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsDppBackendPoint + 'objective-cost/');
    }

    getByProjectConceptUuid(pcUuid) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'objective-cost/getByPcuuid' + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }



    getIndicatorList() {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'drip-api/get-indicators';
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getIndicatorUrl(pcUuid, indicators, projectName, isBangla) {
        const data = {
            pcUuid: pcUuid,
            indicatorList: indicators,
            projectName: projectName,
            bangla: isBangla
        };

        const url: string = environment.ibcs.ppsDppBackendPoint + 'drip-api/get-indicators-url';

        return this.http.post(url, data).pipe(map((res: any) => {
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
            sectorId: objectiveCost.sectorId,
            subSectorId: objectiveCost.subSectorId,
            projectConceptUuid: objectiveCost.projectConceptUuid,
            //  developmentPartnerId: objectiveCost.developmentPartnerId,
            objectivesTargets: objectiveCost.objectivesTargets,
            dateCommencement: objectiveCost.dateCommencement,
            dateCompletion: objectiveCost.dateCompletion,
            modeFinanceList: modeFinanceList,
            currencyRateList: currencyModel,
            developmentPartnersList: developmentPartnerModelList,
        };
        const url: string = environment.ibcs.ppsDppBackendPoint + 'objective-cost/create';
        return this.http.post(url, data).pipe(map((res: any) => {
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
            sectorId: objectiveCost.sectorId,
            subSectorId: objectiveCost.subSectorId,
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
        const url: string = environment.ibcs.ppsDppBackendPoint + 'objective-cost/update';
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));

    }

    deleteDevelopmentPartnersRow(rowUuid): Observable<any> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'objective-cost/delete-dev-partner/' + rowUuid;
        return this.http.delete(url);
    }

    getObjectiveCostList(): Observable<DppObjectiveCostModel[]> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'objective-cost/get-dpp-master-data';
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

    linkFsWithDpp(fsLinkWithDppModel: FsLinkWithDppModel):Observable<any>{
        const url: string = environment.ibcs.ppsDppBackendPoint + 'objective-cost/link-fs-with-dpp';
        return this.http.post(url, fsLinkWithDppModel);
    }


    getAmortizationReport(amorid: string): Observable<any> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAmortizationSchedule/report/' + amorid;
        return this.http.get(url);
    }
    getProjectManagementSetup(projectConceptid: string): Observable <any> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'projectManagementSetup/getProjectManagementSetup/' + projectConceptid;
        return this.http.get(url);
    }

    getLocationByObjectiveCostIdUsingProjectSummary(projectSummaryId: number) : Observable <any> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppLocation/getByObjectiveCostIdUsingProjectSummary/' + projectSummaryId;

    return this.http.get(url);

    }
    getByProjectConceptIdAndComponentName(resObj) :any {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAnnualPhasingCost/getByProjectConceptIdAndComponentName';
        return this.http.post(url, resObj);

    }

}
