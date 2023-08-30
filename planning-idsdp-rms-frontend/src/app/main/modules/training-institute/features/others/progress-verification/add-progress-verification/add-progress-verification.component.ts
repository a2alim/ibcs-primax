import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FileUploadService } from "../../../../../../shared/services/file-upload.service";
import { ConfigurationService } from "../../../../../settings/services/configuration.service";
import { locale as lngEnglish } from "../../../others/progress-verification/i18n/en";
import { locale as lngBangla } from "../../../others/progress-verification/i18n/bn";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/training-institute/constants/button.constants';
import { ProgressVerificationService } from "../../../../services/progress-verification.service";
import { AuthService } from "../../../../../auth/services/auth.service";
import { ProgressVerificationRequest } from "../../../../models/progress-verification.request";
import { TrainingInstituteProfileService } from "../../../../services/training-institute-profile.service";
import { ProposalService } from "../../../../services/proposal.service";
import { ProposalModel } from "../../../../models/proposal.model";
import { DateAdapter } from '@angular/material/core';
import { dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import {FiscalYearServiceService} from "../../../../../settings/services/fiscal-year-service.service";


@Component({
    selector: 'app-add-progress-verification',
    templateUrl: './add-progress-verification.component.html',
    styleUrls: ['./add-progress-verification.component.scss']
})
export class AddProgressVerificationComponent implements OnInit {




    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;

    //Toast Config
    // config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    //Variable

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    progressVerificationRequest: ProgressVerificationRequest = new ProgressVerificationRequest();
    isUpdatedAction: boolean;
    progressVerificationId: number;
    tempProgressVerificationId: string;
    isEditable: boolean = false;

    fiscalYears: { id: number, fiscalYear: string, active: boolean }[] = [];
    courseList: { id: number, name: string }[] = [
        { id: 1, name: 'Course 1' },
        { id: 2, name: 'Course 2' },
        { id: 3, name: 'Course 3' },
    ];

    userType: string = this._authService.getLoggedUserType();
    trainingInstitutes = [];
    activeFiscalYear:any[];

    proposals: ProposalModel[] = [];
    proposalList: ProposalModel[] = [];
    selectedProposal: ProposalModel[] = [];
    deskOfficers: any[] = [];

    nothiFile: any;



    minEditorConfig: any = MIN_EDITOR_CONFIG;


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dateAdapter: DateAdapter<Date>,
        private route: Router,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _fileUploadService: FileUploadService,
        private _configurationService: ConfigurationService,
        private _progressVerificationService: ProgressVerificationService,
        private _authService: AuthService,
        private _trainingInstituteProfileService: TrainingInstituteProfileService,
        private _proposalService: ProposalService,
        private _fiscalYearService:FiscalYearServiceService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla,);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

        this.tempProgressVerificationId = this._activatedRoute.snapshot.params['progressVerificationId'];
        if (this.tempProgressVerificationId) {
            this.progressVerificationId = parseInt(this.tempProgressVerificationId);
            this.isEditable = true;
        }

        // this.progressVerificationRequest.trainingInstituteProfileModel = new TrainingInstituteProfileModel();

    }

    ngOnInit(): void {

        this._authService.getAllUser().subscribe(
            res => {
                res.map(user => {
                    if (user.userType === 'Rms_DO') {
                        this.deskOfficers.push(user);
                    }
                })

                console.log(this.deskOfficers)
            }
        );


        this.getAllTrainersInstitutesList();





        this.getFiscalYears(res1=>{
            if(res1){
                this.getProposals(res2=>{
                    if(res2){
                        if (this.isEditable){
                            this.getAllActiveFiscalYears()
                            this.getProgressVerificationById(res3=>{
                                if(res3){
                                   this.findTrainingTitleByFiscalYear(this.progressVerificationRequest.fiscalYearId);
                                   // this.progressVerificationRequest.fiscalYearId=this.fiscalYears[0].id
                                   // this.progressVerificationRequest.proposalId=36
                                }
                            });

                        }

                        if(!this.isEditable){
                            this.findTrainingTitleByFiscalYear(this.fiscalYears[0].id);
                            this.progressVerificationRequest.fiscalYearId=this.fiscalYears[0].id
                        }
                    }
                });
            }
        })




    }

    getAllActiveFiscalYears(){
        this._fiscalYearService.getAllActive().subscribe(res=>{
            if (res.success) {
                this.activeFiscalYear = res.items;
            } else {
                this.activeFiscalYear= [];
            }
        })
    }



    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }

    addProgressVerification() {

        this._progressVerificationService.addProgressVerification(this.progressVerificationRequest).subscribe(
            () => {
                this.route.navigate(['progress-verification']);
                this._toastrService.success(saveSuccess, "Success");
            },
            error => {
                this._toastrService.error(saveFailed, "Error");
                console.log("Error: " + error);
            }
        );
    }


    uploadFile(files: FileList, tag: string) {
        console.log(files[0].name + " " + tag)
        if (tag === 'nothi') {
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.progressVerificationRequest.nothi = data;
            })
        }

    }

    save() {
        this.progressVerificationRequest.examinerUserId = JSON.stringify(this.progressVerificationRequest.examinerUserId);
        if (this.isEditable) {
            this.editProgressVerification();
        } else {
            this.addProgressVerification();
        }
    }

    formReset() {
        this.progressVerificationRequest = new ProgressVerificationRequest();
        this.progressVerificationRequest.nothi == undefined;
        this.nothiFile = undefined;
    }

    private getAllTrainersInstitutesList() {
        this._trainingInstituteProfileService.getTrainingInstituteList().subscribe(
            res => {
                this.trainingInstitutes = res.data;
            },
            error => {
                console.log("Error: " + error);
            }
        )
    }

    private getFiscalYears(callback) {
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
                callback(true)
            },
            error => {
                callback(false)
                console.log(error)
            }
        )
        callback(true)
    }

    private getProgressVerificationById(callback) {
        this._progressVerificationService.getProgressVerificationById(this.progressVerificationId).subscribe(
            res => {
                Object.assign(this.progressVerificationRequest, res);
                if (res.proposalModel)
                    this.progressVerificationRequest.proposalId = res.proposalModel.id
                this.progressVerificationRequest.trainingInstituteProfileId = res.trainingInstituteProfileModel.id;
                this.progressVerificationRequest.examinerUserId = this.progressVerificationRequest.examinerUserId ? JSON.parse(this.progressVerificationRequest.examinerUserId) : JSON.parse('[]');
                callback(true)
            },
            error => {
                callback(false)
                console.log(error);
            }
        )
        callback(false)
    }

    private editProgressVerification() {
        this._progressVerificationService.editProgressVerfication(this.progressVerificationRequest, this.progressVerificationId).subscribe(
            () => {
                this.route.navigate(['progress-verification']);
                this._toastrService.success(updateSuccess, "Success");
            },
            error => {
                this._toastrService.error(updateFailed, "Error");
                console.log(error)
            }
        )
    }

    findTrainingTitleByFiscalYear(fiscalYearId: any) {
        this.proposalList = this.proposals.filter(rp => rp.fiscalYearId === fiscalYearId);
        console.log(this.proposalList)
    }

    SetInstituteByTraining(proposalId: any) {
        console.log(proposalId)
        this.selectedProposal = this.proposals.filter(rp => rp.id === proposalId);
        this.progressVerificationRequest.trainingInstituteProfileId = this.selectedProposal[0].trainingInstituteProfileModel.id;
    }

    private getProposals(callback) {
        this._proposalService.getProposals(2000, 0).subscribe(
            res => {
                this.proposals = res.data;
                callback(true)
            },
            error => {
                callback(false)
                console.log(error)
            }
        )
        callback(false)
    }
}
