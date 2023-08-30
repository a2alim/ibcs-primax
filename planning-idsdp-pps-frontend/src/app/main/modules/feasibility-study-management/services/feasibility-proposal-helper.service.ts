import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeasibilityProposalHelperService {
    public feasibilityProposalCreateId: number = 0;
    public feasibilityReportCreateId: number = 0;
    public feasibilityUpdate: boolean;
}
