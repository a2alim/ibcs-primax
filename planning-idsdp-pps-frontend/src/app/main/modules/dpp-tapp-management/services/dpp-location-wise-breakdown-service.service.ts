import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { DppLocationWiseBreakdown } from '../models/dpp-location-wise-cost-breakdown.model';


@Injectable({
    providedIn: 'root'
})

export class DppLocationWiseBreakdownService extends CrudRequestService<DppLocationWiseBreakdown>{

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.ibcs.ppsDppBackendPoint + 'locationWiseBreadown/');
    }

}
