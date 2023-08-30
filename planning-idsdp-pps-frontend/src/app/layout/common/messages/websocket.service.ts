import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client'
import {UserProfileService} from "../../../main/modules/auth/services/user.profile.service";
import {Injectable} from "@angular/core";
import {environment, notificationEndPoint} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    stompClient: any;

    _connect() {
        let socket = new SockJS(notificationEndPoint + `socket`);
        this.stompClient = Stomp.over(socket);
        return this.stompClient;
    }

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    /** send data to web server by using socket js*/
    _send(model: any) {
        this.stompClient.send("/app/sendMessage", {}, JSON.stringify(model));
    }


}
