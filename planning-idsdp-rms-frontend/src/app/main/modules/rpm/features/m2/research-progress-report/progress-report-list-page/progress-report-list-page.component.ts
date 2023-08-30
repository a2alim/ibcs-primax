import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { environment } from 'environments/environment';
import { addNewIcon, deleteIcon, editIcon, viewIcon } from '../../../../constants/button.constants';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface CommonTbl {
  uuid: any;
  stFiscalYearId:any;
  stSectorTypeId: any;
  stSubSectorId: number;
  active:boolean;
}

@Component({
  selector: 'app-progress-report-list-page',
  templateUrl: './progress-report-list-page.component.html'
})
export class ProgressReportListPageComponent implements OnInit {

    /*----Button---*/
editIcon = editIcon; deleteIcon = deleteIcon;
addNewIcon = addNewIcon; viewIcon = viewIcon;
/*----/Button---*/
subscription: Subscription;
spinner:boolean = false;
frmGroup: FormGroup;
config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
formTitle = ''; //Edit

dataSet = new Array<{
  uuid: any;
  stFiscalYearId:any;
  stSectorTypeId: any;
  stSubSectorId: number;
  active:boolean;
}>();

//dataSet: CommonTbl[] = new Array<CommonTbl>();

page:number = 0;
totalElements: number = DEFAULT_SIZE;
pageSize: number = DEFAULT_SIZE;

//TODO: This is number of column for Mat Table
displayedColumns: string[] = ['sl', 
'm1ResearcherProposalInfoIdCol', 'stFiscalYearIdCol', 'stResearchCategoryTypeIdCol', 'presentationStatusCol', 'researchCompletedPercentageCol', 'action'];
dataSource: any;

baseUrl  = environment.ibcs.rpmBackend+'api/fyw-sector-sub-sector-selection/';

fiscalYearList = [];
sectorTypeList = [];
subSectorTypeListStore = [];

constructor(
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private api: ApiService,
    private toastr: ToastrService,    
    private matSnackBar : SnackbarHelper,
    private dialog: MatDialog,
    private dataCom: DataComService,
    private router: Router
    ) {
    
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    this.totalElements = this.dataSet.length;
    this.dataSource = new MatTableDataSource(this.dataSet);
}

ngOnInit(): void {
  this.spinner = true;
  this.getDropdownData();
}

//Pagination Page Change onChangeClick
onChangePage(event: PageEvent) {
  this.pageSize = +event.pageSize; // get the pageSize
  this.page = +event.pageIndex; // get the current page
}

getListData() {
    const getUrl = this.baseUrl+'get-list/'+this.page+'/'+this.pageSize;
    this.api.get(getUrl).subscribe(res => { 

        var storeVal = res.page.content;
        storeVal.forEach((element, index) => {

        var val = this.findALl(element);
        storeVal[index].fiscalYear = val.fiscslYear;
        storeVal[index].sectorTypeName = val.sectorTypeName;
        storeVal[index].subSector = val.subSector;

      });

        this.spinner = false;
        this.dataSource = new MatTableDataSource(res.page ? storeVal : []);
        this.totalElements = res.page ? res.page.totalElements : 0;    
    });
}

findALl(row)
{

  let fiscalYear = this.fiscalYearList.filter(res => row.stFiscalYearId == res.id)[0];
  
  let sectorTypeName = this.sectorTypeList.filter(res => row.stSectorTypeId == res.id)[0].fieldName;

  var ar = JSON.parse(row.stSubSectorId);
  const subSector = this.subSectorTypeListStore.filter((elem) => ar.find((v) => elem.id == v));

  return {"fiscslYearId":fiscalYear.id, "fiscslYear":fiscalYear.fiscalYear, "sectorTypeName":sectorTypeName, "subSector":subSector};

}

getDropdownData(){
  this.api.get(this.baseUrl+'get-active-fiscal-years').subscribe(res => { 
    if(res){
      this.fiscalYearList = res.fiscalYear;
      this.sectorTypeList = res.sectorTypes;
      this.subSectorTypeListStore = res.subSectors;

      this.getListData();
    }
 });
}

/*---- For open popup dialog box----*/
private openDialog(rowUuid) {
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

// search data by filter
applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
}

delete(rowUuid) {
  this.api.delete(this.baseUrl + 'delete/',rowUuid).subscribe(res => {
        if(res.success){
          this.toastr.success(res.message, "", this.config);
          this.getListData(); 
        }
        else{
          this.toastr.error(res.message, "", this.config);
        }         
    });
}

  editRow(row) {
    this.dataCom.setPassedItemData(row);
    this.router.navigate(['/add-sector-sub-sector']);
  }

  add(){
    this.dataCom.setPassedItemData(false);
    this.router.navigate(['/add-sector-sub-sector']);
  }
  
  viewDetails(row){

    this.spinner = true;
    let storeData = [];
    const getUrl = this.baseUrl+'get-fyw-sector-sub-sector/'+row.stFiscalYearId;
    this.api.get(getUrl).subscribe(res => { 
      if(res.success){
        res.items.forEach(element => {
          var data = this.findALl(element);
          storeData.push(data);
        });
        this.dataCom.setPassedItemData(storeData);    
        this.router.navigate(['/sector-sub-sector-details']);
      }        
    });
    
  }
}
