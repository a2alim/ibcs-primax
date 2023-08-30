import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ModuleModel} from '../models/module.model';
import { MODULE_LIST } from '../constants/modules.constant';


@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    baseUrl = '';

    constructor(private http: HttpClient) {
    }

    getModuleList(): Observable<ModuleModel> {
        return this.http.get<ModuleModel>(MODULE_LIST);
    }

}
