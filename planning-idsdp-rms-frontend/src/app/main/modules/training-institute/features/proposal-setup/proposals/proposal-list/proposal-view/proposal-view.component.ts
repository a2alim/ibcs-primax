import { Component, OnInit } from '@angular/core';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon,
    sendItem,
} from 'app/main/modules/rpm/constants/button.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { FiscalYearServiceService } from 'app/main/modules/settings/services/fiscal-year-service.service';
import { locale as lngEnglish } from '../../i18n/en';
import { locale as lngBangla } from '../../i18n/bn';
import { ProposalService } from '../../../../../services/proposal.service';
import { ExpeditureItemServiceService } from '../../../../../../settings/services/expediture-item-service.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from '../../../../../../../shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { JasperServiceService } from '../../../../../../rpm/services/jasper-service.service';
import { ProposalSubmissionService } from '../../../../../services/proposal-submission.service';
import { TrainingInstituteProfileService } from '../../../../../services/training-institute-profile.service';
import moment from 'moment';
import { reportBackend } from 'environments/environment';
import { identity } from 'lodash';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import * as bl2Js from 'bl2-js-report';

@Component({
    selector: 'app-proposal-view',
    templateUrl: './proposal-view.component.html',
    styleUrls: ['./proposal-view.component.scss'],
})
export class ProposalViewComponent implements OnInit {
    u : any;
    data: any = {};
    proposalList: any;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    sendItem = sendItem;
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

    trainerData: any = [];
    researchBudgetListViewList: any = [];
    profileUuId: String;
    profileId: any;
    trdd: any = [];
    fiscalYearsList: any[];
    userList: any[] = [];
    totalBudgetAmount: number = 0;
    itemOfExpenditures: {
        expItemsFor: string;
        expItemsName: string;
        id: number;
    }[] = [];
    isSubmitted: any = true;
    trainingInstitutes: any[] = [];

    isSubmissionDisable: boolean = false;

    proposalSubmissionDate: any = {};
    isSubmitDisableForIncomplete: boolean = false;
    profileModelResponse: any = {};
    expenditureList: { item: string; amount: number }[] = [];
    langVal: string;

    constructor(
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private dialog: MatDialog,
        private _proposalService: ProposalService,
        private fiscalYearService: FiscalYearServiceService,
        private _expenditureItemServiceService: ExpeditureItemServiceService,
        private jasperService: JasperServiceService,
        private _proposalSubmissionService: ProposalSubmissionService,
        private _trainingInstituteProfileService: TrainingInstituteProfileService,
        private dataCom: DataComService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.langVal = localStorage.getItem("currentLang")
        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });

        this.profileUuId = this.activateRoute.snapshot.paramMap.get('uuid');
        this.profileId = this.activateRoute.snapshot.paramMap.get('id');
        this.u = this.activateRoute.snapshot.paramMap.get('u');
        this.getExpenditureItems();

        this.spinner = true;
        this._proposalSubmissionService
            .getProposalSubmissionDates()
            .toPromise()
            .then(
                (res) => {
                    if (res.letterFor == 'Final Copy') {
                        this.proposalSubmissionDate = res;
                    }
                    if (this.profileUuId) {
                        this.getAllProposalData();
                        this.getTotalBudgetAmount();
                    }
                    this.spinner = false;
                },
                (err) => {
                    console.log(err);
                    this.spinner = false;
                }
            );
    }

    getInstituteName(id: any) {
        if (!id) {
            return '';
        }

        let institute = this.trainingInstitutes.find((ti) => ti.id == id);
        if (institute.id == id) return institute.name;
        else return 'Not Found';
    }

    getTotalBudgetAmount() {
        if (this.trainerData.researchBudgetResponses) {
            for (let i = 0;  i < this.trainerData.researchBudgetListViewList.length; i++) {
                this.totalBudgetAmount +=
                    this.trainerData.researchBudgetListViewList[
                        i
                    ].expenditureAmount;
            }
        }
    }

    backProposallist() {
        this._router.navigate(['/proposal-list']);
    }

    getProfileData(id) {
        this.spinner2 = true;
        this._trainingInstituteProfileService.getProfileViewById(id).subscribe(
            (data) => {
                this.profileModelResponse = data;
                this.spinner2 = false;
            },
            (error) => {
                console.log('error ===== >>>>> ', error);
                this.spinner2 = false;
            }
        );
    }

    back() {
        this._router.navigate(['/proposal-list']);
    }

    findExpenditureItems(){
        let store = [];

        let expItemsList = this.trainerData.researchBudgetListViewList;
        expItemsList.forEach((budget) => {
            let found = this.itemOfExpenditures.find(e => e.id == budget.itemOfExpenditureId);
            store.push({
                item: found.expItemsName,
                amount: budget.expenditureAmount,
            });
        });

        return store.length>0 ? JSON.stringify(store) : "";
        
    }
    async download($fileName = '') {
     
        this.data['expenditureList'] = await this.findExpenditureItems();

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/proposalList';
        this.data['lng'] = localStorage.getItem('currentLang');

        this.data['trainerData'] = JSON.stringify(this.trainerData);
        this.data['profileModelResponse'] = JSON.stringify(
            this.profileModelResponse
        );
        console.log('11111');
        this.data['trainers'] = JSON.stringify(this.trainerData.trainersList);
        // console.log('....', JSON.stringify(this.trainerData))
        this.data['courseScheduleList'] = JSON.stringify(
            this.trainerData.courseScheduleList
        );
        console.log('2222');
        this.data['researchBudgetListViewList'] = JSON.stringify(
            this.trainerData.researchBudgetListViewList
        );
        
        this.data['totalBudgetAmount'] = this.totalBudgetAmount;
        // console.log('....', JSON.stringify(this.expenditureList))
        // this.data['speaker'] = this.trainerData.courseScheduleList.speakers.name;
            console.log('333');
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    // download() {
    //     let lang = localStorage.getItem("currentLang");
    //     this.genPdf(lang);
    // }

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
        this.spinner3 = true;
        this._proposalService.getAllProposalList(this.profileUuId).subscribe(
            (response) => {
                this.trainerData = response;
                this.getProfileData(this.u);
                this.isSubmitted = this.trainerData.submitted;

                this.trainerData.researchBudgetListViewList.map((rb) => {
                    this.totalBudgetAmount += rb.expenditureAmount;
                });

                if ( response.fiscalYearId != this.proposalSubmissionDate.stFiscalYearId) 
                {
                    this.isSubmissionDisable = true;
                }

                let startDate = new Date(
                    this.proposalSubmissionDate.advertisementStartDate
                );
                let endDate = new Date(
                    this.proposalSubmissionDate.advertisementEndDate
                );
                let currentDate = new Date();

                if (startDate >= currentDate || currentDate >= endDate) {
                    this.isSubmissionDisable = true;
                }

                if (
                    response.researchBudgetListViewList == null ||
                    response.researchBudgetListViewList.length < 1 ||
                    response.courseScheduleList == null ||
                    response.courseScheduleList.length < 1
                ) {
                    this.isSubmitDisableForIncomplete = true;
                }
                this.spinner3 = false;
            },
            (error) => {
                console.log('error ==== >>>> ', error);
                this.spinner3 = false;
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

    genPdf(lang) {
        this.spinner2 = true;
        this.jasperService
            .generateTraningInstituteProposalPdf(this.profileUuId, lang)
            .subscribe(
                (response) => {
                    this.spinner2 = false;
                    let file = new Blob([response], {
                        type: 'application/pdf',
                    });
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                },
                (error) => {
                    this.spinner2 = false;
                }
            );
    }

    private getExpenditureItems() {
        this.spinner4 = true;
        this._expenditureItemServiceService.getAll().subscribe(
            (res) => {
                this.itemOfExpenditures = res.items;
                this.spinner4 = false;
            },
            (error) => {
                console.log(error);
                this.spinner4 = false;
            }
        );
    }

    convertDate(date: string) {
        return moment(date).format('DD-MM-YYYY');
    }
}
