import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from "@angular/forms";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import {
    addNewIcon,
    dataNotFount,
    deleteFailed,
    deleteIcon,
    deleteSuccess,
    editIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveFailed,
    saveIcon,
    saveSuccess,
    sentSuccess,
    updateFailed,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import { ProposalModel } from 'app/main/modules/training-institute/models/proposal.model';
import {
    SubmitConfirmationDialogComponent
} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from 'rxjs';
import {
    FuseTranslationLoaderService
} from "../../../../../../../../core/services/translation-loader.service";
import {
    TrainersAcademicBackgroundListModel
} from "../../../../../../models/trainers-academic-background-list.model";
import { TrainersModel } from "../../../../../../models/trainers.model";
import { TrainersService } from "../../../../../../services/trainers.service";
import { locale as lngBangla } from "../../../../trainers/i18n/bn";
import { locale as lngEnglish } from "../../../../trainers/i18n/en";
@Component({
    selector: 'app-add-new-trainer',
    templateUrl: './add-new-trainer.component.html',
    styleUrls: ['./add-new-trainer.component.scss']
})
export class AddNewTrainerComponent implements OnInit, OnChanges {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @ViewChild('inputForm') inputForm: NgForm;
    @Input() existingProposal: ProposalModel;
    @Input() brodCastChange: BehaviorSubject<any>;
    canSave: boolean;
    existingProposalId: number;
    nextIcon = nextIcon;
    counter: number = 0;
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    deleteIcon = deleteIcon;
    previousIcon = previousIcon;
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
    trainersModel: TrainersModel = new TrainersModel();
    trainersAcademicBackgroundModel: TrainersAcademicBackgroundListModel = new TrainersAcademicBackgroundListModel();
    isUpdatedAction: boolean;
    userDetails: { id: null, userId: null, name: null, userType: null, emailId: null, designation: null, mobileNumber: null, isActive: false, isInstitutional: false };
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
        private _toastrService: ToastrService,
        private _trainersService: TrainersService,
        private dialog: MatDialog,
        private storageService: StorageService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userDetails = this.storageService.getUserData();
    }
    ngOnInit(): void {
        if (this.userDetails && this.userDetails.id) {
            this.getAllTrainerByUserIdNew(this.userDetails.id);
        }
       // this.getAllTrainersList();
       this.getTrainersList();
    }
    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposal': {
                        if (this.existingProposal.id) {
                            this.canSave = true;
                            this.existingProposalId = this.existingProposal.id;
                            this.getTrainersList();
                        }
                        if (this.existingProposal.trainingInstituteProfileModel) {
                            this.getAllTrainerByUserId(this.existingProposal.trainingInstituteProfileModel.id);
                        }
                        break;
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.existingProposalId = res.id;
                                this.getTrainersList();
                            }
                            if (res && res.trainingInstituteProfileModel) {
                                this.getAllTrainerByUserId(res.trainingInstituteProfileModel.id);
                            }
                        });
                        break;
                    }
                }
            }
        }
    }
    openDialog(rowUuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
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
                    this._toastrService.success(deleteSuccess, "Success", this.config);
                    this.getTrainersList();
                    this.existingProposal.id = this.existingProposalId;
                    this.brodCastChange.next({ ...this.existingProposal, msg: 'delete_success_fully' });
                }
            },
            error => {
                this.spinner5 = false;
                console.log('error ===== >>>>> ', error);
            }
        );
    }
    saveData() {
        this.trainersModel.proposalId = this.existingProposalId;
        this.trainersModel.fiscalYearId = this.existingProposal.fiscalYearId;
        if (this.trainersModel.id) {
            this.spinner = true;
            this._trainersService.updateTrainer(this.trainersModel).subscribe(
                res => {
                    this._toastrService.success(updateSuccess, "Success", this.config);
                    this.getTrainersList();
                    this.trainersModel = new TrainersModel();
                    this.existingProposal.id = this.existingProposalId;
                    this.brodCastChange.next(this.existingProposal);
                    this.spinner = false;
                },
                (err) => {
                    console.log('err ==== >>>>> ', err);
                    this.spinner = false;
                }
            );
        } else {
            this.spinner = true;
            this._trainersService.saveTrainer(this.trainersModel).subscribe(
                res => {
                    this._toastrService.success(saveSuccess, "Success", this.config);
                    this.getTrainersList();
                    this.trainersModel = new TrainersModel();
                    this.existingProposal.id = this.existingProposalId;
                    this.brodCastChange.next(this.existingProposal);
                    this.spinner = false;
                },
                (err) => {
                    console.log('err ==== >>>>> ', err);
                    this.spinner = false;
                }
            );
        }
    }
    getTrainersList() {

        this.spinner2 = true;
        this._trainersService.getTrainersList(this.page, this.size, this.existingProposalId).subscribe(res => {
            this.trainersList = []
            this.trainersList = res.content;
            this.trainersList.map(result => {
                result.active = result.active ? "Yes" : "No";
            })
            this.dataSource = new MatTableDataSource(this.trainersList);
            this.total = res.totalElements;
            this.spinner2 = false;
        });
    }
    getAllTrainersList() {
        if (!this.existingProposalId) {
            return;
        }
        this.spinner2 = true;
        this._trainersService.getByProposalId(this.existingProposalId).subscribe(res => {
            this.allTrainersList = res.items ? res.items : [];
            this.allTrainersList.map(result => {
                result.active = result.active ? "Yes" : "No";
            });
            console.log('allTrainersList ---- >>>> ', this.allTrainersList);
            this.spinner2 = false;
        });
    }
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getTrainersList();
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
        this.trainersModel = { ...element }
    }
    resetFrom() {
        this.trainersModel = new TrainersModel();
    }
    nextTab() {
        this.nextStep.emit(true);
    }
    previousTab(): void {
        this.backPrevious.emit(true);
    }
    onChangeTrainerName(getVal: any) {
        let filter = this.trainersList.filter(f => f.name === getVal);
        if (filter.length > 0) {
            this.trainersModel = new TrainersModel();
            this._toastrService.warning("Trainer already exist !.", "Warning", this.config);
            return;
        }
        let f = this.trainerListByProfile.find(f => f.name == getVal);
        if (f) {
            this.trainersModel.name = f.name;
            this.trainersModel.currentJobInstituteName = f.institute;
            this.trainersModel.currentPosition = f.designation;
            this.trainersModel.phone = f.mobileNo;
            if (f.gender == 'Female') {
                this.trainersModel.gender = 'FEMALE'
            }
            if (f.gender == 'Male') {
                this.trainersModel.gender = 'MALE'
            }
            if (f.gender == 'Other') {
                this.trainersModel.gender = 'OTHERS'
            }
            this.trainersModel.email = f.email;
            this.trainersModel.lastAcademicDegree = f.lastAcademicDeg;
        }
    }
    getAllTrainerByUserId(userId: any) {
        this.spinner3 = true;
        this._trainersService.getTrainerListFindByProfileId(userId).subscribe(
            (response) => {
                if (response.success && response.items) {
                    this.trainerListByProfile = response.items;
                }
                this.spinner3 = false;
            });
    }
    getAllTrainerByUserIdNew(userId: any) {
        this.spinner3 = true;
        this._trainersService.getTrainerListFindByUserId(userId).subscribe(
            (response) => {
                if (response.success && response.items) {
                    this.trainerListByProfile = response.items;
                }
                this.spinner3 = false;
            });
    }

    goToProfile(){

    }
}
