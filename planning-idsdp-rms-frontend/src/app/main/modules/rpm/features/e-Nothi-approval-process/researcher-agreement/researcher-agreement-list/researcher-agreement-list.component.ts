import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ResearcherListService } from 'app/main/modules/rpm/services/researcher-list.service';
import { ResearcherProposalService } from 'app/main/modules/rpm/services/researcher-proposal.service';
import { FiscalYearServiceService } from 'app/main/modules/settings/services/fiscal-year-service.service';
import { ResearchCategoryTypeService } from 'app/main/modules/settings/services/research-category-type.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import {
    addNewIcon,
    deleteIcon,
    downloadIcon,
    editIcon,
    viewIcon,
} from '../../../../constants/button.constants';
import { locale as lngBangla } from '../i18n/bn';
import { locale as lngEnglish } from '../i18n/en';

@Component({
  selector: 'app-researcher-agreement-list',
  templateUrl: './researcher-agreement-list.component.html',
  styleUrls: ['./researcher-agreement-list.component.scss']
})
export class ResearcherAgreementListComponent implements OnInit {
 /*----Button---*/
 editIcon = editIcon;
 deleteIcon = deleteIcon;
 addNewIcon = addNewIcon;
 viewIcon = viewIcon;
 downloadIcon = downloadIcon;
 /*----/Button---*/
 subscription: Subscription;
 spinner: boolean = false;
 frmGroup: FormGroup;
 config: {
     timeOut: 5000;
     closeButton: true;
     positionClass: 'toast-top-right';
     enableHtml: true;
 };
 formTitle = '';

 dataSet = new Array<{
     uuid: any;
     stFiscalYearId: any;
     active: boolean;
 }>();

 page: number = 0;
 totalElements: number = DEFAULT_SIZE;
 pageSize: number = DEFAULT_SIZE;

 displayedColumns: string[] = [
     'sl',
     'fiscalYear',
     //'categoryName',
     'subject',
     //'fileDownloadUrl',
     'isSent',
     'action',
 ];
 dataSource: any;

 baseUrl = environment.ibcs.rpmBackend + 'api/eNothi-approval/';
 downloadUrl = environment.ibcs.minioEndPointHost;

 fiscalYearList = [];
 researchCategoryTypeList: any[] = [];
 langVal: string;

 sendDataForGrid = {
     stFiscalYearId: null,
     stResearchCategoryTypeId: null,
     dataFor:'researcher-agreement',
     orderBy: null,
     pageableRequestBodyDTO: {
         page: this.page,
         size: this.pageSize,
     },
 };

 constructor(
     private _fuseTranslationLoaderService: FuseTranslationLoaderService,
     private api: ApiService,
     private toastr: ToastrService,
     private dialog: MatDialog,
     private dataCom: DataComService,
     private router: Router,
     private fiscalYearService: FiscalYearServiceService,
     private researchCategoryTypeService: ResearchCategoryTypeService,
     private formBuilder: FormBuilder,
     private researcherProposalService : ResearcherProposalService
 ) {
     // Language translations
     this._fuseTranslationLoaderService.loadTranslations(
         lngEnglish,
         lngBangla
     );
     this.totalElements = this.dataSet.length;
     this.dataSource = new MatTableDataSource(this.dataSet);

     this.langVal = localStorage.getItem('currentLang');
     this.dataCom.getPassedItemData.subscribe((res) => {
         if (res?.lang) {
             this.langVal = res?.lang ? res?.lang : '';
         }
     });

     this.getFiscalYearList();
 }

 async ngOnInit() {
     this.frmGroup = this.formBuilder.group({
         stFiscalYearId: [''],
         stResearchCategoryTypeId: [''],
         orderBy: [''],
     });
     localStorage.removeItem('fiscalYear');
     this.spinner = true;
 }

 //Pagination Page Change onChangeClick
 onChangePage(event: PageEvent) {
     this.pageSize = +event.pageSize; // get the pageSize
     this.page = +event.pageIndex; // get the current page
 }

 /*---- For open popup dialog box----*/
 private openDialog(rowUuid) {
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
     this.api.delete(this.baseUrl + 'delete/', rowUuid).subscribe((res) => {
         if (res.success) {
             this.toastr.success(res.message, '', this.config);
             this.getListData();
         } else {
             this.toastr.error(res.message, '', this.config);
         }
     });
 }

 editRow(row) {
     this.dataCom.setPassedItemData(row);
     this.router.navigate(['e-Nothi/researcher-agreement-add']);
 }

 add() {
     this.dataCom.setPassedItemData(false);
     this.router.navigate(['e-Nothi/researcher-agreement-add']);
 }

 details(row) {
     sessionStorage.setItem('information', JSON.stringify(row));
     this.router.navigate(['e-Nothi/researcher-agreement-details']);
 }

 getFiscalYearList() {
     this.fiscalYearService.getAllActive().subscribe(
         (res) => {
             this.fiscalYearList = res.items ? res.items : [];
             this.getResearchCategoryTypeList();
         },
         (error) => {
             this.spinner = false;
         }
     );
 }

 getResearchCategoryTypeList() {
     this.researchCategoryTypeService
         .getAllActiveList()
         .subscribe((response) => {
             this.researchCategoryTypeList = response.items
                 ? response.items
                 : [];
             this.getListData();
         });
 }

 onSubmit() {
     const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
     const stResearchCategoryTypeId =
         this.frmGroup.value.stResearchCategoryTypeId;

     this.sendDataForGrid.stFiscalYearId = stFiscalYearId
         ? stFiscalYearId
         : null;
     this.sendDataForGrid.stResearchCategoryTypeId = stResearchCategoryTypeId
         ? stResearchCategoryTypeId
         : null;

     this.sendDataForGrid.dataFor = 'researcher-agreement';
     this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
     this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
     this.getListData();
 }

 async getListData() {
     this.api.post(this.baseUrl + 'get-data-list', this.sendDataForGrid).subscribe(async (res) => {
             console.log('res =>', res);
             if(res.success){
               var storeVal = res.page.content;
               
                storeVal.forEach(async (element, index) => {
                    var val = this.findALl(element);
                    storeVal[index].fiscalYear = val.fiscslYear;
                    var val2 = this.findCategoryName(element);
                    storeVal[index].categoryName = val2.categoryName;
                    storeVal[index].researchTitle = await this.getProposalTitle(element.m1ResearcherProposalUuid);
                });
   
               this.spinner = false;
               this.dataSource = new MatTableDataSource(await storeVal);
               this.totalElements = res.page.totalElements;
             }
             else
             {
               this.dataSource = new MatTableDataSource([]);
               this.totalElements = 0;
             }

             console.log('dataSource ==== >>>', this.dataSource)
           
         });
 }

async getProposalTitle(proposalUuid) {
    if(proposalUuid != null && proposalUuid != ""){
            const response = await this.api.get(this.baseUrl + 'get-research-proposal-by-uuid/'+proposalUuid).toPromise();
            return response.obj.researchTitle;
        }
    }
    

 findALl(row) {
     let fiscalYear = this.fiscalYearList.filter(
         (res) => row.stFiscalYearId == res.id
     )[0];
     if (fiscalYear) {
         return {
             fiscslYearId: fiscalYear.id,
             fiscslYear: fiscalYear.fiscalYear,
         };
     } else {
         return { fiscslYearId: '', fiscslYear: '' };
     }
 }

 findCategoryName(row) {
   let rCategory = this.researchCategoryTypeList.filter((res) => row.stResearchCategoryTypeId == res.id)[0];
   if (rCategory) {
       return {
         categoryName: rCategory.categoryName,
       };
   } else {
       return { categoryName: ''};
   }
}

downloadFile(url){
    window.open(url, '_blank');
}



}
