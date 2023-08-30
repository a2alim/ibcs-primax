import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {IntroductionModel} from '../models/introduction.model';
import {HttpClient} from '@angular/common/http';
import {INTRODUCTION} from '../constants/introduction.constant';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntroductionService extends CrudRequestService<IntroductionModel> {

    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, INTRODUCTION);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    getIntroductionByFsrMasterId(fsrMasterId: number): any {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'introduction/getIntroduction' + '/' + fsrMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
