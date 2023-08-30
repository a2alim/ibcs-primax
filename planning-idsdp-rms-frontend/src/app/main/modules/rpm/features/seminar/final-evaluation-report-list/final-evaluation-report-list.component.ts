import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { deleteIcon, editIcon, viewIcon, deleteSuccess, deleteFailed } from '../../../constants/button.constants';
import { FinalEvaluationReportModel } from '../../../models/final-evaluation-report.model';
import { FinalEvaluationReportService } from '../../../services/final-evaluation-report.service';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-final-evaluation-report-list',
  templateUrl: './final-evaluation-report-list.component.html',
  styleUrls: ['./final-evaluation-report-list.component.scss']
})
export class FinalEvaluationReportListComponent implements OnInit {

  /*----Button---*/
  editIcon = editIcon;
  deleteIcon = deleteIcon;
  viewIcon = viewIcon;
  deleteSuccess = deleteSuccess;
  deleteFailed = deleteFailed;
  /*----/Button---*/

  subscription: Subscription;
  spinner: boolean = false;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = '';

  displayedColumns: string[] = ['sl', 'researchObjectives', 'describeProblem', 'note', 'action'];
  dataSource: MatTableDataSource<FinalEvaluationReportModel> = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;

  page: number = DEFAULT_PAGE;
  size: number = DEFAULT_SIZE;
  total: number = 0;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private _router: Router,
    private finalEvaluationReportService: FinalEvaluationReportService
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.spinner = true;
    this.finalEvaluationReportService.getListWithPagination(this.page, this.size).subscribe(
      res => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.page?.content);
          this.dataSource.sort = this.sort;
          this.total = res.page?.totalElements;
        }
        this.spinner = false;
      },
      err => {
        this.spinner = false;
        console.log('Get list with pagination err', err);
      }
    )
  }

  onChangePage(event: PageEvent) {
    this.size = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getList();
  }

  /*---- For open popup dialog box----*/
  private openDeleteDialog(uuid: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = ConfirmDialogConstant.WIDTH;
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
    const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

    dialogRef.componentInstance.closeEventEmitter.subscribe(
      res => {
        if (res) {
          this.finalEvaluationReportService.delete(uuid).subscribe(
            res => {
              if (res) {
                this.toastr.success(this.deleteSuccess);
                this.getList();
              } else {
                this.toastr.error(this.deleteFailed);
              }
            },
            err => {
              this.toastr.error("Something went wrong!");
              console.log('Final Evaluation Report Delete err', err);
            }
          )
        }
        dialogRef.close(true);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editRow(uuid) {
    this._router.navigate(['/final-evaluation-report/add-edit/' + uuid + '/null'])
  }

}
