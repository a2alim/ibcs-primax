import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { TrainingBudgetModel } from "../models/training-budget.model";
import { PaginationResponse } from "../models/pagination-response.model";

@Injectable({
    providedIn: 'root'
})
export class BudgetService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    getListData(pageSize: number, page: number, proposalId: number) {
        return this.http.get<PaginationResponse<any[]>>(
            this.baseTiEndPoint + "research-budgets?pageNo=" + page + "&pageSize=" + pageSize + "&proposalId=" + proposalId);
    }

    getResearchBudgetByFiscalYear(fiscalYearId: number) {
        return this.http.get<any[]>(
            this.baseTiEndPoint + "research-budgets/fiscal-year/" + fiscalYearId);
    }

    createBudget(researchBudget: TrainingBudgetModel) {
        return this.http.post(this.baseTiEndPoint + "research-budgets", researchBudget)
    }

    editBudget(id: number, researchBudget: TrainingBudgetModel) {
        return this.http.put(this.baseTiEndPoint + "research-budgets/" + id, researchBudget);
    }

    deleteBudget(id) {
        return this.http.delete(this.baseTiEndPoint + "research-budgets/" + id);
    }

    getResearchBudgetByProposalId(proposalId: number) {
        return this.http.get<any[]>(
            this.baseTiEndPoint + "research-budgets/proposal-id/" + proposalId);
    }
}
