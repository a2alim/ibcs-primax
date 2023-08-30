import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { IDppLocationWiseCostBreakdown } from '../models/dpp-location-wise-cost-breakdown.model';
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";


@Injectable({
    providedIn: 'root'
})

export class DppLocationWiseBreakdownServiceService extends CrudRequestService<IDppLocationWiseCostBreakdown>{

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.ibcs.ppsRdppRtappBackendPoint + 'locationWiseBreadown/');
    }

}
