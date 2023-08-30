import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({ providedIn: 'root'})
export class LayoutHelperService {

    private subject = new Subject<'bn' | 'en'>();
    private navLanguage = new BehaviorSubject('en');
    currentLanguage = this.navLanguage.asObservable();

    setLanguageEvent(lan: 'bn' | 'en'){
        this.subject.next(lan);
    }

    getLanguageEvent():Observable<'bn' | 'en'>{
        return this.subject.asObservable();
    }

    changeNavLanguage(lang){
        this.navLanguage.next(lang);
    }
}
