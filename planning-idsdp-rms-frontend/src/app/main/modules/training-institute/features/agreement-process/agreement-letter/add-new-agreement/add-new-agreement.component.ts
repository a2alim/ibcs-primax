import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, dataNotFount, deleteFailed, deleteSuccess, nextIcon, previousIcon, refreshIcon, saveFailed, saveIcon, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { ToastrService } from 'ngx-toastr';
import { TrainersModel } from 'app/main/modules/training-institute/models/trainers.model';
import { AgreementModel } from 'app/main/modules/training-institute/models/agreement.model';
import { AgreementService } from 'app/main/modules/training-institute/services/agreement.service';
import { AgreementPartiesModel } from 'app/main/modules/training-institute/models/agreement-parties.model';
import { AgreementInstallmentModel } from 'app/main/modules/training-institute/models/agreement-installments.model';
import { ConfigurationService } from "../../../../../settings/services/configuration.service";
import { GuarantorService } from "../../../../services/guarantor.service";
import { GuarantorResponse } from "../../../../models/guarantor-response.model";
import { ProposalService } from "../../../../services/proposal.service";
import { ProposalModel } from "../../../../models/proposal.model";
import { AuthService } from "../../../../../auth/services/auth.service";
import { MatSelectChange } from "@angular/material/select";
import { DateAdapter } from '@angular/material/core';
import { JasperServiceService } from 'app/main/modules/rpm/services/jasper-service.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { OK } from 'app/main/core/constants/message';

@Component({
    selector: 'app-add-new-agreement',
    templateUrl: './add-new-agreement.component.html',
    styleUrls: ['./add-new-agreement.component.scss']
})
export class AddNewAgreementComponent implements OnInit {
    //Icon
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    isOk: boolean = true;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;


    agreements: AgreementModel[] = [];

    agreement: AgreementModel = new AgreementModel();
    //Toast Config
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };


    //Variable
    installmentAmount: Object[] = [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
    ];
    insArr: number[] = [][3];

    num: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // trainingTitles: { id: number, courseTitle: String }[] = [
    //     {id: 1, courseTitle: "Course 1"},
    //     {id: 2, courseTitle: "Course 2"},
    //     {id: 3, courseTitle: "course 3"},
    //     {id: 4, courseTitle: "Course 4"}
    // ]

    courseList: { id: number, name: string }[] = [];
    guarantors: GuarantorResponse[] = []

    installmentValues: number[] = [
        1,
        2,
        3,
        4
    ]

    trainersModel: TrainersModel = new TrainersModel();

    isUpdatedAction: boolean;

    agreementId: number;
    tempAgreementId: string;
    isEditable: boolean = false;
    fiscalYears: any[] = [];
    proposals: any[] = [];
    selectedProposal: ProposalModel = new ProposalModel();

    deskOfficers: any[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private route: Router,
        private _agreementService: AgreementService,
        private _configurationService: ConfigurationService,
        private _guarantorService: GuarantorService,
        private _proposalService: ProposalService,
        private _authService: AuthService,
        private dateAdapter: DateAdapter<Date>,
        private jasperService: JasperServiceService,
        private matSnackBar: SnackbarHelper,) {
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.tempAgreementId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.tempAgreementId != null) {
            this.isEditable = true;
            this.agreementId = Number(this.tempAgreementId);
        }

        console.log(this.agreementId);

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
        )

        if (this.isEditable) {
            this._agreementService.getAgreementById(this.agreementId).subscribe(
                res => {
                    this.agreement = res;
                    this.agreement.proposalId = res.proposalModel.id;
                    this.agreement.guarantorId = res.guarantorModel.id

                    console.log(this.agreement)
                    // this.setChange(this.agreement.noOfInstallment)

                    let arraySize = this.agreement.noOfInstallment;

                    // this.agreement.agreementInstallments = new Array<AgreementInstallmentModel>(arraySize);

                    // for (let i = 0; i < arraySize; i++) {
                    //     this.agreement.agreementInstallments[i] = res.agreementInstallments[i];
                    // }

                    this.insArr = new Array(arraySize);
                }
            );
        }
        this.onInitOthers();

    }

    formReset() {
        this.agreement.proposalId = undefined;
        this.agreement.guarantorId = undefined;
        this.agreement.traineeRecommended = undefined;
        this.agreement.noOfInstallment = undefined;
        this.setChange(0);
    }

    setChange(value) {
        let arraySize = Number(value);
        // this.agreement.agreementInstallments = new AgreementInstallmentModel()[event.value];

        this.agreement.agreementInstallments = new Array<AgreementInstallmentModel>(arraySize);

        for (let i = 0; i < arraySize; i++) {
            this.agreement.agreementInstallments[i] = new AgreementInstallmentModel();
        }


        this.insArr = new Array(arraySize);
    }

    saveAndUpdate() {
        console.log(this.agreement)

        if (this.isEditable) {
            this._agreementService.editAgreement(this.agreement, this.agreementId).subscribe(
                () => {
                    this._toastrService.success(updateSuccess, "Success");
                    this.route.navigate(["agreement-letter"])
                },
                error => {
                    this._toastrService.error(updateFailed, "Error");
                    console.log(error)
                }
            );
        } else {
            this._agreementService.createAgreement(this.agreement).subscribe(
                () => {
                    this._toastrService.success(saveSuccess, "Success");
                    this.route.navigate(["agreement-letter"])
                },
                error => {
                    this._toastrService.error(saveFailed, "Error");
                    console.log(error)
                }
            );
        }


    }

    addTrainersAcademicBackgroundInTable() {
        // this.trainersModel.trainersAcademicBackgroundList.push(this.trainersAcademicBackgroundModel)
        // this.trainersAcademicBackgroundModel = new TrainersAcademicBackgroundListModel();

       // console.log(this.trainersModel.academicBackgroundModelList)
    }

    onPercentageChange(idx: any) {

        let totalPercentage = 0
        for (let i = 0; i < this.agreement.noOfInstallment; i++) {
            totalPercentage += this.agreement.agreementInstallments[i].percentageOfInstallment
        }


        if (totalPercentage > 100) {
            this.agreement.agreementInstallments[idx].totalAmount = 0
            this._toastrService.error("You can't get more than 100% in installment", "Warning")
            this.isOk = false
            return;
        } else {
            this.isOk = true
            for (let i = 0; i < this.agreement.noOfInstallment; i++) {
                this.agreement.agreementInstallments[i].installmentName = "Installment No: " + (i + 1)
                this.agreement.agreementInstallments[i].totalAmount =
                    Number(parseFloat((this.agreement.amountOfGrant * (this.agreement.agreementInstallments[i].percentageOfInstallment / 100)).toString()).toFixed(2))
            }
            // this._toastrService.info("Installment Calculation is now OK", "OK")
        }


    }

    selectProposal() {
        let proposal = this.proposals.find(proposal => proposal.id == this.agreement.proposalId);

        if (proposal) {

            this.processProposal(proposal);
        }
    }

    selectDeskOfficer2(event: MatSelectChange) {
        let deskOfficer = this.deskOfficers.find(deskOfficer => deskOfficer.name == event.value);

        this.agreement.witness.firstPartySurname = deskOfficer.mobileNumber;
        this.agreement.witness.firstPartyAddress = deskOfficer.emailId;
    }

    private onInitOthers() {
        this.agreement.onBehalf = new AgreementPartiesModel();
        this.agreement.witness = new AgreementPartiesModel();
        // this.agreement.agreementInstallments = [][2];

        this.getCurrentFiscalYear((res) => {
            this.getCurrentFiscalYearId();
        });

        this._guarantorService.getGuarantors(2000, 0).subscribe(
            res => {
                this.guarantors = res.data;
            },
            error => {
                console.log(error)
            }
        )

        this._proposalService.getProposals(2000, 0).subscribe(res => {
            console.log(res)
            res.data.forEach(course => {
                this.courseList.push({ id: course.id, name: course.trainingName })
            })
            this.proposals = res.data;

        })
    }


    getCurrentFiscalYear(callBack) {
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
                callBack(true);
            },
            error => {
                console.log(error);
                callBack(true);
            }
        );
    }


    selectDeskOfficer1(event: MatSelectChange) {
        let deskOfficer = this.deskOfficers.find(deskOfficer => deskOfficer.name == event.value);

        this.agreement.onBehalf.firstPartySurname = deskOfficer.mobileNumber;
        this.agreement.onBehalf.firstPartyAddress = deskOfficer.emailId;
    }

    private processProposal(proposal) {
        this.selectedProposal = proposal;
        this.agreement.onBehalf.secondPartyName = this.selectedProposal.trainingInstituteProfileModel.headOfInstituteName;
        this.agreement.onBehalf.secondPartyAddress = this.selectedProposal.trainingInstituteProfileModel.permanentAddress;
        this.agreement.onBehalf.secondPartyPhoneNo = this.selectedProposal.trainingInstituteProfileModel.mobileNumber;
        this.agreement.onBehalf.secondPartyEmail = this.selectedProposal.trainingInstituteProfileModel.email;
        this.agreement.onBehalf.secondPartyNidNo = this.selectedProposal.trainingInstituteProfileModel.nidNo;

        this._guarantorService.getGuarantorByProposalId(this.selectedProposal.id).subscribe(
            res => {
                this.agreement.guarantorId = res.id;
                this.agreement.guarantorName = res.guarantorName;
            },
            error => {
                // this._toastrService.error(error.error.message, "Error");
                console.log(error)
            }
        );

    }

    getCurrentFiscalYearId() {
        this.jasperService.advertiseDateValidity().subscribe(validRes => {
            if (!validRes.success) {
                this.matSnackBar.openWarnSnackBarWithMessage(validRes.message, OK);
            }
            else {
                this.fiscalYears = this.fiscalYears.filter(f => f.id === validRes.stFiscalYearId);
            }
        });
    }
}
