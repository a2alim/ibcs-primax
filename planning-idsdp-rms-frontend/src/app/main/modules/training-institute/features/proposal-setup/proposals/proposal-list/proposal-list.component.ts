import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, deleteFailed, deleteSuccess, emailIcon, pdfIcon } from 'app/main/modules/rpm/constants/button.constants';
import { EvaluatorsGrantAmountLetter } from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import { RmsEvaluatorsGrantAmountLetterService } from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import { environment } from 'environments/environment';
import moment from "moment";
import { ToastrService } from 'ngx-toastr';
import { SubmitConfirmationDialogComponent } from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import { ConfirmDialogConstant } from "../../../../../../shared/constant/confirm.dialog.constant";
import { AuthService } from "../../../../../auth/services/auth.service";
import { ConfigurationService } from "../../../../../settings/services/configuration.service";
import { ProposalModel } from "../../../../models/proposal.model";
import { ProposalService } from "../../../../services/proposal.service";
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";
import {ProposalSubmissionService} from "../../../../services/proposal-submission.service";

@Component({
    selector: 'app-proposal-list',
    templateUrl: './proposal-list.component.html',
    styleUrls: ['./proposal-list.component.scss']
})
export class ProposalListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'fiscalYear', 'proposedTrainerName', 'trainingDuration', 'programDate', 'isSubmitted', 'action'];
    dataSource: MatTableDataSource<any>;
    proposalModels: ProposalModel[] = [];
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    proposalTitle: string = "";

    addNewIcon = addNewIcon;
    emailIcon = emailIcon;
    pdfIcon = pdfIcon;
    userDetails: any;

    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;


    fiscalYears: any[] = [];
    trainingInstitutes: any[] = [];
    userType: string = this._authService.getLoggedUserType();
    //userId: number = this._authService.getLoggedUserId();

    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    sendDataForGrid = {
        orderBy: null,
        pageableRequestBodyDTO: {
            page: this.page,
            size: this.pageSize,
        },
    };
    baseUrl  = environment.ibcs.tiBackend
    langVal: string;
    activeFiscalYear: any ={}

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: RmsEvaluatorsGrantAmountLetterService,
        private route: Router,
        private dialog: MatDialog,
        private _toastService: ToastrService,
        private _proposalService: ProposalService,
        private _authService: AuthService,
        private _configurationService: ConfigurationService,
        private dataCom: DataComService,
        private api: ApiService,
                private proposalSubmissionService: ProposalSubmissionService
    ) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getAvailableFiscalYear();
        this.langVal = localStorage.getItem("currentLang")
        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });

        this.spinner = true;

        let getPage = sessionStorage.getItem('page');
        let getSise = sessionStorage.getItem('size');

        let gPage = +getPage ? +getPage : this.page;
        let gSize = +getSise ? +getSise : this.pageSize;

        this.page = gPage; // get the current page
        this.size = gSize; // get the pageSize

        this.sendDataForGrid.pageableRequestBodyDTO.page = gPage;
        this.sendDataForGrid.pageableRequestBodyDTO.size = gSize

        this.getList();
    }

    getInstituteName(id: any) {
        let institute = this.trainingInstitutes.find(ti => ti.id == id)
        if (institute.id == id)
            return institute.name;
        else
            return "Not Found";
    }


    getList() {

        this.api.post(this.baseUrl + 'proposals/get-list', this.sendDataForGrid).subscribe((res) => {
                this.proposalModels = []

                if(res?.page?.content?.length > 0){
                let allInfo = res?.page?.content;

                // res?.page?.forEach(result => {
                //     result.isSubmittedString = result.isSubmitted ? "Yes" : "Not Submitted";
                //     this.proposalModels.push(result);
                // })

                this.proposalModels = allInfo;

                this.dataSource = new MatTableDataSource<ProposalModel>(this.proposalModels);
                this.total = res?.page?.totalElements
                this.pageSize = res?.page?.totalPages
                this._configurationService.getAllFiscalYearByFinalCopy().toPromise().then(
                    res => {
                        this.fiscalYears = res.items;
                        let data: any[] = this.proposalModels;
                        data.map(pp => {
                            pp.instituteName = pp.trainingInstituteProfileModel.trainingInstituteName
                            pp.fiscalYear = this.getFiscalYearName(pp.fiscalYearId)
                        });
                        this.dataSource = new MatTableDataSource<any>(data);
                    },
                    error => {
                        console.log(error)
                    }
                );
                this.spinner = false;
                }

            },
            error => {
                console.log(error)
                this.spinner = false;
            }
        );
    }

    deleteProposal(proposalId: number) {
        this._proposalService.deleteProposal(proposalId).subscribe(
            () => {
                this._toastService.success(deleteSuccess, "Success");
                this.getList();
            },
            error => {
                this._toastService.error(deleteFailed, "Error");
                console.log("Error: " + error);
            }
        );
    }

    getListByFiscalYear() {

    }

    openDialog(proposalId: number) {
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
                this.deleteProposal(proposalId);
            }
            dialogRef.close(true);
        });
    }

    onChangePage(event: PageEvent) {
        console.log('event == ', event);

        // this.size = +event.pageSize; // get the pageSize
        // this.page = +event.pageIndex; // get the current page

        let pageIndex = sessionStorage.setItem("page", JSON.stringify(event.pageIndex));
        let pageSize = sessionStorage.setItem("size", JSON.stringify(event.pageSize));

        this.sendDataForGrid.pageableRequestBodyDTO.page = +event.pageIndex;
        this.sendDataForGrid.pageableRequestBodyDTO.size = +event.pageSize;

        this.getList();
        //this.fiscalYearId ? this.getListByFiscalYear() : this.getList();

    }

    onChangeFiscalYear() {
        this.fiscalYearId ? this.getListByFiscalYear() : this.getList();
    }

    viewDetails(uuid: any, id: number , userId ) {
        this.route.navigate(['proposal-list/view/' + uuid + '/' + id +'/'+userId])
    }

    edit(element: any) {
        this.route.navigate(['proposal-list/edit/' + element.id]);
    }

    download(letter: EvaluatorsGrantAmountLetter) {
        this.service.downloadFile(letter.uploadSignatureFile).subscribe(
            _ => {
            }
        );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.activeFiscalYear.find(fy => fy.id === fiscalYearId);
        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "Fiscal Year";
    }


    convertDate(programDate: any) {
        return moment(programDate).format('DD-MM-YYYY');
    }

    goToProfile(element: any) {
        this.route.navigate(['/profile/' + '739bc694-b2dd-43b5-ab2c-925aac9075bf$' + element.trainingInstituteProfileModel.userId]);
    }

    goToProposal(uuid: any, id: number, userId :number) {
        this.route.navigate(['proposal-list/view/' + uuid + '/' + id +'/'+userId]);
    }

    getAvailableFiscalYear() {
        this._configurationService.getFiscalYearList().subscribe(res => {
        //this.proposalSubmissionService.getProposalSubmissionDates().subscribe(res => {
            this.activeFiscalYear= res.items;
        })
    }

    isApplicationPeriodActive(): boolean {
        const proposal = this.activeFiscalYear; // replace this with the actual data for the current proposal
        const startDate = new Date(proposal?.tiApplicationStartDate);
        const endDate = new Date(proposal?.tiApplicationEndDate);
        const today = new Date();
        return today >= startDate && today <= endDate;
    }

}

