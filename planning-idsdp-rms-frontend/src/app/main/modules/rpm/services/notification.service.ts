import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiService } from "../../../core/services/api/api.service";
//import notification = CKEDITOR.plugins.notification;


@Injectable(
    {
        providedIn: 'root'
    }
)
export class NotificationService {

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private apiService: ApiService, private _httpClient: HttpClient) {

    }


    saveData(data): Observable<any> {
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/notifications', data);
    }

    sendNotifications(notificationId): Observable<any> {
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/notifications/send-notification/' + notificationId, {});
    }

    editData(letterId, data): Observable<any> {
        return this.apiService.update(this.baseRmsRpmApiEndPoint + 'api/latter/' + letterId + '/update', data);
    }

    getList(): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + 'api/notifications');
    }

    deleteNotification(id: string): Observable<any> {
        return this.apiService.delete(this.baseRmsRpmApiEndPoint + 'api/notifications/delete/', id);
    }


    getNotificationById(notificationId: any): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + 'api/notifications/' + notificationId);
    }

    updateData(notificationId: string, notificationsModel: any): Observable<any> {
        return this._httpClient.put(this.baseRmsRpmApiEndPoint + 'api/notifications/' + notificationId, notificationsModel);
    }

    saveNotificationNoteData(notificationId: any, notificationNoteModel: any): Observable<any> {
        return this._httpClient.put(this.baseRmsRpmApiEndPoint + 'api/notifications/' + notificationId + '/note', notificationNoteModel);
    }
}
