import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
//----Lng Translation----
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {ApiService} from 'app/main/core/services/api/api.service';
import {ToastrService} from 'ngx-toastr';
import {GlobalValidationServiceService} from 'app/main/core/services/global-validation-service.service';
import {ProfessionTbl} from '../../models/ProfessionTbl';
import {DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {FiscalYearServiceService} from '../../services/fiscal-year-service.service';
import {CategoryWiseGrantAmountServiceService} from '../../services/category-wise-grant-amount-service.service';
import {FiscalYearWiseBudgetServiceService} from '../../services/fiscal-year-wise-budget-service.service';
import {ResearchCategoryTypeService} from '../../services/research-category-type.service';

@Component({
    selector: 'app-category-wise-grant-amount',
    templateUrl: './category-wise-grant-amount.component.html',
    styleUrls: ['./category-wise-grant-amount.component.scss']
})
export class CategoryWiseGrantAmountComponent implements OnInit {
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit

    dataSet: ProfessionTbl[] = new Array<ProfessionTbl>();
    headerTitle: string = 'Test Comp';
    headerSubTitle: string = 'Home > Test Component';

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'fiscalYear', 'categoryName', 'budgetAllAmountPercent', 'totalBudgetAllocationAmount', 'minGrantAmount', 'maxGrantAmount', 'budgetSource', 'active', 'action'];
    dataSource: any;
    @ViewChild('inputForm') inputForm: NgForm;
    fileList: { field: string, file: FileList }[] = [];
   // uploadfiles: File[]= new Array();
    uploadfiles: {fileName: File,id:number,name:string }[] = [];
    uploadfilesHolder: any = [];
    deleteList:{id: number}[]=[];
    fiscalBudget: any[] = [];
    resarseCatList: any[] = [];
    isEdit:boolean=false;

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private fiscalYearService: FiscalYearServiceService,
        private categoryAmount: CategoryWiseGrantAmountServiceService,
        private fiscalYearWiseBudget: FiscalYearWiseBudgetServiceService,
        private researchCat: ResearchCategoryTypeService,
        private toastr: ToastrService,
        private globalVal: GlobalValidationServiceService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.formTitle = 'Add';
        this.frmGroup = this.formBuilder.group({
            id: [],
            uuid: [''],
            fiscalYearId: ['', this.globalVal.trimValidator('Fiscal Year')],
            researchCategoryTypeId: ['', this.globalVal.trimValidator('Research category  id')],
            budgetSource: [''],
            budgetAllAmountPercent: ['', [
                this.globalVal.trimValidator('Percentage amount'),
                this.globalVal.NameSpecialChar('Percentage amount'),
                this.globalVal.checkString('Percentage amount'),]],
            totalBudgetAllocationAmount: ['', [
                this.globalVal.trimValidator('Budget allocation amount'),
                this.globalVal.NameSpecialChar('Budget allocation amount'),
                this.globalVal.checkString('udget allocation amount'),]],

            minGrantAmount: ['', [
                this.globalVal.trimValidator('Min grant amount'),
                this.globalVal.NameSpecialChar('Min grant amount'),
                this.globalVal.checkString('Min grant amount'),]],

            maxGrantAmount: ['', [
                this.globalVal.trimValidator('Max grant amount'),
                this.globalVal.NameSpecialChar('Max grant amount'),
                this.globalVal.checkString('Max grant amount'),]],
            active: ['true', Validators.required],

        });

        this.fiscalList();
        this.researchCatList();
        // this.in=1;
        // this.uploadfiles.push(null);
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData();
    }


    getListData() {
        this.spinner = true;
        this.categoryAmount.getListData(this.page, this.pageSize).subscribe(res => {

            var sourceDataVal: any = [];
            res.response.content.forEach(e => {

                var val: any = e;

                this.fiscalBudget.forEach(v => {
                    if (v.id == e.fiscalYearId) {
                        val.fiscalYear = v.fiscalYear;
                    }
                })

                this.resarseCatList.forEach(v2 => {
                    if (v2.id == e.researchCategoryTypeId) {
                        val.categoryName = v2.categoryName;
                    }
                })

                sourceDataVal.push(val);
            });

            console.log('sourceDataVal', sourceDataVal);

            this.dataSource = new MatTableDataSource(res.response ? sourceDataVal : []);
            this.totalElements = res.response ? res.response.totalElements : 0;
        });
        this.spinner = false;
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

    delete(rowUuid) {
        this.categoryAmount.delete(rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "Success!", this.config);
                this.getListData();
            } else {
                this.toastr.error(res.message, "Error!", this.config);
            }
        });
    }

    editRow(data) {
        this.isEdit=true;
        this.uploadfiles=[];
        this.uploadfilesHolder=[];
        this.uploadfilesHolder=data.categoryWiseGrantAmountFiles;
        this.formTitle = "Edit";
        this.frmGroup.patchValue(data);
        this.frmGroup.patchValue({active: data.active.toString()});
        this.uploadfilesHolder.forEach(res => {
            this.uploadfiles.push({fileName:null,id:res?.id,name:res?.fileName})


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

    /*------------------------Insert form functions----------------------*/
    onSubmit() {
        if (this.frmGroup.valid) {
            this.submitFormV2();
        }
    }


    submitForm() {
        this.spinner = true;
        if (this.formTitle == 'Edit') {
            this.categoryAmount.updateData(this.frmGroup.value).subscribe(
                res => {
                    if (res) {
                        this.spinner = false;
                        this.toastr.success("Updating Success", "Success!", this.config);
                        this.formReset();
                        this.getListData();
                    } else {
                        this.spinner = false;
                        //this.frmGroup.controls["profession_name"].setErrors({ "customError": true });
                        this.toastr.error("Updating Failed", "Error!", this.config);
                    }
                },
                err => {
                    console.log('err==== > ', err);
                    this.toastr.error('Http Error Occord !.', "Error!", this.config);
                }
            )
        } else {
            this.categoryAmount.saveData(this.frmGroup.value).subscribe(
                res => {
                    if (res) {
                        this.spinner = false;
                        this.toastr.success("Saving Success", "Success!", this.config);
                        this.formReset();
                        this.getListData();
                    } else {
                        this.spinner = false;
                        this.toastr.error("Saving Failed", "Error!", this.config);
                    }
                },
                err => {
                    console.log('err==== > ', err);
                    this.toastr.error('Http Error Occord !.', "Error!", this.config);
                }
            )
        }
    }


    //submit from with files

    submitFormV2() {
        this.isEdit=false;
        this.spinner = true;
        if (this.formTitle == 'Edit') {
            this.categoryAmount.updateDatawithfiles(this.uploadfiles,this.deleteList,this.frmGroup.value).subscribe(
                res => {
                    if (res) {
                        this.spinner = false;
                        this.toastr.success("Updating Success", "Success!", this.config);
                        this.formReset();
                        this.getListData();
                    } else {
                        this.spinner = false;
                        //this.frmGroup.controls["profession_name"].setErrors({ "customError": true });
                        this.toastr.error("Updating Failed", "Error!", this.config);
                    }
                },
                err => {
                    console.log('err==== > ', err);
                    this.toastr.error('Http Error Occord !.', "Error!", this.config);
                }
            )
        } else {
            this.categoryAmount.saveDatawithfiles(this.uploadfiles,this.frmGroup.value).subscribe(
                res => {
                    if (res) {
                        this.spinner = false;
                        this.toastr.success("Saving Success", "Success!", this.config);
                        this.formReset();
                        this.getListData();
                    } else {
                        this.spinner = false;
                        this.toastr.error("Saving Failed", "Error!", this.config);
                    }
                },
                err => {
                    console.log('err==== > ', err);
                    this.toastr.error('Http Error Occord !.', "Error!", this.config);
                }
            )
        }
        this.deleteList=[];
    }

    /////////////////////////



    formReset() {
        this.formTitle = 'Add';

        this.frmGroup.reset();
        this.inputForm.resetForm();
        this.frmGroup.patchValue({active: 'true'});
        this.uploadfiles=[];
    }

    /*------------------------/Insert form functions----------------------*/

    uploadFile(files: FileList, field: string) {
        console.log(field);
        console.log(files);
        if (this.fileList.find(f => f.field === field)) {
            this.fileList.splice(this.fileList.findIndex(f => f.field === field), 1);
            this.fileList.push({field: field, file: files});
        } else {
            this.fileList.push({field: field, file: files});
        }

    }

    // deleting attachment
    deleteAttachment(index:number,id) {
        if(this.isEdit && id!=null){
            this.deleteList.push({id:id})
        }
            this.uploadfiles.splice(index, 1);

            console.log(this.deleteList)

    }



    handleFileInput(files: FileList,index:number,id) {
        if(this.isEdit && id!=null){
            this.deleteList.push({id:id})
        }
        this.uploadfiles[index]={fileName:files.item(0),id:null,name:files.item(0).name};
        console.log(this.uploadfiles);

    }



    fileUpload() {
     this.uploadfiles.push({fileName:null,id:null,name:null});
    }


    fiscalList() {
        this.fiscalYearService.getAll().subscribe(
            res => {
                this.fiscalBudget = res.items ? res.items : [];
            }
        );
    }


    researchCatList() {
        this.researchCat.getList().subscribe(
            res => {
                this.resarseCatList = res.items ? res.items : [];
                this.getListData();
            }
        );
    }

    maxNumber(searchValue: string): void {
        if (Number(searchValue) > 100) {
            this.toastr.warning('Cross Your Limit 100%!.', "Error!", this.config);
            this.frmGroup.patchValue({budgetAllAmountPercent: ''});
        }
    }

}
