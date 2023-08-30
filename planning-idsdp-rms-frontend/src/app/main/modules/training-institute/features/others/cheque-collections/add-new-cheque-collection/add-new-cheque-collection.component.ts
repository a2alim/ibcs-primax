import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSelectChange } from "@angular/material/select";
import { ActivatedRoute, Router } from '@angular/router';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon, dataNotFount, deleteFailed, deleteSuccess, nextIcon,
    previousIcon,
    refreshIcon, saveFailed, saveIcon, saveSuccess, sentSuccess, updateFailed, updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import { ConfigurationService } from 'app/main/modules/settings/services/configuration.service';
import { ChequeCollectionRequest } from 'app/main/modules/training-institute/models/cheque-collection-request.model';
import { ProposalModel } from 'app/main/modules/training-institute/models/proposal.model';
import { ChequeCollectionService } from 'app/main/modules/training-institute/services/cheque-collection.service';
import { ProposalService } from 'app/main/modules/training-institute/services/proposal.service';
import {
    TrainingInstituteProfileService
} from 'app/main/modules/training-institute/services/training-institute-profile.service';
import { FileUploadService } from 'app/main/shared/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import { PredefinedTemplateServiceService } from "../../../../../settings/services/predefined-template-service.service";
import { TemplateTypeServiceService } from "../../../../../settings/services/template-type-service.service";
import { AgreementInstallmentModel } from "../../../../models/agreement-installments.model";
import { AgreementModel } from "../../../../models/agreement.model";
import { AgreementService } from "../../../../services/agreement.service";
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";
@Component({
    selector: 'app-add-new-cheque-collection',
    templateUrl: './add-new-cheque-collection.component.html',
    styleUrls: ['./add-new-cheque-collection.component.scss']
})
export class AddNewChequeCollectionComponent implements OnInit {

    //Icon
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    preDefineTemplateList: any[] = [];
    templateType: [] = [];
    //Toast Config
    config: { timeOut: 8000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    //Variable

    proposalModel: ProposalModel = new ProposalModel();
    isUpdatedAction: boolean;
    isEditable: boolean = false;
    trainingInstitutes: any[] = [];
    userDetails: any;
    loggedInstituteDetails: any = { 'id': 1, 'name': 'roni' };
    fiscalYears: any[] = [];
    chequeCollectionRequest: ChequeCollectionRequest = new ChequeCollectionRequest();
    tempChequeId: string;
    chequeId: number;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    proposalsList:any = []
    agreementModel: AgreementModel = new AgreementModel();
    agreementInstallments: AgreementInstallmentModel[] = [];

    sigImg: any;
    chequeImg: any;

    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;
    spinner7: boolean = false;
    spinner8: boolean = false;
    spinner9: boolean = false;
    spinner10: boolean = false;
    spinner11: boolean = false;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dateAdapter: DateAdapter<Date>,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _trainingInstituteProfileService: TrainingInstituteProfileService,
        private _proposalService: ProposalService,
        private route: Router,
        private templatetypeservice: TemplateTypeServiceService,
        private _fileUploadService: FileUploadService,
        private _configurationService: ConfigurationService,
        private _chequeCollecionService: ChequeCollectionService,
        private _predefinedTemplateServiceService: PredefinedTemplateServiceService,
        private _agreementService: AgreementService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

    }

    ngOnInit(): void {
        this.chequeCollectionRequest.chequeReceived = false;
        this.getReadyForEdit()
        this.userDetails = this._authService.getLoggedUserDetails();
        this.getAllTrainersInstitutesList();
        // this.getTrainerList();

        this.getPredefinedTemplateList();
        this.getTemplateType();

        this.spinner = true;
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
                this.spinner = false;
            },
            error => {
                console.log(error);
                this.spinner = false;
            }
        )
    }

    getInstituteName(createdBy: any) {
        let institute = this.trainingInstitutes.find(ti => ti.id == createdBy);
        if (institute.id == createdBy)
            return institute.name;
        else
            return "XYZ Institute";
    }

    uploadFile(files: FileList, tag: string) {
        console.log(files[0].name + " " + tag)
        if (tag === 'cheque') {
            this.spinner10 = true;
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.chequeCollectionRequest.chequeImage = data;
                this.spinner10 = false;
            },
                e => { this.spinner10 = false; })
        } else if (tag === 'signature') {
            this.spinner10 = true;
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.chequeCollectionRequest.signatureImageOfCollectingPerson = data;
                this.spinner10 = false;
            },
                e => { this.spinner10 = false; })
        }
    }

    addChequeCollection(chequeCollectionRequest: ChequeCollectionRequest) {
        this.spinner1 = true;
        this._chequeCollecionService.addChequeCollection(chequeCollectionRequest).subscribe(
            res => {
                this.spinner1 = false;
                this.route.navigate(['cheque-collection']);
                this._toastrService.success(saveSuccess, "Success");
            },
            error => {
                this._toastrService.error(saveFailed, "Error");
                console.log("Error: " + error);
                this.spinner1 = false;
            }
        )
    }

    getReadyForEdit() {
        this.tempChequeId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.tempChequeId != null) {
            this.isEditable = true;
            this.chequeId = Number(this.tempChequeId);
        }

        if (this.isEditable) {
            this.spinner2 = true;
            this._chequeCollecionService.getChequeCollectionById(this.chequeId).subscribe(
                res => {
                    this.chequeCollectionRequest.acknowledgementLetter = res.data.acknowledgementLetter;
                    this.chequeCollectionRequest.chequeAmount = res.data.chequeAmount;
                    this.chequeCollectionRequest.chequeDate = res.data.chequeDate;
                    this.chequeCollectionRequest.chequeImage = res.data.chequeImage;
                    this.chequeCollectionRequest.chequeNo = res.data.chequeNo;
                    this.chequeCollectionRequest.chequeReceived = res.data.chequeReceived;
                    this.chequeCollectionRequest.chequeReceiverPhoneNo = res.data.chequeReceiverPhoneNo;
                    this.chequeCollectionRequest.collectionDate = res.data.collectionDate;
                    this.chequeCollectionRequest.installmentType = res.data.installmentType;
                    this.chequeCollectionRequest.instituteId = res.data.trainingInstituteProfileModel.id;
                    this.chequeCollectionRequest.receiverNid = res.data.receiverNid;
                    this.chequeCollectionRequest.signatureImageOfCollectingPerson = res.data.signatureImageOfCollectingPerson;
                    this.chequeCollectionRequest.tokenNo = res.data.tokenNo;
                    this.chequeCollectionRequest.proposalId = res.data.proposalModel.id
                    this.spinner2 = false;
                    this.onProposalChange(this.chequeCollectionRequest.proposalId);
                },
                error => {
                    this.spinner2 = false;
                }
            );
        }
    }

    editChequeCollection(chequeCollectionRequest: ChequeCollectionRequest, chequeId: number) {
        this.spinner3 = true;
        this._chequeCollecionService.editChequeCollection(chequeCollectionRequest, chequeId).subscribe(
            res => {
                this._toastrService.success(updateSuccess, "Success");
                this.route.navigate(['cheque-collection']);
                this.spinner3 = false;
            },
            error => {
                this._toastrService.error(updateFailed, "Error")
                console.log("Error: " + error);
                this.spinner3 = false;
            }
        )
    }

    save() {
        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        if (this.isEditable) {
            this.editChequeCollection(this.chequeCollectionRequest, this.chequeId);
        } else {
            this.addChequeCollection(this.chequeCollectionRequest);
        }
    }

    saveProposal() {
        this.proposalModel.instituteName = this.userDetails.id;
        this.proposalModel.instituteHead = this.userDetails.id;
        this.spinner4 = true;
        this._proposalService.createProposal(this.proposalModel).subscribe(
            res => {
                this._toastrService.success(saveSuccess, "Success");
                this.route.navigate(['proposal-list']);
                this.spinner4 = false;
            },
            error => {
                console.log(error);
                if (error.status == 400 && error.error) {
                    this._toastrService.error(saveFailed, "Error")
                }
                this.spinner4 = false;
            }
        );
    }

    editProposal(proposalModel: ProposalModel, proposalId: number) {
        this.proposalModel.instituteName = this.userDetails.id;
        this.proposalModel.instituteHead = this.userDetails.id;

        this.spinner5 = true;
        this._proposalService.editProposal(proposalModel).subscribe(
            res => {
                this._toastrService.success(updateSuccess, "Success");
                this.spinner5 = false;
                this.route.navigate(['proposal-list']);
            },
            error => {
                console.log("Error: " + error);
                if (error.status == 400 && error.error) {
                    this._toastrService.error(updateFailed, "Error")
                }
                this.spinner5 = false;
            }
        )
    }

    getLoggedInstituteName(): string {
        return 'AV'
    }


    formReset() {
        this.chequeCollectionRequest = new ChequeCollectionRequest();
        this.chequeCollectionRequest.chequeImage = undefined;
        this.chequeCollectionRequest.signatureImageOfCollectingPerson = undefined;
        this.chequeImg = undefined;
        this.sigImg = undefined;
    }

    private getAllTrainersInstitutesList() {
        this.spinner6 = true;
        this._trainingInstituteProfileService.getTrainingInstituteList().toPromise().then(
            result => {
                result.data.forEach(ti => {
                    this.trainingInstitutes.push(ti);
                });
                this.spinner6 = false;
            },
            error => {
                console.log(error);
                this.spinner6 = false;
            }
        )
    }

    changeInstituteName(instProfileId:number){
        this.spinner7 = true;
        this.proposalsList = [];
        this._trainingInstituteProfileService.getProposalByInstituteProfileId(instProfileId).subscribe((res) => {
                this.spinner7 = false;
                console.log('res ===>', res);
                if(res){
                    this.proposalsList = res
                }
            })
    }

    onProposalChange(value: number) {
        this.spinner7 = true;
        this._agreementService.getAgreementByProposalId(value).subscribe(
            res => {
                this.agreementModel = res;
                this.agreementInstallments = this.agreementModel.agreementInstallments;
                this.spinner7 = false;
            },
            error => {
                this._toastrService.warning('Can not found installment type, please add installment first !.', '');
                this.agreementModel = new AgreementModel();;
                this.agreementInstallments = [];
                this.spinner7 = false;
            }
        )
    }

    selectionchangeForSemener(event: any, tag: any) {
        tag === 'p1' ? this.chequeCollectionRequest.acknowledgementLetter = event.value.header : '';
    }

    changeTemplateType($event: MatSelectChange) {
        let status = $event.value;

        if (status != null || status != "") {
            this.spinner8 = true;
            this._predefinedTemplateServiceService.getByTemplateTypeId(status).subscribe(
                res => {
                    if (res.success) {
                        this.preDefineTemplateList = res.items;
                    }
                    this.spinner8 = false;
                },
                error => {
                    this.spinner8 = false;
                });
        }

    }

    getPredefinedTemplateList() {
        this.spinner8 = true;
        this._predefinedTemplateServiceService.getAll().subscribe(
            res => {
                this.preDefineTemplateList = res.items ? res.items : [];
                this.spinner8 = false;
            },
            error => {
                this.spinner8 = false;
            }
        );

    }

    getTemplateType() {
        this.spinner9 = true;
        this.templatetypeservice.getAllActive().subscribe(
            res => {
                if (res) {
                    this.templateType = res.items;
                }
                this.spinner9 = false;
            },
            error => {
                this.spinner9 = false;
            });
    }

    resetForm() {
        this.chequeCollectionRequest = new ChequeCollectionRequest();
        this.chequeCollectionRequest.signatureImageOfCollectingPerson.fileName = null
        this.chequeCollectionRequest.chequeImage.fileName = null
    }



    checkRequirdField(): Boolean {
        let isValied = true;
        if (!this.chequeCollectionRequest.instituteId
            || !this.chequeCollectionRequest.proposalId
            || !this.chequeCollectionRequest.chequeReceiverPhoneNo
            || !this.chequeCollectionRequest.chequeNo
            || !this.chequeCollectionRequest.chequeAmount
            || !this.chequeCollectionRequest.chequeDate
            || !this.chequeCollectionRequest.collectionDate
            || !this.chequeCollectionRequest.installmentType
            || !this.chequeCollectionRequest.tokenNo
            || (this.chequeCollectionRequest.chequeImage === undefined)) {
            return isValied = false;
        }
        return isValied;
    }
}
