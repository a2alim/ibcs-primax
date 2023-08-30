import { Injectable } from '@angular/core';
import { environment } from "../../../../../environments/environment";
import { ApiService } from "../../../core/services/api/api.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class JasperServiceService {

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;
    minioEndPointHost = environment.ibcs.minioEndPointHost;
    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(
        private apiService: ApiService,
        private http: HttpClient,
    ) {

    }

    generateProfilePdf(uuid, lang: string) {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/pdf-gen/' + uuid + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }

    generateAgreementPdf(uuid, lang) {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-agreement/pdf-gen/' + uuid + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


    proposalMarksPdf(data, lang) {

        const url = this.baseRmsRpmApiEndPoint + 'proposal-marks/pdf-gen/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.post<any>(url, data, httpOptions);

    }

    advertiseDateValidity(): Observable<any> {
        return this.http.get(this.baseRmsRpmApiEndPoint + '/api/fyw-sector-sub-sector/check/validity');
    }

    isProposalCreatable(uuid): Observable<any> {
        return this.http.get(this.baseRmsRpmApiEndPoint + 'api/researcher-proposal/check-proposal-by-profile-uuid/' + uuid);
    }


    proposalPdf(uuid, lang) {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-proposal/pdf-gen/' + uuid + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


    generateSeminarPdf(id, lang, viewNumber) {
        const url = this.baseRmsRpmApiEndPoint + 'seminar-view/pdf-gen/' + id + '/' + lang + '/' + viewNumber;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }

    generateFinalReportOfRresearchSubmissionPdf(m1ResearcherProposalId, proposalUuid, lang) {
        const url = this.baseRmsRpmApiEndPoint + 'research-final-submission-report/pdf-gen/' + m1ResearcherProposalId + '/' + proposalUuid + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


    generateProposalFeedbackPdf(uuid, lang) {
        const url = this.baseRmsRpmApiEndPoint + 'proposal-feedback/pdf-gen/' + uuid + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }

    generateRequestLetterPdf(id, type, lang) {
        const url = this.baseRmsRpmApiEndPoint + 'request-letter/pdf-gen/' + id + '/' + type + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }

    /*
    * Training Institute
    *
    * */
    generateTraningInstituteProposalPdf(uuid, lang: string) {
        const url = this.baseTiEndPoint + 'proposal-ti/pdf-gen/' + uuid + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


    generateTraninersViewlPdf(id, lang: string) {
        const url = this.baseTiEndPoint + 'trainers-view/pdf-gen/' + id + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


    generateCourseSchedulelPdf(id, lang: string) {
        const url = this.baseTiEndPoint + 'course-schedule/pdf-gen/' + id + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


    generateParticipantPdf(id, lang: string) {
        const url = this.baseTiEndPoint + 'participant-list/pdf-gen/' + id + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


    generateAgreementLetterPdf(id, lang: string) {
        const url = this.baseTiEndPoint + 'agreement-letter/pdf-gen/' + id + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }

    /*
   * Training Institute
   *
   * */

    generateProfileMarksInstitutionalPdf(uuid, lang: string, category: string) {
        const url = this.baseRmsRpmApiEndPoint + 'profile-marks-institutional/pdf-gen/' + uuid + '/' + lang + "/" + category;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


    generateInstallmentProcessPdf(uuid, lang: string) {
        const url = this.baseRmsRpmApiEndPoint + '/installment-process/pdf-gen/' + uuid + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }



    generateLinkupWithEvaluatorPdf(data, lang: string) {
        const url = this.baseRmsRpmApiEndPoint + 'linkup-proposal-with-evaluators/pdf-gen/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.post<any>(url, data, httpOptions);

    }



    generateEvaluatorGrantAmountPdf(uuid, lang: string) {
        const url = this.baseRmsRpmApiEndPoint + 'evaluator-grant-amount/pdf-gen/' + uuid + '/' + lang;
        const httpOptions = {
            'responseType': 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


}
