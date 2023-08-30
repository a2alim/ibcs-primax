import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {HttpClient} from '@angular/common/http';
import {FS_SUMMARY} from '../constants/feasibility-study-summary.constant';
import {FsSummaryModel} from '../models/feasibility-study-summary.model';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {FsLinkWithDppModel} from "../../dpp-tapp-management/models/FsLinkWithDpp.model";

@Injectable({
  providedIn: 'root'
})
export class FeasibilityStudySummaryService extends CrudRequestService<FsSummaryModel> {

  constructor(private http: HttpClient) {
      super(http, FS_SUMMARY);
  }

  getFsSummaryByPcUuid(pcUuid: any): any {
      const url: string = environment.ibcs.ppsFsBaseEndPoint + 'fs-summary/getFsSummary' + '/' + pcUuid;
      return this.http.get(url).pipe(map((res: any) => {
            return res;
      }));
  }

  getFsSummaryList(): any {
      const url: string = environment.ibcs.ppsFsBaseEndPoint + 'fs-summary/get-list';
      return this.http.get(url).pipe(map((res: any) => {
            return res;
      }));
  }

  linkDppWithFs(fsLinkWithDppModel: FsLinkWithDppModel) {
      const url: string = environment.ibcs.ppsFsBaseEndPoint + 'fs-summary/link-Fs-With-Dpp';
      return this.http.post(url, fsLinkWithDppModel).pipe(map((res: any) => {
          return res;
      }));
  }

  getFsReportListWhichNotLinkWithDpp() {
      const url: string = environment.ibcs.ppsFsBaseEndPoint + 'fs-summary/getFsReportListWhichNotLinkWithDpp';
      return this.http.get(url).pipe(map((res: any) => {
          return res;
      }));
  }

  getFsReportList(fsUuid: string) {
      fsUuid ? fsUuid = fsUuid : fsUuid = null;
    const url: string = environment.ibcs.ppsFsBaseEndPoint + 'fs-summary/getFsReportList/';
    return this.http.get(url+fsUuid).pipe(map((res: any) => {
        return res;
    }));
  }

}
