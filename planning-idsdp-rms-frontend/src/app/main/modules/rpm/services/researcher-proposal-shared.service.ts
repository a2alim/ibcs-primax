import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class ResearcherProposalSharedService {

    private behaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    observable$ = this.behaviorSubject.asObservable();
    private data: any = {};

    constructor() { }

    setData(option, value) {
        this.data[option] = value;
        this.behaviorSubject.next(this.data);
    }

}
