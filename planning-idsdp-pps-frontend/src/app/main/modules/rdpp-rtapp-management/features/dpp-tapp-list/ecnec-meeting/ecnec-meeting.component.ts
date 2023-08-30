import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {IMinistryDivision} from "../../../../configuration-management/models/ministry-divisiont";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {AgencyService} from "../../../../configuration-management/services/agency.service";
import {MinistryDivisionService} from "../../../../configuration-management/services/ministry-division.service";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {
    ERROR, FAILED_DELETE,
    FAILED_SAVE,
    FAILED_UPDATE,
    OK, SUCCESSFULLY_DELETED,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_UPDATED
} from "../../../../../core/constants/message";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {MatTimepickerModule} from "mat-timepicker";
import {EcnecMeetingModel} from "../../../models/ecnec-meeting.model";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
import {ActivatedRoute} from "@angular/router";
import {AssignEcnecMeetingListModel} from "../../../models/assign-ecnec-meeting-list.model";
import {locale as lngEnglish} from "../../../../project-concept-management/features/project-concepts/ecnec-dashboard/i18n/en";
import {locale as lngBangla} from "../../../../project-concept-management/features/project-concepts/ecnec-dashboard/i18n/bn";
import { FileUploadService } from 'app/main/core/services/file-upload.service';
import { snakeCase } from 'lodash';
import { EcnecMeetingService } from '../../../services/ecnec-meeting.service';
import { AssingEcnecMeetingService } from '../../../services/assign-ecnec-meeting.service';


@Component({
  selector: 'app-ecnec-meeting',
  templateUrl: './ecnec-meeting.component.html',
  styleUrls: ['./ecnec-meeting.component.scss']
})
export class EcnecMeetingComponent extends UnsubscribeAdapterComponent implements OnInit {
    
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;    
    @ViewChild('attachmentDialog') attachmentDialog: TemplateRef<any>;

    form: FormGroup;
    modeNameList = [
        {meetingVenue: 'একনেক সভাকক্ষ'},
    ];
    displayedColumns: string[] = ['sl', 'meetingName', 'meetingDate', 'meetingTime', 'meetingVenue', 'status', 'action'];
    displayedColumnsEcnec: string[] = ['sl', 'projectName', 'total', 'gob', 'ownFund', 'other'];
    displayedColumns2Ecnec: string[] = ['thSl', 'thProjectName', 'thProjectCost'];
    dataSource: MatTableDataSource<EcnecMeetingModel>;
    ministryDivisions: IMinistryDivision[] = [];
    // ministryDivisions: IOption[] = [];
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    ecnecMeetingModel: EcnecMeetingModel = {} as EcnecMeetingModel;
    projectListDataSource: MatTableDataSource<AssignEcnecMeetingListModel>;
    private meetingId: number;
    private meetingName: string;


    actionPermission = [];
    spinner: boolean = false;

    //==== for attachment file ====== 
    formGroup: FormGroup;
    formBuilder: FormBuilder;
    file: File;
    attachmentObj: any;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: AgencyService,
        public numberPipe : NumberPipe,
        private ecnecMeetingService: EcnecMeetingService,
        private ministryDivisionService: MinistryDivisionService,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private assignMeetingService : AssingEcnecMeetingService,
        private fileUploadService: FileUploadService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        let uuid = this.activeRoute.snapshot.paramMap.get('id');
        this.getEcnecMeeting();
        if(uuid){
            this.ecnecMeetingfindByUuid(uuid);
        }
    }


    ecnecMeetingfindByUuid(uuid) {
        this.ecnecMeetingService.getByUuid(uuid).subscribe(res => {
            this.ecnecMeetingModel = res;
            this.edit(this.ecnecMeetingModel);
        })
    }

    // For initializing form
    private populateForm() {
        this.form = new FormGroup({
            id: new FormControl(''),
            uuid: new FormControl(''),
            meetingName: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            meetingDate: new FormControl('', ),
            meetingTime: new FormControl(''),
            meetingVenue: new FormControl('একনেক সভাকক্ষ'),
            status: new FormControl(true)

        });
    }


    // For getting all agency list
    getEcnecMeeting() {
        this.subscribe$.add(
            this.ecnecMeetingService.getAllEcnecMeeting(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'সক্রিয়' : 'নিষ্ক্রিয়'})));
                this.total = res.totalElements;
                this.populateForm();
            })
        );
    }

    // For calling creat or Update for save
    onSubmit() {
        (this.form.value.uuid) ? this.update() : this.create();
    }


    // For creating Agency
    private create() {
        this.subscribe$.add(
            this.ecnecMeetingService.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                    this.getEcnecMeeting();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_SAVE, ERROR);
                }
            })
        );
    }


    // For updating  Agency
    private update() {
        this.subscribe$.add(
            this.ecnecMeetingService.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.getEcnecMeeting();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
    }

    //  Setting form patch value for update
    edit(row: EcnecMeetingModel) {
        this.disableDelete = true;
        this.form.patchValue({
            uuid: row.uuid,
            meetingName: row.meetingName,
            description: row.description,
            meetingDate: row.meetingDate,
            meetingTime: row.meetingTime,
            meetingVenue: row.meetingVenue,
            status: row.status,

        });

    }


    // For deleting Agency
    delete(row: EcnecMeetingModel) {
        this.subscribe$.add(
            this.ecnecMeetingService.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getEcnecMeeting();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
                }
            })
        );
    }


    // For searching from list
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    // For calling list during page change
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getEcnecMeeting();
    }


    // For reset form
    reset() {
        this.form.reset();
        this.disableDelete = false;
        this.form.patchValue({
            status: true,
            meetingVenue: 'একনেক সভাকক্ষ'
        });
        this.loadFormGroup();
    }

    // For opening confirmation dialog before delete, create and update
    private openDialog(type: 's' | 'u' | 'd', row?: EcnecMeetingModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: (type === 's') ? ConfirmDialogConstant.SAVE_CONFIRMATION :
                (type === 'u') ? ConfirmDialogConstant.UPDATE_CONFIRMATION  : ConfirmDialogConstant.DELETE_CONFIRMATION };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                (type === 's') ? this.create() : (type === 'u') ? this.update() : this.delete(row);
            }
            dialogRef.close(true);
        });
    }

    goBackToHome() {
        window.history.back();
    }

    openDialogProjectList(meetingId, meetingName) {
        this.meetingName = meetingName;
        this.getProjectListByMeetingId(meetingId);
        const dialogRef = this.dialog.open(this.callAPIDialog, {
            height: 'auto',
            width: '1100px',
            position: {
                top: '10vh',
                left: '12vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
        });
    }

    closeDialog() {
        this.dialog.closeAll();
        this.projectListDataSource = new MatTableDataSource();
    }

    getProjectListByMeetingId(meetingId: number){
        this.spinner = true;
        this.assignMeetingService.getProjectListByMeetingId(meetingId).subscribe(res =>{
            this.projectListDataSource = new MatTableDataSource(res);
            this.meetingId = meetingId;
            this.spinner = false;
        }, error => this.spinner = false);
    }

    //==== for file attachment ===========
    loadFormGroup() {
        this.formGroup = this.formBuilder.group({
            attachmentId: [''],
        });
    }

    uploadFile(files: FileList) {
        this.file = files.item(0);
    }
    
    openAttachmentDialog(data: any) {
        this.attachmentObj = data;
        const dialogRef = this.dialog.open(this.attachmentDialog, {
            height: '300px',
            width: '500px',
            position: {
                top: '15vh',
                left: '35vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
            // this.formGroup.reset();
            // this.dialog.closeAll();
        });
    }

    cancelAttachmentUpload() {
        this.dialog.closeAll();
    }

    saveFile(): any {
        if(!this.file){
            this.snackbarHelper.openErrorSnackBarWithMessage('Please select attachment!','ERR');
            return;
        }
        this.spinner = true;
        this.fileUploadService.uploadFileDppService(this.file).subscribe(
            res => {
                if(res){
                    this.attachmentObj.fileUrl = res.pathUrl;
                    this.ecnecMeetingService.update(this.attachmentObj).subscribe(resp => {
                        if (resp) {
                            this.spinner = false;
                            this.file = null;
                            this.snackbarHelper.openSuccessSnackBarWithMessage('Attachment upload Successfully', 'Ok');
                            this.getEcnecMeeting();
                        }
                    })
                    this.formGroup.reset();
                    this.dialog.closeAll();
                }else{
                    this.snackbarHelper.openErrorSnackBarWithMessage('Attachment upload failed', 'Ok');
                }
                this.spinner = false;
            }, 
            err => {
                this.snackbarHelper.openErrorSnackBarWithMessage('Attachment upload failed', 'Ok');
                this.spinner = false;
                console.log('error log', err);
            }
        );
    }

    /* download Attachment */
    download(data: any) {
        if(data.fileUrl){
            this.fileUploadService.downloadAttachmentInDppService(data.fileUrl);
        }else{
            this.snackbarHelper.openErrorSnackBarWithMessage('Please attachment upload first!','ERR')
        }
    }



}
