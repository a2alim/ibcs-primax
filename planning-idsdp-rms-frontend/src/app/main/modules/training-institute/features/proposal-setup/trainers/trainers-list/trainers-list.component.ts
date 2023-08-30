import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {EvaluatorsGrantAmountLetter} from "../../../../../rpm/models/EvaluatorsGrantAmountLetter";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../../core/constants/constant";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {
    RmsEvaluatorsGrantAmountLetterService
} from "../../../../../rpm/services/rms-evaluators-grant-amount-letter.service";
import {Router} from "@angular/router";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {PageEvent} from "@angular/material/paginator";
import {addNewIcon, emailIcon, pdfIcon} from 'app/main/modules/rpm/constants/button.constants';
import {TrainersService} from "../../../../services/trainers.service";
import {AuthService} from "../../../../../auth/services/auth.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {TrainersSendMailModalComponent} from "./trainers-send-mail-modal/trainers-send-mail-modal.component";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {
    dataNotFount,
    deleteFailed,
    deleteSuccess,
    saveFailed,
    saveSuccess,
    sentSuccess,
    updateFailed,
    updateSuccess,
    editIcon,
    refreshIcon,
    saveIcon,
    deleteIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {FormGroup, NgForm} from "@angular/forms";
import {ProposalModel} from "../../../../models/proposal.model";
import {BehaviorSubject} from "rxjs";
import {TrainersModel} from "../../../../models/trainers.model";
import {TrainersAcademicBackgroundListModel} from "../../../../models/trainers-academic-background-list.model";
import {StorageService} from "../../../../../../core/services/storage/storage.service";
import {TrainingInstituteProfileModel} from "../../../../models/training-institute-profile.model";
import {TrainingInstituteProfileService} from "../../../../services/training-institute-profile.service";


@Component({
    selector: 'app-trainers-list',
    templateUrl: './trainers-list.component.html',
    styleUrls: ['./trainers-list.component.scss']
})
export class TrainersListComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @ViewChild('inputForm') inputForm: NgForm;
    @Input() existingProposal: ProposalModel;
    @Input() brodCastChange: BehaviorSubject<any>;
    canSave: boolean;
    existingProposalId: number;
    counter: number = 0;
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    frmGroup: FormGroup;
    isReset: boolean = false;
    //Toast Config
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    displayedColumns: string[] = ['sl', 'trainersName', 'institute', 'currentPosition', 'mobileNo', 'email', 'action'];
    dataSource: MatTableDataSource<any>;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    //Variable
    trainersModel: any = {};
    trainersAcademicBackgroundModel: TrainersAcademicBackgroundListModel = new TrainersAcademicBackgroundListModel();
    isUpdatedAction: boolean;
    userDetails: {
        id: null,
        userId: null,
        name: null,
        userType: null,
        emailId: null,
        designation: null,
        mobileNumber: null,
        isActive: false,
        isInstitutional: false
    };
    fiscalYears: any[] = [];
    trainingInstitutes: any[] = [];
    trainersList: any[] = [];
    allTrainersList: any[] = [];
    trainerListByProfile: any[] = [];
    userList: any[] = [];
    tempTrainerId: any;
    fiscalYearId: any;
    trainerId: number;
    isEditable: boolean = false;
    courseScheduleId: any
    picReset: boolean = false;
    picReset2: boolean = false;
    spinner2: boolean;
    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;
    editIcon = editIcon;
    spinner: boolean;
    spinner1: boolean;
    spinner3: boolean;
    spinner4: boolean;
    spinner5: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private route: Router,
                private _authService: AuthService,
                private _trainersService: TrainersService,
                private dialog: MatDialog,
                private _toastService: ToastrService,
                private storageService: StorageService,
                private _trainingInstituteProfileService: TrainingInstituteProfileService,
    ) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userDetails = this.storageService.getUserData();
    }

    ngOnInit(): void {
        if (this.userDetails && this.userDetails.id) {
            this.getAllTrainerByUserIdNew(this.userDetails.id);
            this.getProfile();
        }
    }

    getProfile() {
        this.spinner = true;
        this._trainingInstituteProfileService.getProfileViewById(this.userDetails.id).subscribe(
            res => {
                let trainingInstituteProfile: TrainingInstituteProfileModel = new TrainingInstituteProfileModel();
                Object.assign(trainingInstituteProfile, res);
                // this.trainersModel.profileModel = { ...trainingInstituteProfile };
                this.trainersModel.profileId = trainingInstituteProfile.id;
                this.spinner = false;
            },
            err => {
                console.log(err);
                this.spinner = false;
            }
        );
    }

    openDialog(rowUuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteRow(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    deleteRow(i) {
        this.spinner5 = true;
        this._trainersService.deleteTrainers(i).subscribe(
            response => {
                if (response.success) {
                    this.spinner5 = false;
                    this._toastService.success(deleteSuccess, "Success", this.config);
                    this.existingProposal.id = this.existingProposalId;
                    this.brodCastChange.next({...this.existingProposal, msg: 'delete_success_fully'});
                }
            },
            error => {
                this.spinner5 = false;
                console.log('error ===== >>>>> ', error);
            }
        );
    }

    saveData() {
        this._trainersService.saveData(this.trainersModel).subscribe(res => {
            if (res.success) {
                this._toastService.success('Save Successfully');
                this.getAllTrainerByUserIdNew(this.userDetails.id);
            }
        })
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
    }

    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        }
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    editRow(element) {
        this.trainersModel = {...element}
    }

    resetFrom() {
        this.trainersModel = new TrainersModel();
    }

    getAllTrainerByUserIdNew(userId: any) {
        this.spinner = true;
        this._trainersService.getTrainerListFindByUserId(userId).subscribe(
            (response) => {
                if (response.success && response.items) {
                    this.dataSource = new MatTableDataSource<any>(response.items);
                }
                this.spinner = false;
            });
    }
}
