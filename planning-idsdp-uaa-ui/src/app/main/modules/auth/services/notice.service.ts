import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { NoticeModel } from '../model/notice-model.model';
import { NoticeReqModel } from '../model/notice-req.model';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  
  BASE_URL : string = environment.ibcs.baseApiEndPoint;
  IMS_NOTICE_SEARCH_LIST_URL : string = `${this.BASE_URL}api/notice/search-by-notice`;
  IMS_NOTICE_LIST_URL : string = `${this.BASE_URL}api/notice/search-by-notice`;

  

  constructor(private http: HttpClient,) { }

  getNoticeSearchList(srsObj): any {
    return this.http.post(this.IMS_NOTICE_SEARCH_LIST_URL, srsObj);
  }

  // getAllNoticeList(reqData: NoticeReqModel): any{
  //   return this.http.post(this.IMS_NOTICE_LIST_URL, reqData);
  // }
  
  getAllNoticeList(reqData): any{
    return this.http.post(this.IMS_NOTICE_LIST_URL, reqData);
  }






}
