import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {IDppAnnualPhasingCostWithChildDetailsRequest} from '../models/dpp-annual-phasing-cost-with-child-request';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {TappAnnualPhasingCostConstant} from "../constants/tapp-annual-phasing-cost.constant";
import {ITppAnnualPhasingCost} from '../models/tpp-annual-phasing-cost';
import {ITppAnnualPhasingCostWithChildDetailsResponse} from '../models/tpp-annual-phasing-cost-with-child-respone';
import {ITppPhasingCostTotal} from '../models/tpp-phasing-cost-total';
import {ITppAnnualPhasingCostWithChildDetailsRequest} from '../models/tpp-annual-phasing-cost-with-child-request';
import {DppAnnualPhasingCostConstant} from "../constants/dpp-annual-phasing-cost.constant";

@Injectable({
    providedIn: 'root'
})
export class TappAnnualPhasingCostService extends CrudRequestService<ITppAnnualPhasingCost> {

    dataSource = new BehaviorSubject<any>([]);
    fiscalYearList = this.dataSource.asObservable();

    fiscalYear = new BehaviorSubject<string>('');
    fiscalYearAsObserable = this.fiscalYear.asObservable();

    isForeignAid = new BehaviorSubject<boolean>(false);
    isForeignAidAsObserable = this.isForeignAid.asObservable();

    checkFiscalYear = new Subject<any>();
    checkFiscalYearAsObserable = this.checkFiscalYear.asObservable();

    private BASE_API_URL: string = TappAnnualPhasingCostConstant.TAPP_ANNUAL_PHASING_COST;

    constructor(private http: HttpClient) {
        super(http, TappAnnualPhasingCostConstant.TAPP_ANNUAL_PHASING_COST)
    }


    saveWithChild(request: ITppAnnualPhasingCostWithChildDetailsRequest): Observable<ITppAnnualPhasingCostWithChildDetailsResponse> {
        return this.http.post<ITppAnnualPhasingCostWithChildDetailsResponse>(this._BASE_URL + TappAnnualPhasingCostConstant.CREATE_WITH_CHILD, request);
    }

    updateWithChild(request: ITppAnnualPhasingCostWithChildDetailsRequest): Observable<ITppAnnualPhasingCostWithChildDetailsResponse> {
        return this.http.post<ITppAnnualPhasingCostWithChildDetailsResponse>(this._BASE_URL + TappAnnualPhasingCostConstant.UPDATE_WITH_CHILD, request);
    }

    getByProjectConceptIdAndComponentName(request): Observable<ITppAnnualPhasingCostWithChildDetailsResponse> {
        return this.http.post<ITppAnnualPhasingCostWithChildDetailsResponse>(this._BASE_URL + TappAnnualPhasingCostConstant.GET_BY_PROJECT_CONCEPT_ID_AND_COMPONENT_NAME, request);
    }

    getByProjectConceptIdForGettingFiscalYear(conceptId: number): Observable<{ fiscalYear: string }[]> {
        return this.http.get<{ fiscalYear: string }[]>(this._BASE_URL + TappAnnualPhasingCostConstant.GET_BY_PROJECT_CONCEPT_ID_FOR_CHECKING_FISCAL_YEAR + '/' + conceptId);
    }

    getGrandTotalByProjectConceptId(conceptId: number): Observable<{ componentName: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal[], grandTotal: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] }[]> {
        return this.http.get<{ componentName: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal[], grandTotal: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] }[]>(this._BASE_URL + TappAnnualPhasingCostConstant.GET_GRAND_TOTAL_BY_PROJECT_CONCEPT_ID + "/" + conceptId);
    }

    public addAnnualPhasingCost(revenueCostList: any): Observable<any> {
        return this.http.post(this.BASE_API_URL + TappAnnualPhasingCostConstant.CREATE_ANNUAL_PHASING_COST, revenueCostList, {
            headers: {'Access-Control-Allow-Origin': '*'}
        });
    }


    public getGrandTotalAnnualPhasingById(conceptId: string): Observable<any> {

        return this.http.get(this.BASE_API_URL + TappAnnualPhasingCostConstant.GET_GRAND_Total + '/' + conceptId);

    }

    getGrandTotalAnnualPhasing() {
        return this.http.get(this.BASE_API_URL + TappAnnualPhasingCostConstant.GET_ALL_GRAND_Total);
    }

    getByProjectConceptUuid(pcUuid: string) {
        const url: string = environment.ibcs.ppsDppBackendPoint + TappAnnualPhasingCostConstant.GET_ALL_BY_PCUUID + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getAnnualPhasingCostByPCUuidAndComponentType(pcUuid: string, type: string) {
        const url: string = environment.ibcs.ppsDppBackendPoint + TappAnnualPhasingCostConstant.GET_ANNUAL_PHASING_COST_BY_PCUUID_AND_TYPE + '/' + pcUuid + '/' + type;
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

        return this.http.get(this.BASE_API_URL + TappAnnualPhasingCostConstant.GET_DETAILS_ESTIMATED_COST + '/' + conceptId);

    }
}
