import {Component, OnInit, ViewChild} from '@angular/core';
import {NotificationsModel} from "../../../models/NotificationModel";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {FiscalYearServiceService} from "../../../../settings/services/fiscal-year-service.service";
import {ToastrService} from "ngx-toastr";
import {ResearcherProposalService} from "../../../services/researcher-proposal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserListServiceService} from "../../../../settings/services/user-list-service.service";
import {NotificationService} from "../../../services/notification.service";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {downloadIcon, noteIcon, previousIcon, printIcon, saveIcon} from '../../../constants/button.constants';
import {NotificationNoteModel} from "../../../models/NotificationNoteModel";
import {MatTableDataSource} from "@angular/material/table";
import {NotificationListComponent} from "../notification-list/notification-list.component";

@Component({
  selector: 'app-notification-note',
  templateUrl: './notification-note.component.html',
  styleUrls: ['./notification-note.component.scss']
})
export class NotificationNoteComponent implements OnInit {

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    saveIcon = saveIcon;

    /*----/Button---*/
    fiscalYearList: any[] = [];
    researchTitleNames: any[] = [];
    userList: any[] = [];
    notificationNoteModel: NotificationNoteModel = new NotificationNoteModel();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    isEditable: boolean = false;
    notificationId: string;
    fiscalYearId: number;
    formGroup: any;
    displayedColumns: string[] = ['userName', 'note', 'attendedStatus', 'submissionDate', 'action'];
    dataSource: any;

    emptyField: any = 'sdfsdf'
    recipientUserList: { 'note':null,'userId':null,'isAccept': false }[] = new Array();

    notificationNoteModelList: any[] = new Array();

    @ViewChild(NotificationListComponent) child;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private fiscalyearservice: FiscalYearServiceService,
                private _toastrService: ToastrService,
                private _researcherProposalService: ResearcherProposalService,
                private _router: Router,
                private userListService:UserListServiceService,
                private _activatedRoute: ActivatedRoute,
                private _notificationService: NotificationService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);


        this.notificationId = this._activatedRoute.snapshot.paramMap.get('id');
        // if (this.letterId != null) {
        //     this.isEditable = true;
        // }
        this.notificationNoteModelList.push({
            userId: 1,
            note: 1,
            isAccept: true,
            date: 12
        })
        this.dataSource = new MatTableDataSource(this.notificationNoteModelList);
    }

    ngOnInit(): void {
        this.getFiscalyearList()
        this. getUserList();
        if (this.isEditable) {
            // this.getLatterById();
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
        this._notificationService.saveNotificationNoteData(this.notificationId,this.notificationNoteModel).subscribe(data => {
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

        // console.log(this.notificationNoteModel)
        // if(!this.isEditable){
        //     // this._notificationService.saveData(this.notificationNoteModel).subscribe(data => {
        //     //     if (data.success) {
        //     //         this._router.navigate(['/notifications'])
        //     //         this._toastrService.success(data.message, "Success!", this.config);
        //     //     } else {
        //     //         this._toastrService.error(data.message, "Error!", this.config);
        //     //     }
        //     //     console.log(data)
        //     // }, error => {
        //     //     this._toastrService.error('Something went wrong!', "Error!", this.config);
        //     // })
        // }else{
        //     // this.latter.rmsUserSignatureId = this.latter.rmsUserSignatureId.id
        //     // console.log()
        //     // this._latterService.editData(this.letterId,this.latter).subscribe(data => {
        //     //     if (data.success) {
        //     //         this._router.navigate(['/letter/view/' + data.obj.id])
        //     //         this._toastrService.success(data.message, "Success!", this.config);
        //     //     } else {
        //     //         this._toastrService.error(data.message, "Error!", this.config);
        //     //     }
        //     //     console.log(data)
        //     // }, error => {
        //     //     this._toastrService.error('Something went wrong!', "Error!", this.config);
        //     // })
        // }

    }

    back(){
        this._router.navigate(['letter']);
    }

    editRow(element) {

    }

    openDialog(uuid: any) {

    }
}
