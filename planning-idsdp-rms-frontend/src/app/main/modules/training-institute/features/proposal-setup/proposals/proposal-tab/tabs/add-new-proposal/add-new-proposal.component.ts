import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { locale as lngEnglish } from "../../../i18n/en";
import { locale as lngBangla } from "../../../i18n/bn";
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    dataNotFount,
    deleteFailed,
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
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from "../../../../../../services/proposal.service";
import { ConfigurationService } from "../../../../../../../settings/services/configuration.service";
import { TrainersService } from "../../../../../../services/trainers.service";
import { TrainingInstituteProfileService } from "../../../../../../services/training-institute-profile.service";
import { TrainingInstituteProfileModel } from "../../../../../../models/training-institute-profile.model";
import { ProposalModel } from "../../../../../../models/proposal.model";
import { DateAdapter } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
import { ERROR, OK } from 'app/main/core/constants/message';
import { MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';

@Component({
    selector: 'app-add-new-proposal',
    templateUrl: './add-new-proposal.component.html',
    styleUrls: ['./add-new-proposal.component.scss']
})

export class AddNewProposalComponent implements OnInit, OnChanges {

    @ViewChild('ti', { static: true }) inputTi: ElementRef;
    @Input() brodCastChange: BehaviorSubject<any>
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Input() existingProposal: ProposalModel;


    spinner: boolean;
    spinner1: boolean;
    spinner2: boolean;
    spinner3: boolean;
    spinner4: boolean;
    spinner5: boolean;

    //Icon
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    editIcon = editIcon;
    nextIcon = nextIcon;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    //Toast Config
    config: { timeOut: 8000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    //Variable
    proposalModel: ProposalModel = new ProposalModel();
    isUpdatedAction: boolean;
    proposalId: number;
    tempProposalId: string;
    isEditable: boolean = false;

    trainingInstitutes: String[] = [
        "PUBLIC",
        "PRIVATE",
        "PPP"
    ];

    headInfo: any;
    userDetails: any;
    loggedInstituteDetails: any = { 'id': 1, 'name': 'roni' };
    fiscalYears: any[] = [];
    activeFiscalYear: any ={}
    speakerList: { id: number, name: string }[] = [];
    existingProposalId: number;


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private route: Router,
        private _proposalService: ProposalService,
        private _configurationService: ConfigurationService,
        private _trainersService: TrainersService,
        private _trainingInstituteProfileService: TrainingInstituteProfileService,
        private dateAdapter: DateAdapter<Date>) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
        this.tempProposalId = this._activatedRoute.snapshot.paramMap.get('proposalId');
    }

    ngOnInit(): void {

        this.getReadyForEdit();
        this.userDetails = this._authService.getLoggedUserDetails();
        this.proposalModel.instituteName = this.userDetails.name;
        this.proposalModel.instituteHead = this.userDetails.name;

        if (!this.tempProposalId) {
            this.getProfile();
        }
        // this.getAvailableFiscalYear();
        this.getAllFiscalYear();
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposal': {
                        if (this.existingProposal.id) {
                            this.existingProposalId = this.existingProposal.id;
                            this.getReadyForEdit();
                        }
                        break;
                    }
                }
            }
        }
    }

    getProfile() {
        this.spinner1 = true;
        this._trainingInstituteProfileService.getProfileViewById(this.userDetails.id).subscribe(
            res => {
                let trainingInstituteProfile: TrainingInstituteProfileModel = new TrainingInstituteProfileModel();
                Object.assign(trainingInstituteProfile, res);
                this.proposalModel.trainingInstituteProfileModel = { ...trainingInstituteProfile };
                // trainingInstituteProfile.headInfo = trainingInstituteProfile.headOfInstituteName + ", " + trainingInstituteProfile.designation + ", " + trainingInstituteProfile.mobileNumber;
                // this.headInfo = this.proposalModel.trainingInstituteProfileModel.headInfo;
                this.spinner1 = false;
            },
            err => {
                console.log(err);
                this.spinner1 = false;
            }
        );
    }

    getAvailableFiscalYear() {
        this._configurationService.getActiveFiscalYear().subscribe(res => {
            this.activeFiscalYear= res;
        })
    }

    getAllFiscalYear() {
        this.spinner2 = true;
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
                this.spinner2 = false;
            },
            error => {
                console.log(error);
                this.spinner2 = false;
            }
        )
    }

    checkRequirdField(): Boolean {
        let isValied = true;
        if (!this.proposalModel.fiscalYearId ||
            !this.proposalModel.trainingName ||
            !this.proposalModel.trainingDuration ||
            !this.proposalModel.programDate ||
            !this.proposalModel.endDate ||
            !this.proposalModel.noOfTrainer ||
            !this.proposalModel.trainingMethods
        ) {
            isValied = false;
        }
        // this.personalInfoFormModel.forEach(f => {
        //     if (!(f.name || f.phoneNo) || !f.permanentAddress || !f.nid) {
        //         return isValied = false;
        //     }
        // });
        return isValied;
    }


    onSubmit(next: boolean) {



        if (this.checkRequirdField()) {
            if (this.proposalModel.id) {
                this.onUpdate(next);
            } else {
                this.onSave(next);
            }
        }
        else {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return 0;
        }

        if (!this.proposalModel.trainingDuration) {
            return;
        }

        if (this.proposalModel.trainingDuration < 60) {
            this._toastrService.warning("Training Duration at least 60 hours !!", "");
            return;
        }
    }

    onSave(next: boolean) {

        this.proposalModel.instituteName = this.userDetails.id;
        this.proposalModel.instituteHead = this.userDetails.id;

        this.spinner = true;
        this._proposalService.createProposal(this.proposalModel).subscribe(
            response => {
                if (response.success) {
                    this.brodCastChange.next(response.obj);
                    this.proposalModel = response.obj;
                    this._toastrService.success(response.message, '');
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this._toastrService.error(response.message, '');
                }
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );


    }


    onUpdate(next: boolean) {
        this.proposalModel.instituteName = this.userDetails.id;
        this.proposalModel.instituteHead = this.userDetails.id;
        this.spinner = true;
        this._proposalService.editProposal(this.proposalModel).subscribe(
            response => {
                if (response.success) {
                    this.brodCastChange.next(response.obj);
                    this.proposalModel = response.obj;
                    this._toastrService.success(response.message, '');
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this._toastrService.error(response.message, '');
                }
                this.spinner = false;
            },
            error => {
                console.log("Error: " + error);
                this._toastrService.error(error.message, "");
                this.spinner = false;
            }
        );
    }

    getReadyForEdit() {
        if (!this.existingProposalId) {
            return;
        }

        this.spinner3 = true;
        this._proposalService.getProposalById(this.existingProposalId).subscribe(
            res => {
                this.proposalModel = res;
                this.proposalModel.trainingInstituteProfileModel.headInfo =
                    this.proposalModel.trainingInstituteProfileModel.headOfInstituteName + ", "
                    + this.proposalModel.trainingInstituteProfileModel.designation + ", "
                    + this.proposalModel.trainingInstituteProfileModel.mobileNumber;
                this.spinner3 = false;
            },
            error => {
                this.spinner3 = false;
            }
        );



    }

    reset() {
        this.spinner5 = true;
        this._trainingInstituteProfileService.getProfileViewById(this.userDetails.id).subscribe(
            res => {

                let trainingInstituteProfile: TrainingInstituteProfileModel = new TrainingInstituteProfileModel();
                Object.assign(trainingInstituteProfile, res);
                trainingInstituteProfile.headInfo = trainingInstituteProfile.headOfInstituteName + ", " + trainingInstituteProfile.designation + ", " + trainingInstituteProfile.mobileNumber;
                this.proposalModel.trainingInstituteProfileModel = trainingInstituteProfile;
                this.spinner5 = false;
            },
            err => {
                console.log(err);
                this.spinner5 = false;
            }
        )
        this.proposalModel.previousExperience = "";
        this.proposalModel.principalAndStrategies = "";
        this.proposalModel.courseObjective = "";
        this.proposalModel.infrastructuralFacility = "";
        this.proposalModel.anyCourseFeeFromTrainee = "";
        this.proposalModel.otherRelevantInfo = "";

    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    housrValidation($event: any) {
        if (this.proposalModel.trainingDuration < 60) {
            this._toastrService.warning("Training Duration at least 60 hours !!", "");
        }
    }
}
