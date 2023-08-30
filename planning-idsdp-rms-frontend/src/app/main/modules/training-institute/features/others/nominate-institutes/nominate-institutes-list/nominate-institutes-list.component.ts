import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    dataNotFount,
    deleteFailed,
    deleteSuccess,
    emailIcon,
    pdfIcon,
    refreshIcon,
    saveFailed,
    saveSuccess,
    sentSuccess,
    updateFailed,
    updateSuccess,
    uploadIcon,
    viewIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { EvaluatorsGrantAmountLetter } from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import { RmsEvaluatorsGrantAmountLetterService } from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import { ConfigurationService } from 'app/main/modules/settings/services/configuration.service';
import { ProposalModel } from 'app/main/modules/training-institute/models/proposal.model';
import { ProposalService } from 'app/main/modules/training-institute/services/proposal.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from 'ngx-toastr';
import { NominatedInstituteModel } from "../../../../models/nominated-institute.model";
import { NominatedInstituteService } from "../../../../services/nominated-institute.service";
import { TrainingInstituteProfileService } from "../../../../services/training-institute-profile.service";
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";
import { UploadENothiComponent } from "../upload-e-nothi/upload-e-nothi.component";

@Component({
    selector: 'app-nominate-institutes-list',
    templateUrl: './nominate-institutes-list.component.html',
    styleUrls: ['./nominate-institutes-list.component.scss']
})
export class NominateInstitutesListComponent implements OnInit {

    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;
    spinner7: boolean = false;

    displayedColumns: string[] = ['sl', 'proposedTrainerName', 'trainingDuration', 'programDate', 'sortList', 'eDocumentStatus', 'action'];
    dataSource: MatTableDataSource<any>;
    proposalModels: ProposalModel[] = [];
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    proposalTitle: string = "";
    isShortListed: any;

    addNewIcon = addNewIcon;
    emailIcon = emailIcon;
    pdfIcon = pdfIcon;
    viewIcon = viewIcon;
    uploadIcon = uploadIcon;
    userDetails: any;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;
    refreshIcon = refreshIcon;

    fiscalYears: any[] = [];
    trainingInstitutes: any[] = [];
    userType: string = this._authService.getLoggedUserType();
    trainingInstituteId: number;
    private nominatedInstitutes: NominatedInstituteModel[];
    selectedTrainingInstitute: String;

    proposalList: any[] = [];
    proposalListNew: any[] = [];
    traningInstituteList: any[] = [];

    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;


    proposalStatusList: any[] = [
        { sl: 1, value: 0, label: 'Pending' },
        { sl: 2, value: 1, label: 'Rejected' },
        { sl: 3, value: 2, label: 'Approved' },
        { sl: 4, value: 3, label: 'Awaiting Final Report' },
        { sl: 5, value: 4, label: 'Completed' }
    ]

    isShortList: any[] = [
        { sl: 1, value: true, label: 'Yes' },
        { sl: 2, value: false, label: 'No' }
    ]


    sendDataForGrid: {

        fiscalYearId: number,
        profileId: number,
        proposalId: number,
        approvalStatus: number,
        isShortListed: string;
        userId: string;

        pageableRequestBodyDTO: {
            page: number,
            size: number
        }

    } = {
            fiscalYearId: 0,
            profileId: 0,
            proposalId: 0,
            approvalStatus: 9,
            isShortListed: 'null',
            userId: null,


            pageableRequestBodyDTO: {
                page: this.page,
                size: this.pageSize
            }
        };

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: RmsEvaluatorsGrantAmountLetterService,
        private route: Router,
        private dialog: MatDialog,
        private _toastService: ToastrService,
        private _proposalService: ProposalService,
        private _authService: AuthService,
        private _configurationService: ConfigurationService,
        private _nominatedInstituteService: NominatedInstituteService,
        private _trainingInstituteProfileService: TrainingInstituteProfileService,
        private _dialog: MatDialog,
    ) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.userDetails = this._authService.getLoggedUserDetails();
        this.sendDataForGrid.fiscalYearId = Number(0);
        //this.spinner = true;
        //this.getAllTrainersInstitutesList();
        // this.getList();
        //this.getNominatedInstitutes();

        //mm
        this.proposalStatusList.unshift({ value: 9, label: '---- Select ----' });
        this.isShortList.unshift({ value: 'null', label: '---- Select ----' });
        this.getFiscalYears();
        this.getProposaByFiscalYear(null);
        this.getGridList();
    }

    getInstituteName(createdBy: any) {
        let institute = this.trainingInstitutes.find(ti => ti.id == createdBy);
        if (institute.id == createdBy)
            return institute.name;
        else
            return "XYZ Institute";
    }

    onChangeTrainingInstitutes($event: any) {
        if ($event.value != '')
            this.dataSource = new MatTableDataSource(this.proposalModels.filter(res => +($event.value) === +(res.createdBy)))
        else
            this.dataSource = new MatTableDataSource(this.proposalModels)
    }

    deleteProposal(proposalId: number) {
        this._proposalService.deleteProposal(proposalId).subscribe(
            () => {
                this._toastService.success(deleteSuccess, "Success");
                this.getNominatedInstitutes();
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
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getGridList()
    }

    viewDetails(uuid: any, id: number, userId) {
        this.route.navigate(['nominate-institutes/view/' + uuid + '/' + id + '/' + userId]);
    }

    edit(id: number) {
        this.route.navigate(['proposal-list/edit/' + id]);
    }

    download(letter: EvaluatorsGrantAmountLetter) {
        this.service.downloadFile(letter.uploadSignatureFile).subscribe(
            _ => {
            }
        );
    }

    filterByInstitute() {
        const filterValue = this.selectedTrainingInstitute;
        this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    openSendMailDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(UploadENothiComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this._toastService.success("E-Nothi uploaded", "Success")
            }
            dialogRef.close(true);
        });
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }

    onCheckBoxChange(checked: boolean, id) {
        this.spinner4 = true;
        this._nominatedInstituteService.changeShortListStatus(id, checked).subscribe(
            response => {
                this.spinner4 = false;
                this._toastService.success("Status Changed", "Success");
                this.getGridList();
            },
            error => {
                this.spinner4 = false;
                this._toastService.error(error.error.message, "Error");
                console.log("Error: " + error);
            }
        );
    }

    shortListedConfirmationDialog(checked: boolean, id) {

        let message = checked ? 'Do your want to add the proposal to the short list?' : 'Do you want to remove the proposal from the short list?'

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: message };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.onCheckBoxChange(checked, id);
            } else {
                this.getGridList();
            }
            dialogRef.close(true);
        });
    }

    public getNominatedInstitutes() {
        this._nominatedInstituteService.getNominateInstitutes(this.page, this.size, this.isShortListed,
            this.trainingInstituteId, this.fiscalYearId).subscribe(
                res => {
                    this.nominatedInstitutes = res.data;
                    this.total = res.totalItems;
                    this.dataSource = new MatTableDataSource<any>(this.nominatedInstitutes);

                },
                error => {
                    console.log(error);
                }
            )
    }

    public goToENothiView() {
        if (this.isShortListed == "")
            this.isShortListed = undefined;

        this.route.navigate([`nominate-institutes/e-documents/${this.page}/${this.size}/${this.isShortListed}/${this.trainingInstituteId}/${this.fiscalYearId}`]);
    }

    public goToEDocView() {
        this.route.navigate([`nominate-institutes/e-documents/view`]);
    }


    changeENothiStatusDialog(value: string, id: number) {
        let f = this.proposalStatusList.find(f => f.value === value);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: `Do you want to change status ${f.label}` };
        const dialogRef = this._dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.changeENothiStatus(value, id);
            } else {
                this.getGridList();
            }
            dialogRef.close(true);
        });

    }


    changeENothiStatus(selectValue: string, id: number) {
        this.spinner5 = true;
        this._nominatedInstituteService.changeENothiStatus(id, selectValue).subscribe(
            response => {
                this._toastService.success("Status Changed", "Success");
                this.getGridList();
                this.spinner5 = false;
            },
            error => {
                this._toastService.error(error.error.message, "Error");
                console.log(error);
                this.spinner5 = false;
            }
        );
    }

    private getAllTrainersInstitutesList() {
        this._trainingInstituteProfileService.getTrainingInstituteList().subscribe(
            res => {
                this.trainingInstitutes = res.data;
                this.spinner = false
            },
            error => {
                console.log(error)
            }
        )

    }

    goToCompletionReport(element) {
        if (element.completionReportId) {
            this.route.navigate([`completion-report/edit/${element.completionReportId}`]);
        } else {
            this.route.navigate([`completion-report/${element.id}/add`]);
        }
    }

    viewCompletionReport(element) {
        this.route.navigate(['completion-report/view/' + element.completionReportId]);
    }

    private getFiscalYears() {
        this.spinner = true;
        this._configurationService.getFiscalYearList().subscribe(res => {
                this.fiscalYears = res.items;
                this.fiscalYears.unshift({ id: 0, fiscalYear: '---- Select ----' });
                this.spinner = false;
            },
            error => {
                console.log(error);
                this.spinner = false;
            }
        )

    }


    getProposaByFiscalYear(fiscalYear: any) {

        this.sendDataForGrid.profileId = Number(0);
        this.sendDataForGrid.proposalId = Number(0);

        this.spinner6 = true;
        this._proposalService.getProposalsByFiscalYear(fiscalYear).subscribe(
            response => {
                if (response.success && response.items) {
                    this.proposalList = response.items ? response.items : [];
                    this.traningInstituteList = [];
                    this.proposalList.forEach(e => {
                        let f = this.traningInstituteList.find(f => f.profileId === e.trainingInstituteProfileModel.id);
                        if (!f) {
                            this.traningInstituteList.push({ profileId: e.trainingInstituteProfileModel.id, instituteName: e.trainingInstituteProfileModel.trainingInstituteName });
                        }
                    });
                    this.proposalList.unshift({ id: 0, trainingName: '---- Select ----' });
                    this.traningInstituteList.unshift({ profileId: 0, instituteName: '---- Select ----' });
                    this.spinner6 = false;
                } else {
                    this.proposalList = [];
                    this.traningInstituteList = [];
                    this.proposalList.unshift({ id: 0, trainingName: '---- Select ----' });
                    this.traningInstituteList.unshift({ profileId: 0, instituteName: '---- Select ----' });
                    this.spinner6 = false;
                }
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner6 = false;
            }
        );
    }


    getGridList() {
        if (this.userType === 'Rms_Training_Institute') {
            this.sendDataForGrid.userId = this.userDetails.id;
        }

        this.spinner7 = true;
        this._nominatedInstituteService.getProposalGridList(this.sendDataForGrid).subscribe(res => {

            this.dataSource = new MatTableDataSource(res.content ? res.content : []);
            this.totalElements = res.totalElements;
            this.spinner7 = false;
        },
            error => {
                console.log('error ==== >>>>> ', error);
                this.spinner7 = false;
            }
        );
    }

    onSelectFiscalYear(event) {
        if (event.value && event.value != "0") {
            this.getProposaByFiscalYear(event.value);
        } else {
            this.getProposaByFiscalYear(null);
        }
    }

    onSelectTrainingInstitute(event) {
        if (event.value && event.value != "0") {
            this.proposalListNew = this.proposalList.filter(f => f.trainingInstituteProfileModel && f.trainingInstituteProfileModel.id == event.value);
            this.proposalListNew.unshift({ id: 0, trainingName: '---- Select ----' });
        }
    }

    onSelectTrainingTitle(event) {

    }

    onSubmit() {
        this.getGridList();
    }

    reset() {
        this.sendDataForGrid = {
            fiscalYearId: 0,
            profileId: 0,
            proposalId: 0,
            approvalStatus: 9,
            isShortListed: 'null',
            userId: null,
            pageableRequestBodyDTO: {
                page: this.page,
                size: this.pageSize
            }
        };

        this.getGridList();
        this.getFiscalYears();
    }


    goToProfile(element: any) {
        this.route.navigate(['/profile/' + '739bc694-b2dd-43b5-ab2c-925aac9075bf$' + element.userId]);
    }

    goToProposal(uuid: any, id: number) {
        this.route.navigate(['nominate-institutes/view/' + uuid + '/' + id]);
    }


}
