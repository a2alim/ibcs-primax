import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, deleteIcon, editIcon, viewIcon } from '../../../constants/button.constants';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { CreateLetterGedServiceService } from '../../../services/create-letter-ged-service.service';

@Component({
  selector: 'app-list-table-components',
  templateUrl: './list-table-components.component.html',
  styleUrls: ['./list-table-components.component.scss']
})
export class ListTableComponentsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'stFiscalYearId', 'sendTo', 'subject', 'fileName', 'action'];
  dataSource: any;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;
  fiscalYearListFull: any[] = [];
  /*----Button---*/

  editIcon = editIcon; deleteIcon = deleteIcon;
  addNewIcon = addNewIcon; viewIcon = viewIcon;


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
    private gedService:CreateLetterGedServiceService,) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.getFiscalyearListFull()
    this.getListData();
    // console.log(JSON.stringify(this.dataSource))
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
    this.createLetterService.data=null;
    this.router.navigate(['/create-letter-ged']);
  }

  editRow(row) {
    this.createLetterService.data=row;
    this.router.navigate(['/create-letter-ged']);
  }


  viewDetails(row) {
    this.createLetterService.data=row;
    this.createLetterService.fiscalYearList=this.fiscalYearListFull;
    this.router.navigate(['/view-letter-ged']);



  }


  private openDialog(rowUuid) {
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

        this.delete(rowUuid);

      }
      dialogRef.close(true);
    });
  }


  getListData() {
    this.createLetterService.getListOfLetter(this.page, this.pageSize).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.page ? res.page.content : []);
      this.totalElements = res.page ? res.page.totalElements : 0;
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
    this.createLetterService.delete(rowUuid).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message, "", this.config);
        this.getListData();
      }
      else {
        this.toastr.warning(res.message, "", this.config);
      }
    });
  }


  getFiscalyearListFull() {
    this.gedService.getAll().subscribe(
      res => {
        this.fiscalYearListFull = res.items ? res.items : [];
      }
    );
  }

  

}
