import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EffectImpactUrlConstant} from '../constants/effect-impact.url.constants';
import {EffectImpact} from '../models/effect-impact.model';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EffectImpactService {


    constructor(private _http: HttpClient) {
    }


    saveEffectImpact(effectImpact: EffectImpact): Observable<any> {
        return this._http.post(EffectImpactUrlConstant.CREATE_EFFECT_IMPACT, effectImpact);
    }

    saveEffectImpactAttachment(id: any, envClearenceAttachment: File): Observable<any> {
        const formData = new FormData();
        formData.append('envClearenceAttachment', envClearenceAttachment);
        formData.append('effectImpactId', id.toString());
        return this._http.post(EffectImpactUrlConstant.CREATE_EFFECT_IMPACT_ATTACHMENT, formData);
    }

    getEffectImpact(projectId) {
        return this._http.get(EffectImpactUrlConstant.GET_EFFECT_IMPACT + '/' + projectId).pipe(map((res: any) => {
            return res;
        }));
        ;
    }

    updateEffectImpact(projectId, model) {
        return this._http.put(EffectImpactUrlConstant.UPDATE_EFFECT_IMPACT + '/' + projectId, model).pipe(map((res: any) => {
            return res;
        }));
    }
}
