import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon, deleteIcon, editIcon, viewIcon} from '../../../constants/button.constants';
import {ToastrService} from 'ngx-toastr';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {
    SubmitConfirmationDialogComponent
} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {DataComService} from 'app/main/core/services/data-com/data-com.service';
import {CreateLetterGedServiceService} from "../../../services/create-letter-ged-service.service";
import {InstallmentProcessService} from "../../../services/installment-process.service";
import {InstallmentTypeServiceService} from "../../../../settings/services/installment-type-service.service";
import {MatSelectChange} from "@angular/material/select";
import {StorageService} from 'app/main/core/services/storage/storage.service';
import {CreateGoLetterServiceService} from "../../../services/create-go-letter-service.service";
import {UplodFileModalComponent} from './uplod-file-modal/uplod-file-modal.component';
import {GoLetterComponent} from './go-letter/go-letter.component';
import {ViewGoLetterComponent} from './view-go-letter/view-go-letter.component';
import {environment} from 'environments/environment';
import {MIN_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";
import { AgreementWithResearcherServiceService } from '../../../services/agreement-with-researcher-service.service';

@Component({
    selector: 'app-installment-process-list',
    templateUrl: './installment-process-list.component.html',
    styleUrls: ['./installment-process-list.component.scss']
})
export class InstallmentProcessListComponent implements OnInit {
    displayedColumns: string[] = ['position', 'researchTitle', 'installmentTypes', 'percentageAmount', 'tkAmount', 'installmentDate', 'createGoLetter', 'installmentStatus', 'action'];
    displayedColumnsRe: string[] = ['position', 'researchTitle', 'installmentTypes', 'percentageAmount', 'tkAmount', 'installmentDate', 'installmentStatus', 'action'];
    dataSource: any;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    fiscalYearListFull: any[] = [];
    installmentTypeList: any[] = [];
    userDetails: any;
    /*----Button---*/

    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    spinner: boolean = false;
    isDisabled: boolean = false;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

    /*----/Button---*/
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private createLetterService: CreateLetterGedServiceService,
        private _dialog: MatDialog,
        private _route: Router,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private gedService: CreateLetterGedServiceService,
        private installmentProcess: InstallmentProcessService,
        private installmenttype: InstallmentTypeServiceService,
        private StorageService: StorageService,
        private geoLetterService: CreateGoLetterServiceService,
        private agreementService : AgreementWithResearcherServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.userDetails = this.StorageService.getUserData();
        this.getListData();
        this.getInstallment();
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData();
        //this.getProcurementType();
    }

    add() {
        this.dataCom.setPassedItemData(false);
        this.createLetterService.data = null;
        this.router.navigate(['/create-letter-ged']);
    }

    editRow(row) {
        // this.createLetterService.data=row;
        this.router.navigate(['installment-process/edit/' + row.uuid]);
    }

    viewDetails(uuid) {
        this.router.navigate(['/installment-process/view/all/' + uuid]);
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

                this.delete(rowUuid);

            }
            dialogRef.close(true);
        });
    }

    openDialogForGo(rowUuid, id) {
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

                this.deleteGoLetter(rowUuid, id);

            }
            dialogRef.close(true);
        });
    }

    deleteGoLetter(uuid, id) {
        this.geoLetterService.deleteGoLetterByUuid(uuid).subscribe(res => {
            if (res.success) {
                this.installmentProcess.updateById(id, 'null').subscribe(data => {
                    if (data.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.userDetails = this.StorageService.getUserData();
                        this.getListData();
                        this.getInstallment();
                    } else {
                        this.toastr.warning(res.message, "", this.config);
                    }
                })
            }
        })

    }

/*    getListData() {
        this.spinner = true;
        this.installmentProcess.getInstallmentProcess(this.page, this.pageSize).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.page ? res.page.content : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
            this.spinner = false;

        }, error => {
            this.spinner = false;
        });

    }*/

    viewDetailsAgreementInfo(row){   
        console.log("row == ", row);     
        let proposal_id = row.m1ResearcherProposalId?.id || "";
        let researcherProfileUuid = row.m1ResearcherProposalId?.researcherProfilePersonalInfoMaster?.uuid
        let userId = row.m1ResearcherProposalId?.researcherProfilePersonalInfoMaster?.userId
        
        this.agreementService.getAgreementInfoByProposalId(proposal_id).subscribe( res => {
            console.log('res => ', res);
            if(res?.success)
            {
                let agreementUuid = res?.obj.uuid
                //this._route.navigate([`agreement-process/${agreementUuid}/view/${researcherProfileUuid}/${userId}`])
                const url = this.router.createUrlTree([`agreement-process/${agreementUuid}/view/${researcherProfileUuid}/${userId}`])
                window.open(url.toString(), '_blank')
            }
        })   
    }

    getListData() {
        this.spinner = true;
        this.installmentProcess.getInstallmentProcess(this.page, this.pageSize).subscribe(res => {

            let installmentList = res.page ? res.page.content : [];
            if(this.userDetails.userType!='Rms_DO'){
                let filter = installmentList.filter(data=>data.m1ResearcherProposalId.researcherProfilePersonalInfoMaster.userId === +(this.userDetails.id));
                console.log('filter == ', filter);
                this.dataSource = new MatTableDataSource(filter ? filter : []);
                this.totalElements = filter ? filter.length : 0;
            }else {
                this.dataSource = new MatTableDataSource(res.page ? res.page.content : []);
                this.totalElements = res.page ? res.page.totalElements : 0;
            }

            this.spinner = false;

        }, error => {
            this.spinner = false;
        });

    }

    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue)
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    delete(rowUuid) {
        this.installmentProcess.delete(rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getListData();
            } else {
                this.toastr.warning(res.message, "", this.config);
            }
        });
    }

    getInstallmentId(row) {
        this.installmentProcess.processId = row.id;
        this._route.navigate([`go-letter-list/${row.uuid}/create-go-letter`]).then((e) => {
            console.log(e)
        });
    }

    getInstallment() {
        this.installmenttype.getAll().subscribe(data => {
            this.installmentTypeList = data.items;
        })
    }

    openDialogForStatus($event: MatSelectChange, row) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.STATUS};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.status(row);
            } else {
                this.getListData();
            }
            dialogRef.close(true);
        });
    }

    status(row) {
        this.installmentProcess.updateStatus(row).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getListData();
            } else {
                this.toastr.warning(res.message, "", this.config);
                this.getListData();
            }
        });
    }

    viewGoDetails(uuid: any) {
        this._route.navigate([`go-letter-list/${uuid}/download-go-letter`])
        this.geoLetterService.getGoLetterByUuid(uuid).subscribe(res => {
            if (res) {
                this.geoLetterService.download = res;
                this._route.navigate([`go-letter-list/${uuid}/download-go-letter`])
            }
        });
    }

    editGoRow(uuid: any) {

        this.geoLetterService.getGoLetterByUuid(uuid).subscribe(res => {
            if (res) {
                this.geoLetterService.mode = 'Edit';
                this.geoLetterService.element = res;
                this._route.navigate([`go-letter-list/${uuid}/update-go-letter`]).then(r => console.log(r));
            }
        });

    }

    uploadFileForGioLetter(row: any) {

        if (!row.goLetterResponseDto) {
            this.toastr.warning("Go Letter not save yeat.", "", this.config);
            return;
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '40%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {...row.goLetterResponseDto};

        const dialogRef = this._dialog.open(UplodFileModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.getListData();
            }
        });
    }

    createGoLetter(row: any) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '70%';
        dialogConfig.height = '95%';
        dialogConfig.data = {...row.goLetterResponseDto, installmentProcessId: row.id, installmentProcess : row};

        const dialogRef = this._dialog.open(GoLetterComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.getListData();
            }
        });
    }

    viewGoLetter(row: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '70%';
        dialogConfig.height = '95%';
        dialogConfig.data = {...row.goLetterResponseDto, installmentProcessId: row.id};

        const dialogRef = this._dialog.open(ViewGoLetterComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.getListData();
            }
        });
    }

    downloadFile(data: any) {
        window.open(environment.ibcs.minioEndPointHost + data.fileDownloadUrl);
    }


    processInstallment(installmentTypes: any) {
        let val = "";
        JSON.parse(installmentTypes).map(data => {
            if (val === "") {
                val = data.installment;
            } else {
                val += ","+data.installment;
            }
        })
        return val;
    }
}
