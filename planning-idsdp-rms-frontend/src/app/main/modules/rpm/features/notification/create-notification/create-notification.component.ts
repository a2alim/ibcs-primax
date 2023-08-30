import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { ToastrService } from "ngx-toastr";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { FiscalYearServiceService } from "../../../../settings/services/fiscal-year-service.service";
import { UserListServiceService } from "../../../../settings/services/user-list-service.service";
import { downloadIcon, noteIcon, previousIcon, printIcon, saveIcon, sendIcon } from '../../../constants/button.constants';
import { NotificationsModel } from "../../../models/NotificationModel";
import { NotificationService } from "../../../services/notification.service";
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";

@Component({
    selector: 'app-create-notification',
    templateUrl: './create-notification.component.html',
    styleUrls: ['./create-notification.component.scss']
})
export class CreateNotificationComponent implements OnInit {

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    saveIcon = saveIcon;
    sendIcon = sendIcon;

    /*----/Button---*/
    fiscalYearList: any[] = [];
    researchTitleNames: any[] = [];
    userList: any[] = [];
    notificationsModel: NotificationsModel = new NotificationsModel();
    spinner: Boolean = false;
    userDetails: { id: null, userId: null, name: null, userType: null, email: null, designation: null, mobileNumber: null, isActive: false, isInstitutional: false };
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    actionType: string = null;
    isEditable: boolean = false;
    notificationId: string;
    fiscalYearId: number;
    formGroup: any;

    emptyField: any = 'sdfsdf'
    recipientUserList: { 'note': null, 'userId': null, 'isAccept': false }[] = new Array();
    researcherProposalList: any[] = new Array();
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fiscalyearservice: FiscalYearServiceService,
        private _toastrService: ToastrService,
        private _router: Router,
        private userListService: UserListServiceService,
        private _activatedRoute: ActivatedRoute,
        private _notificationService: NotificationService,
        private storageService: StorageService,) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.notificationId = this._activatedRoute.snapshot.paramMap.get('id');
        this.actionType = this._activatedRoute.snapshot.params.actionType;
        this.userDetails = this.storageService.getUserData();
    }

    ngOnInit(): void {
        this.getFiscalyearList()
        this.getUserList();
        if (this.actionType == 'edit') {
            this.getNotificationById();
            this.isEditable = true;
        } else if (this.actionType == 'view') {
            this.getNotificationById();
        }
    }

    // getLatterById() {
    //     this._latterService.getLetterById(this.letterId).subscribe(value => {
    //         if (value.success) {
    //             this.notificationsModel = value.obj;
    //             this.fiscalYearId = value.obj.researcherProposalId.stFiscalYearId;
    //             this.notificationsModel.researcherProposalId = value.obj.researcherProposalId.id;
    //         }
    //     }, error => {
    //         this.toastr.error('Details not found!');
    //     })
    // }

    getUserList() {
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
            }
        );
    }

    getFiscalyearList() {
        this.fiscalyearservice.getAllActive().subscribe(
            res => {
                this.fiscalYearList = res.items ? res.items : [];
            }
        );
    }

    save() {
        if (!this.checkRequirdField()) {
            return;
        }
        
        this.notificationsModel.recipientUserId = ["1"]
        this.notificationsModel.recipientUserId.forEach(recipientUser => {
            this.recipientUserList.push({ 'note': null, 'userId': recipientUser, 'isAccept': false })
            console.log(recipientUser)
        });
        this.notificationsModel.recipientUserId = this.recipientUserList;
        if (!this.isEditable) {
            this._notificationService.saveData(this.notificationsModel).subscribe(data => {
                if (data.success) {
                    this._router.navigate(['/notifications'])
                    this._toastrService.success(data.message, "Success!", this.config);
                } else {
                    this._toastrService.error(data.message, "Error!", this.config);
                }
                console.log(data)
            }, error => {
                this._toastrService.error('Something went wrong!', "Error!", this.config);
            })
        } else {

            this._notificationService.updateData(this.notificationId, this.notificationsModel).subscribe(data => {
                if (data.success) {
                    this._router.navigate(['/notifications'])
                    this._toastrService.success(data.message, "Success!", this.config);
                } else {
                    this._toastrService.error(data.message, "Error!", this.config);
                }
                console.log(data)
            }, error => {
                this._toastrService.error('Something went wrong!', "Error!", this.config);
            })
        }
    }

    findResearcherNamesByFiscalYear(event: any) {
        this.researchTitleNames = this.researcherProposalList.filter(rp => rp.stFiscalYearId === event.value);
    }



    back() {
        this._router.navigate(['notifications']);
    }

    private getNotificationById() {
        this._notificationService.getNotificationById(this.notificationId).subscribe(data => {
            if (data.success) {
                this.notificationsModel = data.obj;
                this.notificationsModel.recipientUserId = data.obj.recipientUserId.map(m => m.userId);
                console.log(this.notificationsModel.recipientUserId)
            } else {
                this._toastrService.error(data.message, "Error!", this.config);
            }
            console.log(data)
        }, error => {
            this._toastrService.error('Something went wrong!', "Error!", this.config);
        })
    }

    getNameByUserId(id: number): any {

        console.log(this.userList.filter(res => res.id === id).map(m => m.name)[0])
        return this.userList.filter(res => res.id === id).map(m => m.name)
    }

    getFiscalYearByUserId(fiscalYearId: number): any {
        return this.fiscalYearList.filter(res => res.id === fiscalYearId).map(m => m.fiscalYear);
    }

    sendMail() {
        this.spinner = true;
        this._notificationService.sendNotifications(this.notificationId).subscribe(
            response => {
                if (response.success) {
                    this._toastrService.success('Send Successfully!', "", this.config);
                }

                if (!response.success) {
                    this._toastrService.error(response.message, "", this.config);
                }
                this.spinner = false;
            },
            error => {
                this._toastrService.error('Http error occurred!', "", this.config);
                this.spinner = false;
            }
        );
    }


    checkRequirdField(): Boolean {
        let isValied = true;
        if (!this.notificationsModel.sendTo || !this.notificationsModel.sendToMobile || !this.notificationsModel.sendToMobile || !this.notificationsModel.sendType || !this.notificationsModel.subject || !this.notificationsModel.details) {
            return isValied = false;
        }
        return isValied;
    }
}
