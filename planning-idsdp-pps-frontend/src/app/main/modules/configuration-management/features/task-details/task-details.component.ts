import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { TaskDetailsModel } from '../../models/task-details.model';
import { TaskDetailsService } from '../../services/task-details.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglishAction } from './i18n/bn';
import { OK, SUCCESSFULLY_UPDATED } from 'app/main/core/constants/message';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  total: number;
  size: number = DEFAULT_SIZE;
  page: number = DEFAULT_PAGE;
  frmGroup: FormGroup;
  editValue: boolean;
  uuid: string;
  disableDelete: boolean;
  model: TaskDetailsModel = new TaskDetailsModel();
  taskDetailsList: TaskDetailsModel[] = new Array<TaskDetailsModel>();
  displayedColumns: string[] = ['id', 'name', 'progress', 'color', 'action'];
  dataSource = new MatTableDataSource(this.taskDetailsList);

  actionPermission = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private formBuilder: FormBuilder,
    private taskDetailsService: TaskDetailsService,
    private snackbarHelper: SnackbarHelper,
    private matDialog: MatDialog,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(
      lngEnglish,
      lngBangla
    );
  }

  ngOnInit(): void {
    this.actionPermission = lngEnglishAction.ACTION;
    this.frmGroup = this.formBuilder.group({
      nameBangla: ['', Validators.required],
      nameEnglish: ['', Validators.required],
      description: ['', ''],
      status: ['true', Validators.required],
    });
    this.getProcurementType();
  }
  /*
  create Task Details
  */
  create() {
    this.model.nameBn = this.frmGroup.value.nameBangla;
    this.model.nameEn = this.frmGroup.value.nameEnglish;
    this.model.description = this.frmGroup.value.description;
    this.model.status = this.frmGroup.value.status;
    console.log(this.model);
    if (this.frmGroup.value.nameBangla != null && this.frmGroup.value.nameEnglish && this.frmGroup.value.status) {
      this.taskDetailsService.create(this.model).subscribe(res => {
        this.snackbarHelper.openSuccessSnackBar();
        this.disableDelete = false;
        this.resetValue();
        this.getProcurementType();
      }, error => {
        this.snackbarHelper.openErrorSnackBar();
      });
    }
  }
  /*
   edit Task Details
  */
  edit(uuid: string) {
    this.disableDelete = true;
    this.editValue = true;
    console.log(uuid);
    this.taskDetailsService.getByUuid(uuid).subscribe(res => {
      this.setValue(res);
      this.editValue = true;
      this.uuid = uuid;
    });
  }
  /*
   update Task Details
   */
  update() {
    console.log(this.uuid);
    this.model.nameBn = this.frmGroup.value.nameBangla;
    this.model.nameEn = this.frmGroup.value.nameEnglish;
    this.model.description = this.frmGroup.value.description;
    this.model.status = this.frmGroup.value.status;
    this.model.uuid = this.uuid;
    this.taskDetailsService.update(this.model).subscribe(res => {
      this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
      this.resetValue();
      this.editValue = false;
      this.disableDelete = false;
      this.uuid = '';
      this.model.uuid = '';
      this.getProcurementType();
    }, error => {
      this.snackbarHelper.openErrorSnackBar();
    });
  }
  /*
  delete Task Details
  */
  delete(uuid: string) {
    this.taskDetailsService.delete(uuid).subscribe(res => {
      this.getProcurementType();
    });
  }

  /*
   Get list Task Details
  */

  getProcurementType() {
    this.taskDetailsList = [];
    this.taskDetailsService.getListWithPagination(this.page, this.size).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.content.map(m => ({ ...m, currentStatus: m.status ? 'Active' : 'Inactive' })));
      this.total = res.totalElements;
      // res.forEach(m => {
      //     this.taskDetailsList.push(m);
      // });
    });
  }
  /*
   set form value Task Details
   */
  setValue(res: any) {
    this.frmGroup = this.formBuilder.group({
      nameBangla: [res.nameBn],
      nameEnglish: [res.nameEn],
      description: [res.description],
      status: [res.status.toString()],
    });
  }


  /*
   reset form value Task Details
  */

  resetValue() {
    this.frmGroup = this.formBuilder.group({
      nameBangla: ['', Validators.required],
      nameEnglish: ['', Validators.required],
      description: ['', ''],
      status: ['true', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /*
  search data by filter
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onChangePage(event: PageEvent) {
    this.size = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getProcurementType();
  }


  /*
   reset form value Task Details
   */
  reset() {
    this.resetValue();
    this.editValue = false;
    this.disableDelete = false;
  }

  /*
    Open Dialog
   */
  private openDialog(uuid: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = ConfirmDialogConstant.WIDTH;
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
    const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        this.delete(uuid);
      }
      dialogRef.close(true);
    });
  }
}
