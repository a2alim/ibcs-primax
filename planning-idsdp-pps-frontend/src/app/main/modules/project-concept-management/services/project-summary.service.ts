import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {
    PROJECT_CONCEPT,
    PROJECT_SUMMARY_CRITERIA_BASED_SEARCH,
    PROJECT_SUMMARY_GLOBAL_SEARCH,
    PROJECT_SUMMARY_LIST_BY_FOREIGN_AID,
    PROJECT_SUMMARY_LIST_BY_GOB,
    PROJECT_SUMMARY_LIST_BY_PROJECT_TYPE,
    PROJECT_SUMMARY_LIST_BY_SECTOR_DIVISION
} from '../constants/project-summary.constant';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {IProjectConcept} from '../models/project-concept';
import {CommentSourceEnum} from "../enums/comment-source.enum";
import {environment} from "../../../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ProjectSummaryService extends CrudRequestService<IProjectConcept> {

    constructor(private http: HttpClient) {
        super(http, PROJECT_CONCEPT);
    }

    // for get ProjectSummaryList By ProjectTypeId
    getProjectSummaryListByProjectTypeId(projectType: number, page?: number, size?: number): Observable<IResponseBody<IProjectConcept>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<IProjectConcept>>(this._BASE_URL + PROJECT_SUMMARY_LIST_BY_PROJECT_TYPE, {
            pageableRequestBodyDTO,
            projectType: projectType
        });
    }

    // for get ProjectSummaryList By SectorDivisionId
    getProjectSummaryListBySectorDivisionId(sectorDivision: number, page?: number, size?: number): Observable<IResponseBody<IProjectConcept>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<IProjectConcept>>(this._BASE_URL + PROJECT_SUMMARY_LIST_BY_SECTOR_DIVISION, {
            pageableRequestBodyDTO,
            sectorDivision: sectorDivision
        });
    }

    // for get ProjectSummaryList By ForeignAid
    getProjectSummaryListByForeignAid(page?: number, size?: number): Observable<IResponseBody<IProjectConcept>> {
        return this.http.post<IResponseBody<IProjectConcept>>(this._BASE_URL + PROJECT_SUMMARY_LIST_BY_FOREIGN_AID, {
            page: page,
            size: size
        });
    }

    // for get ProjectSummaryList By GoB
    getProjectSummaryListByGoB(page?: number, size?: number): Observable<IResponseBody<IProjectConcept>> {
        return this.http.post<IResponseBody<IProjectConcept>>(this._BASE_URL + PROJECT_SUMMARY_LIST_BY_GOB, {
            page: page,
            size: size
        });
    }

    // for projectSummary Criteria BasedSearch by projectType, sectorDivision, isFsRequired, isForeignAid
    projectSummaryCriteriaBasedSearch(projectType: any, sectorDivision: any, gob: boolean, isForeignAid: boolean,
                                      isFsRequired: boolean, projectName, sector, lowAmount, highAmount, status, source: CommentSourceEnum, page?: number, size?: number): Observable<IResponseBody<IProjectConcept>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<IProjectConcept>>(this._BASE_URL + PROJECT_SUMMARY_CRITERIA_BASED_SEARCH, {
            pageableRequestBodyDTO,
            projectType: projectType,
            sectorDivision: sectorDivision,
            gob: gob,
            isForeignAid: isForeignAid,
            isFsRequired: isFsRequired,
            projectName: projectName,
            sector: sector,
            lowAmount: lowAmount,
            highAmount: highAmount,
            status: status,
            source: source
        });
    }

    applyFilter(data): Observable<any> {
        return this.http.post(this._BASE_URL + PROJECT_SUMMARY_GLOBAL_SEARCH, data);
    }

    getApproveProjectConceptList(){
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'projectConcept/approved-projects';
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getProjectByAgency(){
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'projectConcept/getProjectByAgency';
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    paripatraVersion(){
        const url: string = environment.ibcs.configurationApiEndPoint + 'paripatraVersion/getActiveParipatraList';
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }


}
