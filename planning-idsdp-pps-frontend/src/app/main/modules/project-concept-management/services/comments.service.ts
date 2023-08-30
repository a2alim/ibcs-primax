import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {Observable} from 'rxjs';
import {COMMENTS, GET_BY_OBSERVER} from '../constants/comments.constant';
import {IComments} from '../models/comments';

@Injectable({
    providedIn: 'root'
})
export class CommentsService extends CrudRequestService<IComments> {

    constructor(private http: HttpClient) {
        super(http, COMMENTS);
    }

    getCommentsByObserver(data: {sourceId: number, source: string, observer: string}): Observable<IComments[]> {
        return this.http.post<IComments[]>(this._BASE_URL + GET_BY_OBSERVER, data);
    }

}
