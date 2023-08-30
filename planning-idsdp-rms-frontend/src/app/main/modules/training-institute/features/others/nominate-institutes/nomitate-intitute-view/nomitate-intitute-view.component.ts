import { Component, OnInit } from '@angular/core';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {
    previousIcon,
    downloadIcon,
    printIcon,
    noteIcon,
    editIcon,
    addNewIcon,
    pdfIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { ExpeditureItemServiceService } from 'app/main/modules/settings/services/expediture-item-service.service';
import { FiscalYearServiceService } from 'app/main/modules/settings/services/fiscal-year-service.service';
import { ProposalService } from 'app/main/modules/training-institute/services/proposal.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { TrainingInstituteProfileService } from 'app/main/modules/training-institute/services/training-institute-profile.service';
import moment from 'moment';
import { reportBackend } from 'environments/environment';
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-nomitate-intitute-view',
    templateUrl: './nomitate-intitute-view.component.html',
    styleUrls: ['./nomitate-intitute-view.component.scss'],
})
export class NomitateIntituteViewComponent implements OnInit {

    u : any;
    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    id: any;
    tabData: any;

    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;

    trainerData: any = {};
    profileUuId: String;
    profileId: any;
    fiscalYearsList: any[];
    userList: any[] = [];
    totalBudgetAmount: number = 0;
    itemOfExpenditures: {
        expItemsFor: string;
        expItemsName: string;
        id: number;
    }[];
    isSubmitted: any = false;
    trainingInstitutes: any[] = [];

    isSubmissionDisable: boolean = false;
    proposalSubmissionDate: any = {};
    isSubmitDisableForIncomplete: boolean = false;
    profileModelResponse: any = {};
    data: any = {};
    expenditureList: { item: string; amount: number }[] = [];

    constructor(
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private dialog: MatDialog,
        private _proposalService: ProposalService,
        private _expenditureItemServiceService: ExpeditureItemServiceService,
        private _trainingInstituteProfileService: TrainingInstituteProfileService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.profileUuId = this.activateRoute.snapshot.paramMap.get('uuid');
        this.profileId = this.activateRoute.snapshot.paramMap.get('id');
        this.u = this.activateRoute.snapshot.paramMap.get('u');
        this.getExpenditureItems();
        if (this.profileUuId) {
            this.getAllProposalData();
            this.getTotalBudgetAmount();
        }
    }

    getTotalBudgetAmount() {
        if (!this.trainerData.researchBudgetListViewList) {
            return 0;
        }

        for (
            let i = 0;
            i < this.trainerData.researchBudgetListViewList.length;
            i++
        ) {
            this.totalBudgetAmount +=
                this.trainerData.researchBudgetListViewList[
                    i
                ].expenditureAmount;
        }
    }

    back() {
        this._router.navigate(['/nominate-institutes']);
    }

    download($fileName = '') {
        this.trainerData.researchBudgetListViewList.forEach((budget) => {
            this.expenditureList.push({
                item: this.getItemOfExpenditure(budget.itemOfExpenditureId),
                amount: budget.expenditureAmount,
            });
        });

        // console.log(',,,', this.expenditureList)

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/nomininate_institute';
        this.data['lng'] = localStorage.getItem('currentLang');

        this.data['trainerData'] = JSON.stringify(this.trainerData);
        this.data['profileModelResponse'] = JSON.stringify(
            this.profileModelResponse
        );
        this.data['trainers'] = JSON.stringify(this.trainerData.trainersList);
        // console.log('....', JSON.stringify(this.trainerData))
        this.data['courseScheduleList'] = JSON.stringify(
            this.trainerData.courseScheduleList
        );
        this.data['researchBudgetListViewList'] = JSON.stringify(
            this.trainerData.researchBudgetListViewList
        );
        this.data['expenditureList'] = JSON.stringify(this.expenditureList);
        this.data['totalBudgetAmount'] = this.totalBudgetAmount;
        // console.log('....', JSON.stringify(this.totalBudgetAmount))
        // this.data['speaker'] = this.trainerData.courseScheduleList.speakers.name;

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    print() {
        window.print();
    }

    getItemOfExpenditure(itemOfExpenditureId: number) {
        if (!itemOfExpenditureId) {
            return 'XYZ Expenditure';
        }
        let itemOfExpenditure = this.itemOfExpenditures.find(
            (iOE) => iOE.id === itemOfExpenditureId
        );

        if (itemOfExpenditure) return itemOfExpenditure.expItemsName;
        else return 'XYZ Expenditure';
    }

    getAllProposalData() {
        this.spinner = true;
        this._proposalService.getAllProposalList(this.profileUuId).subscribe(
            (response) => {
                this.spinner = false;
                this.trainerData = response;                
                this.getProfileData(this.u);
                this.isSubmitted = this.trainerData.submitted;
                this.trainerData.researchBudgetListViewList.map((rb) => {
                    this.totalBudgetAmount += rb.expenditureAmount;
                });
            },
            (error) => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );

        console.log('======' + this.trainerData);
    }

    getProfileData(id) {
        this._trainingInstituteProfileService.getProfileViewById(id).subscribe(
            (data) => {
                this.profileModelResponse = data;
                console.log(
                    '------------------------- Data of profile ---------------------'
                );
                console.log(this.profileModelResponse);
            },
            (error) => { }
        );
    }

    private getExpenditureItems() {
        this._expenditureItemServiceService.getAll().subscribe(
            (res) => {
                console.log(res);
                this.itemOfExpenditures = res.items;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    submitProposal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {
            message: ConfirmDialogConstant.SUBMIT_CONFIRMATION,
        };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );

        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this._proposalService
                    .submitProposal(this.profileId)
                    .subscribe((res) => {
                        this.back();
                    });
            }
            dialogRef.close(true);
        });
    }

    convertDate(date: string) {
        return moment(date).format('DD-MM-YYYY');
    }
}
