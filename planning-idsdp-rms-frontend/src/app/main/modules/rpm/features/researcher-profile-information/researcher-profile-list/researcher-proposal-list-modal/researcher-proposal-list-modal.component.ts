import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ResearchProfileListModel } from 'app/main/modules/rpm/models/ResearchProfileListModel';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { ResearchProfileMultiFormService } from 'app/main/modules/rpm/services/research-profile-multi-form.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ResearcherProposalService } from 'app/main/modules/rpm/services/researcher-proposal.service';
import { ResearcherProposal } from 'app/main/modules/rpm/models/ResearcherProposal';

@Component({
  selector: 'app-researcher-proposal-list-modal',
  templateUrl: './researcher-proposal-list-modal.component.html',
  styleUrls: ['./researcher-proposal-list-modal.component.scss']
})
export class ResearcherProposalListModalComponent implements OnInit {

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  data: any = {};


  displayedColumns: string[] = ['position', 'researchTitle', 'category', 'action'];
  dataSource: any;

  dataList: ResearcherProposal[] = [];
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;


  constructor(@Inject(MAT_DIALOG_DATA) data: { source: 'pc' | 'dpp' | 'tapp' | 'fs', sourceId: string, pcUuid: string, reportType: string },
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private snackbarHelper: SnackbarHelper,
    private matDialog: MatDialog,
    private _researcherProposalService: ResearcherProposalService,
    private _dialog: MatDialog,
    private _route: Router,
    private toastr: ToastrService,
    private dialog: MatDialog

  ) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.data = data;
  }

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.getListFindByResProfilePersonalInfoId();
    }
  }

  getListFindByResProfilePersonalInfoId() {
    this._researcherProposalService.getListFindByResProfilePersonalInfoId(this.page, this.pageSize, this.data.id).subscribe(res => {
      this.dataList = res.page ? res.page.content : [];
      this.dataSource = new MatTableDataSource(this.dataList);
    }, err => {
      console.log('Error');
    })

  }

  onChangePage(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getListFindByResProfilePersonalInfoId();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editRow(element) {

  }

  deleteProfile(uuId: string) {
  }

  openDialog(uuid: any) {

  }

  addResearcherProposal() {
    this._route.navigate(['researcher-proposal-informationn/' + this.data.uuid]);
    this.dialog.closeAll();
  }

  editResearcherProposal(uuId: any) {
    this._route.navigate(['researcher-proposal-informationn/edit/' + uuId]);
    this.dialog.closeAll();
  }

  showResearcherProposal(uuid: string) {
    this._route.navigate(['researcher-proposal-details/view/' + uuid]);
    this.dialog.closeAll();
  }

  private openProfileDeleteDialog(uuid: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = ConfirmDialogConstant.WIDTH;
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
    const dialogRef = this._dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {

        this.deleteProfile(uuid);

      }
      dialogRef.close(true);
    });
  }

    letterSubmission(uuid: any) {
        this._route.navigate(['researcher-proposal-submission-letter/' + uuid]);
        this.dialog.closeAll();

    }
}
