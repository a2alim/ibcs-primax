import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { ApprovalValueSetupModel } from 'app/main/modules/configuration-management/models/approval-value-setup-model';
import { environment } from 'environments/environment';
import { map } from 'rxjs/internal/operators/map';
import {user} from "../../../mock-api/common/user/data";


@Injectable({
    providedIn: 'root'
})

export class ReportDataService extends CrudRequestService<ApprovalValueSetupModel> {

    reportList:Array<{url: string, name: string}> = [];

    public REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/data-one/`;
    public PC_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/ppsbyuuid/`;
    public PFS_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/`;
    public FEASIBILITY_STUDY_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/feasibility-study-report-data/1`;
    public ANNEXURE_FIVE_A_DATA_URL = `${environment.ibcs.ppsReportEndPoint}annexure-five-a/find-by-uuid/`;
    public ANNEXURE_TWO_DATA_URL = `${environment.ibcs.ppsReportEndPoint}project-management-report/find-by-uuid/`;
    public ANNEXURE_ONE_DATA_URL = `${environment.ibcs.ppsReportEndPoint}location/getByObjectiveCostIdUsingProjectSummary/`;
    public ANNEXURE_FOUR_DATA_URL = `${environment.ibcs.ppsReportEndPoint}yearWise/projectConcept/`;
    public ANNEXURE_THREE_A_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/annexure-three-a/`;
    public ANNEXURE_THREE_B_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/annexure-three-b/`;
    public ANNEXURE_THREE_C_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/annexure-three-c/`;
    public ANNEXURE_FIVE_B_DATA_URL = `${environment.ibcs.ppsReportEndPoint}dpp-tapp/annexure-five-b/find-by-uuid/`;
    public ANNEXURE_SIX_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/dpp-tapp/amortization-schedule/`;
    public PART_A_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/dpp-tapp/part-a/`;
    public PART_B_DATA_URL = `${environment.ibcs.ppsReportEndPoint}dpp-part-b/find-by-uuid/`;
    public DPP_FULL_REPORT = `${environment.ibcs.ppsReportEndPoint}report/all-dpp-report/`;

    // ============== For Dpp Report In Bangla =====================
    public PART_A_DATA_URL_FOR_BANGLA = `${environment.ibcs.ppsReportEndPoint}report/dpp-tapp/part-a-bn/`;
    public PART_B_DATA_URL_FOR_BANGLA = `${environment.ibcs.ppsReportEndPoint}dpp-part-b/bn-report-find-by-uuid/`;
    public LOCATION_WISE_COST_BREAK_DOWN_DATA_URL_FOR_BANGLA = `${environment.ibcs.ppsReportEndPoint}location/location-wise-cost-break-down-bn-report/`;
    public ANNEXURE_TWO_DATA_URL_FOR_BANGLA = `${environment.ibcs.ppsReportEndPoint}project-management-report/find-bn-report-by-uuid/`;
    public ANNEXURE_THREE_A_BANGLA_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/annexure-three-a-bn/`;
    public ANNEXURE_THREE_B_BANGLA_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/annexure-three-b-bn/`;
    public ANNEXURE_THREE_C_BANGLA_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/annexure-three-c-bn/`;
    public ANNEXURE_SIX_BANGLA_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/dpp-tapp/amortization-schedule-bn/`;
    public ANNEXURE_FIVE_A_BANGLA_DATA_URL = `${environment.ibcs.ppsReportEndPoint}annexure-five-a/bn-report-find-by-uuid/`;
    public ANNEXURE_FIVE_B_BANGLA_DATA_URL = `${environment.ibcs.ppsReportEndPoint}dpp-tapp/annexure-five-b/bn-report-find-by-uuid/`;
    public ANNEXURE_FOUR__BANGLA_DATA_URL = `${environment.ibcs.ppsReportEndPoint}yearWise/projectConceptBnReport/`;
    public DPP_FULL_BANGLA_REPORT = `${environment.ibcs.ppsReportEndPoint}report/all-dpp-bangla-report/`;

    //  ============== For Tapp =============
    public TAPP_ANNEXURE_ONE_DATA_URL = `${environment.ibcs.ppsReportEndPoint}tapp-annexure-one-report/find-by-uuid/`;
    public TAPP_SHORT_ANNEXURE_ONE_DATA_URL = `${environment.ibcs.ppsReportEndPoint}tapp-annexure-one-report/find-short-by-uuid/`;
    public TAPP_PART_A_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/tapp/part-a/`;
    public TAPP_PART_B_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/tapp/part-b/`;
    public TAPP_ANEX_TWO_DATA_URL = `${environment.ibcs.ppsReportEndPoint}tapp/termOfReference/getReference/`;
    public TAPP_ANEX_FIVE_DATA_URL = `${environment.ibcs.ppsReportEndPoint}tapp/annexure/five/`;
    public TAPP_ANEX_SIX_DATA_URL = `${environment.ibcs.ppsReportEndPoint}tapp/annexure/six/`;
    public TAPP_FULL_REPORT = `${environment.ibcs.ppsReportEndPoint}report/all-tapp-report/`;
    public TAPP_ANNEXURE_FOUR_DATA_URL = `${environment.ibcs.ppsReportEndPoint}tapp-annexure-four-report/find-by-uuid/`;
    public TAPP_ANNEXURE_EIGHT_GOODS = `${environment.ibcs.ppsReportEndPoint}report/tapp-annexure-goods/`;
    public TAPP_ANNEXURE_EIGHT_SERVICES = `${environment.ibcs.ppsReportEndPoint}report/tapp-annexure-service/`;
    public TAPP_ANNEXURE_THREE = `${environment.ibcs.ppsReportEndPoint}report/tapp-annexure-three/`;
    public TAPP_ANNEXURE_SEVEN = `${environment.ibcs.ppsReportEndPoint}report/tapp-annexure-seven/`;



    //  ============== For Project Concept =============

    public PROJECT_CONCEPT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}project-concept/get-by-uuid/`;

    // ================= For FS Report =====================

    public FS_Report_DATA_URL = `${environment.ibcs.ppsReportEndPoint}project-feasibility-study/feasibility-study-report-pdf/`;

    // =================== For GO =======================
    public DPP_GO = `${environment.ibcs.ppsReportEndPoint}acnec-go/find-by-uuid/`;
    public DPP_GO_BANGLA_REPORT = `${environment.ibcs.ppsReportEndPoint}acnec-go/bn-admin-report-find-by-uuid/`;
    public DPP_ADMINISTRATIVE_GO_REPORT = `${environment.ibcs.ppsReportEndPoint}acnec-go/bn-admin-report-find-by-uuid/`;
    // =============== ===================== ============

    // ================================================================
    // public ANNEXURE_ONE_DATA_URL = `${environment.ibcs.ppsReportEndPoint}location/getByObjectiveCostIdUsingProjectSummary/`;
    // public ANNEXURE_FOUR_DATA_URL = `${environment.ibcs.ppsReportEndPoint}yearWise/projectConcept/`;


    public FSP_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/feasibility-study-proposal-report/`;

    public httpOptions = { 'responseType': 'arraybuffer' as 'json' };
    public committeeUrl = [0, 1, 2, 3, 4, 5, 6];
    public summaryUrl = ['report/annexure-p-bangla-report', 'report/bn-report-annexure-f', 'annexure_ba/bn-report-find-by-uuid', 'annexure_va/bn-report-find-by-uuid', 'annexure_ma/bn-report-find-by-uuid', 'annexure_ja/bn-report-find-by-uuid', 'annexure_ra/bn-report-find-by-uuid'];

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsReportEndPoint + 'report/');
    }

    getCommitteeReportByUrl(projectConceptUuid: string, urlIndex): any {
        let url = `${environment.ibcs.ppsReportEndPoint}pec-pic-psc-dpec-dspec-spec/report/${projectConceptUuid}/${this.committeeUrl[urlIndex]}`;
        return this.http.get<any>(`${url}`, this.httpOptions).pipe(map((data: any) => data));
    }

    getSummaryReportByUrl(projectConceptUuid: string, summariesType: string): any {
        let url = `${environment.ibcs.ppsReportEndPoint}report/project-summaries-report/${projectConceptUuid}/${summariesType}`;
        return this.http.get<any>(`${url}`, this.httpOptions).pipe(map((data: any) => data));
    }

    getWorkingPlanReport(projectConceptUuid: string): any {
        const url = `${environment.ibcs.ppsReportEndPoint}report/psc-working-plan/get-by-uuid/`;
        return this.http.get<any>(`${url}${projectConceptUuid}`, this.httpOptions).pipe(map((data: any) => data));
    }

    getPscWorkingPlanReport(pcUuid, paperType, userType): any{
        const url = `${environment.ibcs.ppsReportEndPoint}report/psc-working-plan/get-by-uuid/${pcUuid}/${paperType}/${userType}`;
        return this.http.get<any>(`${url}`, this.httpOptions).pipe(map((data: any) => data));
    }

    getReportData(projectConceptUuid: string): any {
        return this.http.get<any>(`${this.REPORT_DATA_URL}${projectConceptUuid}`).pipe(map((data: any) => data));
    }

    getPcRportData(projectConceptUuid: string): any {
        return this.http.get<any>(`${this.PC_REPORT_DATA_URL}${projectConceptUuid}`, this.httpOptions).pipe(map((data: any) => data));
    }

    getPfsReportData(projectConceptUuid: string): any {
        return this.http.get<any>(`${this.PFS_REPORT_DATA_URL}${projectConceptUuid}`, this.httpOptions).pipe(map((data: any) => data));
    }

    getFeasibilityStudyReportData(): any {
        return this.http.get<any>(this.FEASIBILITY_STUDY_REPORT_DATA_URL).pipe(map((data: any) => data));
    }


    getAnnexureFiveAReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_FIVE_A_DATA_URL + uuId, httpOptions);
    }

    // ======== FOR ANNEXURE FIVE A BANGLA REPORT ==============
    getAnnexureFiveABanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_FIVE_A_BANGLA_DATA_URL + uuId, httpOptions);
    }

    getAnnexureTwoReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_TWO_DATA_URL + uuId, httpOptions);
    }

    // ======== FOR ANNEXURE TWO BANGLA REPORT ==============
    getAnnexureTwoBanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_TWO_DATA_URL_FOR_BANGLA + uuId, httpOptions);
    }

    getAnnexureOneReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_ONE_DATA_URL + uuId, httpOptions);
    }
    //=============== FOR DPP LOCATION WISE COST DREACK DOWN REPORT BANGLA ===================
    getLocationWIseCostBreakDownBnReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.LOCATION_WISE_COST_BREAK_DOWN_DATA_URL_FOR_BANGLA + uuId, httpOptions);
    }

    getAnnexureFourReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_FOUR_DATA_URL + uuId, httpOptions);
    }

    getAnnexureFourBanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_FOUR__BANGLA_DATA_URL + uuId, httpOptions);
    }

    getAnnexureThreeAReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_THREE_A_DATA_URL + uuId, httpOptions);
    }

    // ============== For Annexure Three A Bangla report ===========
    getAnnexureThreeABanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_THREE_A_BANGLA_DATA_URL + uuId, httpOptions);
    }

    getAnnexureThreeBReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_THREE_B_DATA_URL + uuId, httpOptions);
    }

    // ============== For Annexure Three C Bangla report ===========
    getAnnexureThreeBBanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_THREE_B_BANGLA_DATA_URL + uuId, httpOptions);
    }

    getAnnexureThreeCReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_THREE_C_DATA_URL + uuId, httpOptions);
    }

    // ============== For Annexure Three C Bangla report ===========
    getAnnexureThreeCBanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_THREE_C_BANGLA_DATA_URL + uuId, httpOptions);
    }

    getAnnexureFiveBReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_FIVE_B_DATA_URL + uuId, httpOptions);
    }

    // ============ FOR ANNEXURE FIVE B BANGLA REPOR ============
    getAnnexureFiveBBanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_FIVE_B_BANGLA_DATA_URL + uuId, httpOptions);
    }

    getAnnexureSixReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_SIX_DATA_URL + uuId, httpOptions);
    }


    // ============ FOR BANGLA ANNEXURE SIX REPOR ============
    getAnnexureSixBanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.ANNEXURE_SIX_BANGLA_DATA_URL+ uuId, httpOptions);
    }

    getPartAReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.PART_A_DATA_URL + uuId, httpOptions);
    }

    // ============= FOR DPP PART A BANGLA REPORT ====================
    getPartABanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.PART_A_DATA_URL_FOR_BANGLA + uuId, httpOptions);
    }

    getPartBReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.PART_B_DATA_URL + uuId, httpOptions);
    }

    //============ FOR DPP PART-B BANGLA REPORT ==================
    getPartBBanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.PART_B_DATA_URL_FOR_BANGLA + uuId, httpOptions);
    }

    // for full dpp report
    getFullDppReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.DPP_FULL_REPORT + uuId + '/all', httpOptions);
    }

    getFullDppBanglaReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.DPP_FULL_BANGLA_REPORT + uuId, httpOptions);
    }

    //=============== Tapp ============================

    // for full Tapp report
    getFullTappReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_FULL_REPORT + uuId, httpOptions);
    }

    getTappAnnexureOneAReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANNEXURE_ONE_DATA_URL + uuId, httpOptions);
    }
      getTappShortAnnexureOneAReport(uuId, isShowFull) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_SHORT_ANNEXURE_ONE_DATA_URL + uuId + '/' +isShowFull, httpOptions);
    }

    getTappPartAReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_PART_A_DATA_URL + uuId, httpOptions);
    }

    getProjectConceptReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.PROJECT_CONCEPT_DATA_URL + uuId, httpOptions);
    }

    getTappPartBReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_PART_B_DATA_URL + uuId, httpOptions);
    }

    getTappAnexTwoReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANEX_TWO_DATA_URL + uuId, httpOptions);
    }

    getTappAnexFiveReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANEX_FIVE_DATA_URL + uuId, httpOptions);
    }

    getTappAnexSixReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANEX_SIX_DATA_URL + uuId, httpOptions);
    }

    getTappAnnexureFourAReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANNEXURE_FOUR_DATA_URL + uuId, httpOptions);
    }

    getFSPRReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.FSP_REPORT_DATA_URL + uuId, httpOptions);
    }

    // getAnnexureOneReport(uuId){
    //   const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
    //   return this.http.get<any>(this.ANNEXURE_ONE_DATA_URL+uuId, httpOptions);
    // }

    // getAnnexureFourReport(uuId){
    //   const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
    //   return this.http.get<any>(this.ANNEXURE_FOUR_DATA_URL+uuId, httpOptions);
    // }


    getTappAnnexureEightGoods(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANNEXURE_EIGHT_GOODS + uuId, httpOptions);
    }

    getTappAnnexureEightService(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANNEXURE_EIGHT_SERVICES + uuId, httpOptions);
    }

    getTappAnnexureThree(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANNEXURE_THREE + uuId, httpOptions);
    }

    getTappAnnexureSeven(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.TAPP_ANNEXURE_SEVEN + uuId, httpOptions);
    }


    // for dpp GO report
    getDppGOReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.DPP_GO + uuId, httpOptions);
    }

    // =============== For dpp Go Report for bangla ===============
    getDppGOBanglaReport(uuId, orderType) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.DPP_GO_BANGLA_REPORT + uuId + '/' + orderType, httpOptions);
    }

    // =============== For dpp Administrative Go Report for bangla ===============
    getAdministrativeDppGOBanglaReport(uuId, orderType) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.DPP_ADMINISTRATIVE_GO_REPORT + uuId +'/' + orderType, httpOptions);
    }

    //============ For Feasibility Report ===========

    getFSReport(uuId) {
        const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(this.FS_Report_DATA_URL + uuId, httpOptions);

    }


    getAnnexureGoodWorksServiceReport(uuid: string, reportType: string): any {
        if(reportType=='en') {
            this.reportList.push(
                {
                    url: this.ANNEXURE_THREE_A_DATA_URL + uuid + '.pdf',
                    name: 'ANNEXURE-GOOD'
                },
                {
                    url: this.ANNEXURE_THREE_B_DATA_URL + uuid + '.pdf',
                    name: 'ANNEXURE-WORK'
                },
                {
                    url: this.ANNEXURE_THREE_C_DATA_URL + uuid + '.pdf',
                    name: 'ANNEXURE-SERVICE'
                });

        } else {
            this.reportList.push(
                {
                    url: this.ANNEXURE_THREE_A_BANGLA_DATA_URL + uuid + '.pdf',
                    name: 'ANNEXURE-GOOD'
                },
                {
                    url: this.ANNEXURE_THREE_B_BANGLA_DATA_URL + uuid + '.pdf',
                    name: 'ANNEXURE-WORK'
                },
                {
                    url: this.ANNEXURE_THREE_C_BANGLA_DATA_URL + uuid + '.pdf',
                    name: 'ANNEXURE-SERVICE'
                });

        }


        return this.reportList;
    }

    getEnothiEcnecReport(){
        //const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
        return this.http.get<any>(environment.ibcs.ppsReportEndPoint + "report/ecnec-report");
    }

    getAnnexureFiveBRepot(pcUuid: String ): any {
        return this.http.get<any>(environment.ibcs.ppsReportEndPoint + "dpp-tapp/annexure-five-b/find-by-uuid/"+ pcUuid );
    }

    


}
