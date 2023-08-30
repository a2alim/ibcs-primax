import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, ReplaySubject} from 'rxjs';
import {Message} from 'app/layout/common/messages/messages.types';
import {notificationEndPoint} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private newMessage: any = [];
    private _messages: ReplaySubject<Message[]> = new ReplaySubject<Message[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for messages
     */
    get messages$(): Observable<Message[]> {
        return this._messages.asObservable();
    }

    /**
     *  Get message by user id
     * */
    getMessageByUserId(id: string): Observable<any> {
        const url = notificationEndPoint + `api/v1/notification-message/${id}`;
        this._httpClient.get<any>(url).subscribe( res => {
            this.newMessage = res;
            this._messages.next(this.newMessage);
        });
        return of(true);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Store messages on the service
     *
     * @param messages
     */
    store(messages: Message[]): Observable<Message[]> {
        // Load the messages
        this._messages.next(messages);

        // Return the messages
        return this.messages$;
    }

    /**
     * Create a message
     *
     * @param message
     */
    create(message: Message): Observable<boolean>
    {
       this.newMessage.push(message);
        // Update the messages with the new message
        this._messages.next(this.newMessage);

        return of(true);
    }

    /**
     * Update the message
     *
     * @param id
     * @param message
     */
    update(id: string, message: Message): Observable<any> {
        // Find the index of the updated message
        const index = this.newMessage.findIndex(item => item.id === id);

        // Update the message
        this.newMessage[index] = message;

        // Update the messages
        this._messages.next(this.newMessage);

        // Return the updated message
        const url = notificationEndPoint + `api/v1/notification-message`;
        return this._httpClient.put(url, message);
    }

    /**
     * Delete the message
     *
     * @param messageId
     * @param userId
     */
    delete(messageId: string, userId: any): Observable<any> {
        const index = this.newMessage.findIndex(item => item.id === messageId);

        // Delete the message
        this.newMessage.splice(index, 1);

        // Update the messages
        this._messages.next(this.newMessage);

        const url = notificationEndPoint + `api/v1/notification-message/${userId}/${messageId}`;
        return this._httpClient.delete(url);
    }

    /**
     * Mark all messages as read
     */
    markAllAsRead(userId: string): Observable<any> {
        // Go through all messages and set them as read
        this.newMessage.forEach((message, index) => {
            this.newMessage[index].read = true;
        });

        // Update the messages
        this._messages.next(this.newMessage);

        // Return the updated status
        const url = notificationEndPoint + `api/v1/notification-message/mark-all-read/${userId}`;
        return this._httpClient.get(url);
    }
}
