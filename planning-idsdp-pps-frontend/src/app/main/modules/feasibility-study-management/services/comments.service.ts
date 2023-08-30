import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {HttpClient} from '@angular/common/http';
import {IComments} from '../models/comments';
import {COMMENTS, GET_BY_OBSERVER} from '../constants/comments.constant';
import {Observable} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CommentsService extends CrudRequestService<IComments> {

    constructor(private http: HttpClient) {
        super(http, COMMENTS);
    }

    getCommentsByObserver(comment: string): Observable<IComments[]> {
        return this.http.post<IComments[]>(this._BASE_URL + GET_BY_OBSERVER, {value: comment});
    }
}
