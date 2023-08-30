import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
    providedIn: 'root'
})
export class DppAnnexureGoods {

    private BASE_API_URL: string = environment.ibcs.configurationApiEndPoint;

    constructor(private http: HttpClient) {
    }


    public getProjectTotalCost(): Observable<any> {

        const projectCost = [
            {
                id: '1',
                total: 'GoB',
                projectAmount: '0.00',
            },
            {
                id: '2',
                total: '(FE)',
                projectAmount: '(0.00)',
            },
            {
                id: '3',
                total: 'PA',
                projectAmount: '0.00',
            }
        ];
        return of(projectCost);
    }

}
