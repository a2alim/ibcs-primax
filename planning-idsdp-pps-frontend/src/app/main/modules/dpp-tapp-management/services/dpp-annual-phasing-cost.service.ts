import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {DppAnnualPhasingCostConstant} from '../constants/dpp-annual-phasing-cost.constant';
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {IDppAnnualPhasingCostWithChildDetailsRequest} from '../models/dpp-annual-phasing-cost-with-child-request';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {IDppAnnualPhasingCost} from '../models/dpp-annual-phasing-cost';
import {IDppAnnualPhasingCostWithChildDetailsResponse} from '../models/dpp-annual-phasing-cost-with-child-respone';
import {IDppPhasingCostTotal} from '../models/dpp-phasing-cost-total';
import {IYearWisePhysicalAndFinancialTarget} from '../models/year-wise-physical-and-financial-target';

@Injectable({
    providedIn: 'root'
})
export class DppAnnualPhasingCostService extends CrudRequestService<IDppAnnualPhasingCost> {

    dataSource = new BehaviorSubject<any>([]);
    fiscalYearList = this.dataSource.asObservable();

    fiscalYear = new BehaviorSubject<string>('');
    fiscalYearAsObserable = this.fiscalYear.asObservable();

    isForeignAid = new BehaviorSubject<boolean>(false);
    isForeignAidAsObserable = this.isForeignAid.asObservable();

    checkFiscalYear = new Subject<any>();
    checkFiscalYearAsObserable = this.checkFiscalYear.asObservable();

    private BASE_API_URL: string = DppAnnualPhasingCostConstant.DPP_ANNUAL_PHASING_COST;

    constructor(private http: HttpClient) {
        super(http, DppAnnualPhasingCostConstant.DPP_ANNUAL_PHASING_COST)
    }


    saveWithChild(request: IDppAnnualPhasingCostWithChildDetailsRequest): Observable<IDppAnnualPhasingCostWithChildDetailsResponse> {
        return this.http.post<IDppAnnualPhasingCostWithChildDetailsResponse>(this._BASE_URL + DppAnnualPhasingCostConstant.CREATE_WITH_CHILD, request);
    }

    updateWithChild(request: IDppAnnualPhasingCostWithChildDetailsRequest): Observable<IDppAnnualPhasingCostWithChildDetailsResponse> {
        return this.http.post<IDppAnnualPhasingCostWithChildDetailsResponse>(this._BASE_URL + DppAnnualPhasingCostConstant.UPDATE_WITH_CHILD, request);
    }

    getByProjectConceptIdAndComponentName(request): Observable<IDppAnnualPhasingCostWithChildDetailsResponse> {
        return this.http.post<IDppAnnualPhasingCostWithChildDetailsResponse>(this._BASE_URL + DppAnnualPhasingCostConstant.GET_BY_PROJECT_CONCEPT_ID_AND_COMPONENT_NAME, request);
    }

    getByProjectConceptIdForGettingFiscalYear(conceptId: number): Observable<{ fiscalYear: string }[]> {
        return this.http.get<{ fiscalYear: string }[]>(this._BASE_URL + DppAnnualPhasingCostConstant.GET_BY_PROJECT_CONCEPT_ID_FOR_CHECKING_FISCAL_YEAR + '/' + conceptId);
    }

    getGrandTotalByProjectConceptId(conceptId: number): Observable<{ dppAnnualPhasing: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal[], grandTotal: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] }[]> {
        return this.http.get<{ dppAnnualPhasing: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal[], grandTotal: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] }[]>(this._BASE_URL + DppAnnualPhasingCostConstant.GET_GRAND_TOTAL_BY_PROJECT_CONCEPT_ID + "/" + conceptId);
    }

    getYearWisePhysicalAndFinancialTargetByProjectConceptId(conceptId: number): Observable<IYearWisePhysicalAndFinancialTarget[]> {
        return this.http.get<IYearWisePhysicalAndFinancialTarget[]>(this._BASE_URL + DppAnnualPhasingCostConstant.GET_YEAR_WISE_PHYSICAL_AND_FINANCIAL_TARGET_BY_PROJECT_CONCEPT_ID + "/" + conceptId);
    }

    public addAnnualPhasingCost(revenueCostList: any): Observable<any> {
        return this.http.post(this.BASE_API_URL + DppAnnualPhasingCostConstant.CREATE_ANNUAL_PHASING_COST, revenueCostList, {
            headers: {'Access-Control-Allow-Origin': '*'}
        });
    }


    public getGrandTotalAnnualPhasingById(conceptId: string): Observable<any> {

        return this.http.get(this.BASE_API_URL + DppAnnualPhasingCostConstant.GET_GRAND_Total + '/' + conceptId);

    }

    getGrandTotalAnnualPhasing() {
        return this.http.get(this.BASE_API_URL + DppAnnualPhasingCostConstant.GET_ALL_GRAND_Total);
    }

    getByProjectConceptUuid(pcUuid: string) {
        const url: string = environment.ibcs.ppsDppBackendPoint + DppAnnualPhasingCostConstant.GET_ALL_BY_PCUUID + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getAnnualPhasingCostByPCUuidAndComponentType(pcUuid: string, type: string) {
        const url: string = environment.ibcs.ppsDppBackendPoint + DppAnnualPhasingCostConstant.GET_ANNUAL_PHASING_COST_BY_PCUUID_AND_TYPE + '/' + pcUuid + '/' + type;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }


    setFiscalYearList(financialYearInfo: { fiscalYear: string }[]) {
        this.dataSource.next(financialYearInfo);
    }

    setNewFiscalYear(fiscalYear: string) {
        this.fiscalYear.next(fiscalYear);
    }

    setCheckFiscalYear() {
        this.checkFiscalYear.next()
    }

    getCheckFiscalYear() {
        this.checkFiscalYear.next()
    }

    setIsForeignAid(isForeignAid: boolean) {
        this.isForeignAid.next(isForeignAid);
    }

    public getDetailsEstimatedCost(conceptId: string): Observable<any> {

        return this.http.get(this.BASE_API_URL + DppAnnualPhasingCostConstant.GET_DETAILS_ESTIMATED_COST + '/' + conceptId);

    }
}
