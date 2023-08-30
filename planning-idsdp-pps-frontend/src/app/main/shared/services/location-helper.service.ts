import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({ providedIn: 'root'})
export class LocationHelperService {

    private subject = new Subject<any>();

    setProjectLocationEvent(){
        this.subject.next();
    }

    getProjectLocationEvent():Observable<any>{
        return this.subject.asObservable();
    }
}
