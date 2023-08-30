import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TappProjectSummeryHelperService {

    public projectSummaryCreateId: number = 0;
    public projectSummaryUuid: string = '';
    public objectiveCostCreateId: number = 0;
    public objectiveCostUuid: string = '';

}
