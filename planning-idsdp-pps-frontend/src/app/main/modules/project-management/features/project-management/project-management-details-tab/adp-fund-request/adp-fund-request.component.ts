import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { PmViewSelectionModel } from "../../../../models/pm-view-schedule.model";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { TappAnnualPhasingCostService } from "../../../../../dpp-tapp-management/services/tapp-annual-phasing-cost.service";
import { DppAnnualPhasingConstant } from "../../../../../dpp-tapp-management/constants/dpp-annual-phasing.constant";
import { DppAnnualPhasingCostService } from "../../../../../dpp-tapp-management/services/dpp-annual-phasing-cost.service";
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdpFundReqModel } from 'app/main/modules/project-management/models/adp-fund-rea.model';
import { AdpFundReqService } from 'app/main/modules/project-management/service/adp-fund-req.service';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';

@Component({
    selector: 'app-adp-fund-request',
    templateUrl: './adp-fund-request.component.html',
    styleUrls: ['./adp-fund-request.component.scss']
})
export class AdpFundRequestComponent implements OnInit {

    @ViewChild('adpFundRq') adpFundRq: NgForm;
    @Input() dppTappMasterId: number;
    @Input() dppTappMasterUuid: string;
    @Input() projectConceptMasterId: number;
    @Input() projectConceptMasterUuid: number;
    @Input() type: string;
    @Input() dateCommencement: Date;
    @Input() dateCompletion: Date;

    @Output() goForward = new EventEmitter<boolean>();
    @Output() goBack = new EventEmitter<boolean>();
    @Output() goBackToHome = new EventEmitter<boolean>();

    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    displayedColumns: string[] = ['sl', 'sector', 'subSector', 'fiscalYear', 'period', 'cumulativeExpenditureUpTo', 'formType', 'action'];
    totals: number;
    res: any;
    projectAid: number;
    pmViewSelectionModel: PmViewSelectionModel = new PmViewSelectionModel();
    isContinuedDisabled: boolean;
    adpFundReqformGroup: FormGroup;
    isEndDateDisabled: boolean;
    spinner: boolean;
    fiscalYear: string;
    total: number;
    formTitle: string = 'অর্থবছরের বার্ষিক উন্নয়ন কর্মসূচিতে (কারিগরী সহায়তা)';

    monthList: any = ['জানুয়ারি', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগষ্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']

    adpFundReqModel: AdpFundReqModel = new AdpFundReqModel();
    fiscalYearList: any[] = []

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;

    constructor(
        private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
        private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
        private _formBuilder: FormBuilder,
        private sanckbar: SnackbarHelper,
        private validation: GlobalValidationService,
        private adpFundReqService: AdpFundReqService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.getFiscalYearList();
        this.getTotal();
        this.getAdpFundReqByDppTappUuid(this.dppTappMasterUuid);
    }

    createForm() {
        this.adpFundReqformGroup = this._formBuilder.group({

            id: [''],
            uuid: [''],
            dppTappMasterId: [this.dppTappMasterId, ''],
            dppTappMasterUuid: [this.dppTappMasterUuid, ''],
            projectConceptMasterId: [this.projectConceptMasterId, ''],
            projectConceptMasterUuid: [this.projectConceptMasterUuid, ''],

            sector: ['', [Validators.required]],
            subSector: ['', [Validators.required]],
            fiscalYear: ['', [Validators.required]],
            periodFrom: ['', [Validators.required]],
            periodTo: ['', [Validators.required]],
            cumulativeExpenditureUpTo: ['', [Validators.required]],
            formType: ['', [Validators.required]],

            projectTitle: [''],
            projectExecutionPeriod: [''],
            approvalStage: [''],
            totalProjectExp: [''],
            totalProjectAid: [''],
            totalRevisedAllowcation: [''],
            revisedAllowcationTk: [''],
            totalActualCost: [''],
            actualCostTk: [''],
            totalCumulativeCost: [''],
            cumulativeCostTk: [''],
            totalProposedAllocation: [''],

            proposedAllocationTk: ['', [this.validation.checkString('this')]],
            proposedAllocationRevenue: ['', [this.validation.checkString('this')]],
            expSectorCapital: ['', [this.validation.checkString('this')]],
            expSectorTk: ['', [this.validation.checkString('this')]],
            expSectorRevenue: ['', [this.validation.checkString('this')]],
            allocationForTax: ['', [this.validation.checkString('this')]],
            projectAidCost: ['', [this.validation.checkString('this')]],
            projectAidTk: ['', [this.validation.checkString('this')]],
            other: ['', [this.validation.checkString('this')]],

        });

    }

    getFiscalYearList() {

        const a = new Date(this.dateCommencement);
        const b = new Date(this.dateCompletion);

        let fYear = a.getFullYear();
        let lYear = b.getFullYear();

        if (a.getMonth() < 6) {
            fYear = a.getFullYear() - 1;
        }
        if (b.getMonth() > 5) {
            lYear = b.getFullYear() + 1;
        }

        let total = lYear - fYear;
        let startingYear = fYear;

        while (total > 0) {
            let nextYear = (startingYear + 1);
            this.fiscalYearList.push({ fiscalYear: (startingYear + "-" + nextYear) });
            startingYear += 1;
            total -= 1;
        }

    }

    onChangeFiscalYear() {
        this.onChangeFormType();
    }

    onChangeFormType() {
        let formType = this.adpFundReqformGroup.get('formType').value;
        let fisYear = this.adpFundReqformGroup.get('fiscalYear').value ? this.adpFundReqformGroup.get('fiscalYear').value : '';
        if (formType == 'এ,ডি,পি') {
            this.formTitle = fisYear + ' অর্থ বছরের বার্ষিক উন্নয়ন কর্মসূচিতে (কারিগরী সহায়তা)';
        } else if (formType == 'আর,এ,ডি,পি') {
            this.formTitle = fisYear + ' অর্থ বছরের সংশোধিত বার্ষিক উন্নয়ন কর্মসূচিতে (কারিগরী সহায়তা)'
        } else {
            this.formTitle = fisYear + ' অর্থ বছরের বার্ষিক উন্নয়ন কর্মসূচিতে (কারিগরী সহায়তা)';
        }
    }

    onClickSave() {
        if (this.adpFundReqformGroup.valid) {
            this.submitForm();
        } else {
            return this.sanckbar.openErrorSnackBarWithMessage('প্রয়োজনীয় ক্ষেত্র পূরণ করুন!', 'ঠিক আছে');
        }
    }

    submitForm() {

        this.spinner = true;
        this.adpFundReqModel = this.adpFundReqformGroup.value;

        this.adpFundReqService.createUpdateAdpFundReq(this.adpFundReqModel).subscribe(
            res => {
                if (res.success) {
                    this.sanckbar.openSuccessSnackBarWithMessage('সফলভাবে সংরক্ষিত', 'ঠিক আছে');
                    this.adpFundReqformGroup.reset();
                    this.adpFundRq.resetForm();
                    this.adpFundReqModel = new AdpFundReqModel();
                    this.getAdpFundReqByDppTappUuid(this.dppTappMasterUuid);
                } else {
                    this.sanckbar.openErrorSnackBarWithMessage('সংরক্ষিত ব্যর্থ হয়েছে!', 'ঠিক আছে');
                }
                this.spinner = false;
            },
            err => {
                this.spinner = false;
                this.sanckbar.openErrorSnackBarWithMessage('ত্রুটি ঘটেছে!', 'ঠিক আছে');
            }
        )
    }

    getAdpFundReqByDppTappUuid(dppTappMasterUuid) {
        this.adpFundReqService.getAdpFundReqByDppTappUuid(dppTappMasterUuid).subscribe(
            res => {
                this.total = 0;
                if (res.success && res.items) {
                    this.total = res.items.length;
                    this.dataSource = new MatTableDataSource(res.items);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                } else {
                    this.dataSource = new MatTableDataSource();
                }
            },
            err => {
            }
        )
    }

    onClickEdit(data) {
        this.adpFundReqformGroup.patchValue(data);
        this.adpFundReqModel = data;
    }

    onClickDelete(data) {
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
                this.adpFundReqService.deletePdSelectionByUuid(data.uuid).subscribe(
                    res => {
                        if (res.success) {
                            this.sanckbar.openSuccessSnackBarWithMessage('সফলভাবে মুছে ফেলা হয়েছে', 'ঠিক আছে');
                            this.getAdpFundReqByDppTappUuid(data.dppTappMasterUuid);
                        } else {
                            this.sanckbar.openErrorSnackBarWithMessage('মুছে ফেলা ব্যর্থ হয়েছে!', 'ঠিক আছে');
                        }
                    },
                    err => {
                        this.sanckbar.openErrorSnackBarWithMessage('ত্রুটি ঘটেছে!', 'ঠিক আছে');
                    }
                )
            }
            dialogRef.close(true);
        });
    }


    getTotal() {
        if (this.type === 'DPP') {

            this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.projectConceptMasterId).subscribe(res => {
                if (res.length > 1) {
                    this.res = res;
                    //let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                    //this.totals=total[0].gobAmount+ total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount+ total[0].ownFundAmount+ total[0].otherAmount;
                    //this.projectAid=total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount
                }

            });

        } if (this.type === 'TAPP') {

            this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.projectConceptMasterId).subscribe(res => {
                if (res.length > 1) {
                    this.res = res;
                    // let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.tappAnnualPhasingCostTotal)[0];
                    // this.totals=(total[0].gobAmount+ total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount+ total[0].otherAmount);
                    // this.projectAid= total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount;
                }
            });

        }

    }

    fiscal() {
        this.dataMan(this.res, this.fiscalYear)
    }

    dataMan(data, fiscalYear) {
        let data2: any;
        let data3: any;
        data?.forEach(res => {
            if (res?.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total) {
                data2 = res?.grandTotal;
            }
        });

        data2?.forEach(d2 => {
            if (d2?.fiscalYear == fiscalYear) {
                data3 = d2?.dppAnnualPhasingCostTotal
            }

        })

        this.totals = data3?.totalAmount ? data3.totalAmount : 0.00;
        this.projectAid = data3?.gobThruAmount + data3?.spAcAmount + data3?.thruDpAmount + data3?.thruPdAmount ? data3.gobThruAmount + data.spAcAmount + data3.thruDpAmount + data3.thruPdAmount : 0.00
    }

    nextTab() {
        this.goForward.emit(true);
    }

    previousTab(): void {
        this.goBack.emit(true);
    }

    goToHome(): void {
        this.goBackToHome.emit(true);
    }
}
