import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {MatButton} from '@angular/material/button';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Message} from 'app/layout/common/messages/messages.types';
import {MessagesService} from 'app/layout/common/messages/messages.service';
import {WebsocketService} from "./websocket.service";
import {UserProfileService} from "../../../main/modules/auth/services/user.profile.service";
import {UserGroupService} from "../../../main/modules/configuration-management/services/user-group.service";
import {NotificationEventEnum} from "./notification-event.enum";

export class MessageResponse {
    id: string;
    icon?: string;
    image?: string;
    title?: string;
    description?: string;
    time: string;
    link?: string;
    useRouter?: boolean;
    read: boolean;
}

@Component({
    selector       : 'messages',
    templateUrl    : './messages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'messages'
})
export class MessagesComponent implements OnInit, OnChanges, OnDestroy
{
    @Input() messages: Message[];
    @ViewChild('messagesOrigin') private _messagesOrigin: MatButton;
    @ViewChild('messagesPanel') private _messagesPanel: TemplateRef<any>;

    messageHubRequest: any = {};
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    messageResponse: MessageResponse = new MessageResponse();
    userId: any = 0;
    userName: string = '';
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _messagesService: MessagesService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private websocketService: WebsocketService,
        private userService: UserProfileService,
        private userGroupService: UserGroupService,
    )
    {
        this.userService.getUserProfileInfo().subscribe(res => {
            this.userId = res.userId;
            this.userName = res.name;
            this._messagesService.getMessageByUserId(this.userId).subscribe();
            this.eventConsumeBySpecificUser();
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Messages
        if ( 'messages' in changes )
        {
            // Store the messages on the service
            this._messagesService.store(changes.messages.currentValue);
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to message changes
        this._messagesService.messages$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((messages: Message[]) => {

                // Load the messages
                this.messages = messages;

                // Calculate the unread count
                this._calculateUnreadCount();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._overlayRef )
        {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the messages panel
     */
    openPanel(): void
    {
        // Return if the messages panel or its origin is not defined
        if ( !this._messagesPanel || !this._messagesOrigin )
        {
            return;
        }

        // Create the overlay if it doesn't exist
        if ( !this._overlayRef )
        {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._messagesPanel, this._viewContainerRef));
    }

    /**
     * Close the messages panel
     */
    closePanel(): void
    {
        this._overlayRef.detach();
    }

    /**
     * Mark all messages as read
     */
    markAllAsRead(): void
    {
        // Mark all as read
        this._messagesService.markAllAsRead(this.userId).subscribe();
    }

    /**
     * Toggle read status of the given message
     */
    toggleRead(message: Message): void
    {
        // Toggle the read status
        message.read = !message.read;

        // Update the message
        this._messagesService.update(message.id, message).subscribe();
    }

    /**
     * Delete the given message
     */
    delete(message: Message): void
    {
        // Delete the message
        this._messagesService.delete(message.id, this.userId).subscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void
    {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._messagesOrigin._elementRef.nativeElement)
                                  .withLockedPosition()
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void
    {
        let count = 0;

        if ( this.messages && this.messages.length )
        {
            count = this.messages.filter(message => !message.read).length;
        }

        this.unreadCount = count;
    }

    eventConsumeByClient(): void {
        let client = this.websocketService._connect();
        client.connect({}, (frame: any) => {
            client.subscribe('/topic/notification', (notifications: any) => {
                if(notifications) {
                    this.eventResponse(notifications);
                }
            });
        });
    }

    eventConsumeBySpecificUser(): void {
        /* connect to the socket server */
        let client = this.websocketService._connect();
        client.connect({}, (frame: any) => {
            client.subscribe('/user/'+  this.userId + '/topic/notification', (notifications: any) => {
                if(notifications) {
                    this.eventResponse(notifications);
                }
            });
        });
    }


    eventResponse(notifications: any): void {
        this.messageResponse = JSON.parse(notifications.body);
        const modal = {} as Message;
        modal.id = this.messageResponse.id;
        modal.title = this.messageResponse.title;
        modal.read = false;
        modal.image = "assets/images/logo/bd.png";
        modal.time = Date.now().toString();
        modal.description = this.messageResponse.description;

        /** Get how many tabs are open by user */
        let tabs = Object.keys( JSON.parse(localStorage.getItem('TabsOpen') || '{}'));
        /** Current Tab*/
        const currentTabs = sessionStorage.getItem("TabUuid");
        /** notification open for first tab*/
        if(currentTabs == tabs[0]) {
            this._messagesService.getMessageByUserId(this.userId).subscribe();
            this.notificationPopUpShow(modal);
        }
    }

    notify() {

    }

    notificationPopUpShow(message: Message): any {
        if(Notification.permission == 'granted') {
            this.customNotificationMessage(message);
        }

        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then( (permission) => {
                if (permission === 'granted') {
                    this.customNotificationMessage(message);
                } else {
                    console.log('Notification permission denied.');
                }
            });
        }
    }


    customNotificationMessage(message: Message): any {
        const notification = new Notification(message.title, {
            body: message.description,
            icon: message.image
        });

        // Handle click event
        notification.addEventListener("click", function () {
            // window.location.href = 'https://www.google.com';
        });
    }
}
