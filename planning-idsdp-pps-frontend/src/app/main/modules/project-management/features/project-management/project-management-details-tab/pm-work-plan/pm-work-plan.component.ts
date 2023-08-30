import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PmWorkPlanService } from 'app/main/modules/project-management/service/pm-work-plan.service';
import { PmWorkPlanModel } from 'app/main/modules/project-management/models/pm-work-olan.model';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-pm-work-plan',
  templateUrl: './pm-work-plan.component.html',
  styleUrls: ['./pm-work-plan.component.scss']
})
export class PmWorkPlanComponent implements OnInit {

  @Input() dppTappMasterId: number;
  @Input() dppTappMasterUuid: string;
  @Input() dateCommencement: Date;
  @Input() dateCompletion: Date;
  @Output() goForward = new EventEmitter<boolean>();
  @Output() goBack = new EventEmitter<boolean>();
  @Output() goBackToHome = new EventEmitter<boolean>();

  pmWorkPlanList: PmWorkPlanModel[] = [];
  pmWorkPlanObj: PmWorkPlanModel;

  dataSource: MatTableDataSource<PmWorkPlanModel> = new MatTableDataSource();
  displayedColumns: string[] = ['sl', 'taskDetails', 'itemList', 'startDate', 'endDate', 'status', 'action'];
  spinner: boolean;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private pmWorkPlanService: PmWorkPlanService,
    private sanckbar: SnackbarHelper,
    private dialog: MatDialog,
    private router: Router,
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.getWorkPlanByDppTappUuid(this.dppTappMasterUuid);
  }

  getWorkPlanByDppTappUuid(dppTappMasterUuid) {
    this.pmWorkPlanService.getWorkPlanByDppTappUuid(dppTappMasterUuid).subscribe(
      res => {
        if (res.status && res.res) {
          this.pmWorkPlanList = res.res;
          this.dataSource = new MatTableDataSource(this.pmWorkPlanList);
        } else {
          this.addRow(0);
        }
      },
      err => {
        this.addRow(0);
      }
    )
  }

  addRow(index) {

    if (index > 0 && (!this.pmWorkPlanList[index].taskDetails || !this.pmWorkPlanList[index].itemName
      || !this.pmWorkPlanList[index].startDate || !this.pmWorkPlanList[index].endDate || !this.pmWorkPlanList[index].status)) {
      this.sanckbar.openErrorSnackBarWithMessage("Please Fill All Required Fileds!", "OK");
      return;
    }

    this.pmWorkPlanObj = new PmWorkPlanModel();
    this.pmWorkPlanObj.dppTappMasterId = this.dppTappMasterId;
    this.pmWorkPlanObj.dppTappMasterUuid = this.dppTappMasterUuid;

    this.pmWorkPlanList.push(this.pmWorkPlanObj)
    this.dataSource = new MatTableDataSource(this.pmWorkPlanList);
  }

  deleteRow(element, index) {

    if (!element.id) {
      this.pmWorkPlanList.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.pmWorkPlanList);
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = ConfirmDialogConstant.WIDTH;
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
    const dialogRef = this.dialog.open(
      SubmitConfirmationDialogComponent,
      dialogConfig
    );
    dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
      if (res) {
        this.pmWorkPlanService.deleteById(element.id).subscribe(
          res => {
            if (res.status) {
              this.sanckbar.openSuccessSnackBarWithMessage(res.message, "Ok");
              this.pmWorkPlanList.splice(index, 1);
              this.dataSource = new MatTableDataSource(this.pmWorkPlanList);
            } else {
              this.sanckbar.openWarnSnackBarWithMessage('Delete Filed !', 'ERROR');
            }
          },
          err => {
            this.sanckbar.openWarnSnackBarWithMessage('Error Occured While Delete!', 'ERROR');
          }
        )
      }
      dialogRef.close(true);
    });

  }

  onClickViewList() {
    this.router.navigate([`project-management/view-work-plan/${this.dppTappMasterUuid}/${this.dateCommencement}/${this.dateCompletion}`]);
  }

  saveAndNextTab() {
    this.createWorkPlan('Next');
  }

  saveAndExit() {
    this.createWorkPlan('Exit');
  }

  createWorkPlan(isSaveOrNextOrExit) {

    if (!this.pmWorkPlanList[0].taskDetails || !this.pmWorkPlanList[0].itemName
      || !this.pmWorkPlanList[0].startDate || !this.pmWorkPlanList[0].endDate || !this.pmWorkPlanList[0].status) {
      this.sanckbar.openErrorSnackBarWithMessage("Please Fill All Required Filed!", "OK");
      return;
    }
    this.pmWorkPlanService.createWorkPlan(this.pmWorkPlanList).subscribe(
      res => {
        if (res.status) {
          this.sanckbar.openSuccessSnackBarWithMessage(res.message, "OK");
          isSaveOrNextOrExit == 'Next' ? this.nextTab() : isSaveOrNextOrExit == 'Exit' ? this.goToHome() : this.getWorkPlanByDppTappUuid(this.dppTappMasterUuid);
        } else {
          this.sanckbar.openErrorSnackBarWithMessage('Work Plan Save Failed !', "ERROR");
        }
      },
      err => {
        this.sanckbar.openErrorSnackBarWithMessage('Error Occurred While Work Plan Save!', "ERROR");
      }
    )
  }

  onCheckStartDate(event, index) {
    if (this.dateCommencement >= event.target.value.format('yyyy/MM/DD')) {
      this.sanckbar.openWarnSnackBarWithMessage("Task Date Can't Be Less Than Project Start Date", "OK");
      this.pmWorkPlanList[index].startDate = null;
      this.dataSource = new MatTableDataSource(this.pmWorkPlanList);
    }
  }

  onCheckEndDate(event, element, index) {
    if (!element.startDate) {
      this.sanckbar.openWarnSnackBarWithMessage("Please Select Start Date", "OK");
      return;
    }
    if (moment(element.startDate).format('yyyy/MM/DD') >= event.target.value.format('yyyy/MM/DD')) {
      this.sanckbar.openWarnSnackBarWithMessage("End Date Can't Be Less Than Start Date", "OK");
      this.pmWorkPlanList[index].endDate = null;
    }
    if (event.target.value.format('yyyy/MM/DD') >= this.dateCompletion) {
      this.sanckbar.openWarnSnackBarWithMessage("End Date Can't Be Greter Than Project End Date", "OK");
      this.pmWorkPlanList[index].endDate = null;
    }
    this.dataSource = new MatTableDataSource(this.pmWorkPlanList);
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
