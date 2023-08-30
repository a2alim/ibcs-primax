import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { ProposalModel } from "../models/proposal.model";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api/api.service";
@Injectable({
    providedIn: 'root'
})
export class ProposalService {
    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient, private apiService: ApiService,) {
    }

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    getCommonTypeList(page, pageSize): Observable<any> {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/common-type/get-list/' + page + '/' + pageSize;
        return this.apiService.get(api);
    }


    updateData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/update-fiscal-year-unique';
        return this.apiService.update(url, data);

    }

    getProposals(size: number, page: number): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "proposals?pageNo=" + page + "&pageSize=" + size);
    }  

    getAllProposalList(uuid): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "proposals/view-listData/" + uuid);
    }

    createProposal(proposalModel: ProposalModel): Observable<any> {
        return this.http.post(this.baseTiEndPoint + "proposals/save-proposal", proposalModel);
    }

    editProposal(proposalModel: ProposalModel): Observable<any> {
        return this.http.put(this.baseTiEndPoint + "proposals/update-proposal", proposalModel);
    }

    deleteProposal(proposalId: number) {
        return this.http.delete(this.baseTiEndPoint + "proposals/" + proposalId);
    }

    getProposalById(proposalId: number) {        
        return this.http.get<ProposalModel>(this.baseTiEndPoint + "proposals/" + proposalId);
    }



    submitProposal(proposalId: number) {
        return this.http.put(this.baseTiEndPoint + "proposals/" + proposalId + '/submit', null);
    }

    getProposalsByParticipantId(participantId: number) {
        return this.http.get<any[]>(this.baseTiEndPoint + "/public/participants/" + participantId);
    }

    getProposalsByFiscalYear(fiscalYearId: number): any {
        return this.http.post<any>(this.baseTiEndPoint + "proposals/find-by-fiscal-year-id", { fiscalYearId: fiscalYearId });
    }
}
