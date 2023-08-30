import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {environment} from "../../../../../../../environments/environment";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ApiService} from "../../../../../core/services/api/api.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {addNewIcon, deleteIcon, editIcon, viewIcon, deleteSuccess, deleteFailed} from '../../../constants/button.constants';
import {LatterService} from '../../../services/latter.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import {ResearchCategoryTypeService} from "../../../../settings/services/research-category-type.service";

@Component({
    selector: 'app-latter-list',
    templateUrl: './latter-list.component.html',
    styleUrls: ['./latter-list.component.scss']
})
export class LatterListComponent implements OnInit {

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;

    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit

    dataSet = new Array<{
        id: any;
        researcherTitle: any;
        subject: any;
        letterType:any;
        mailStatus: any;
        researcherCategory: any;
    }>();

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['sl', 'researcherTitle', 'subject', 'letterType', 'mailStatus', 'action'];
    dataSource: any;

    baseUrl = environment.ibcs.rpmBackend + 'api/fyw-sector-sub-sector-selection/';

    fiscalYearList = [];
    sectorTypeList = [];
    subSectorTypeListStore = [];
    user: any = {};
    researchCategoryTypeList: any[] = [];
    paramSearch: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private _latterService: LatterService,
        private _router: Router,
        private storage: StorageService,
        private _researchCategoryTypeService: ResearchCategoryTypeService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = true;
        this.initParamSearch();
        this.user = this.storage.getUserData();
        this.getLatterList();
        this.getResearchCategoryTypeList()
    }

    initParamSearch() {
        this.paramSearch = this.formBuilder.group({
            stResearchCatTypeId: ['', Validators.required]
        })
    }

    clearParamSearch() {
        this.paramSearch.reset();
        this.getLatterList();
    }

    getResearchCategoryTypeList() {
        this.spinner = true;
        this._researchCategoryTypeService.getAllActiveList().subscribe(
            response => {
                this.researchCategoryTypeList = response.items ? response.items : [];
                this.spinner = false;
            }
        );
    }

//Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
    }

    /*---- For open popup dialog box----*/

    private openDialog(id: string) {
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
                this._latterService.deleteLetter(id).subscribe(res => {
                    if (res.success) {
                        this.toastr.success(this.deleteSuccess);
                        this.getLatterList();
                    } else {
                        this.toastr.error(this.deleteFailed);
                    }
                }, err => {
                    this.toastr.error("Something went wrong!");
                })
            }
            dialogRef.close(true);
        });
    }

    editRow(id: string) {
        this._router.navigate(['/letter/add/' + id])
    }

    viewDetails(id: string) {
        this._router.navigate(['/letter/view/' + id])
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    addNew() {
        this._router.navigate(['/letter/add/'])
    }

    getLatterList() {
        this.dataSet = [];
        let catId = this.paramSearch.value.stResearchCatTypeId ? this.paramSearch.value.stResearchCatTypeId : this.paramSearch.value.stResearchCatTypeId = 0;
        this._latterService.getLetterList2(catId).subscribe(value => {
            value.items?.forEach(item => {
                item.researcherCategory = this.getCategory(item);
                this.dataSet.push({
                    id: item.id,
                    researcherTitle: item.researcherProposalId.researchTitle,
                    subject: item.subject,
                    letterType:item.letterType,
                    mailStatus: item.status,
                    researcherCategory: item.researcherCategory,
                })

            })
            this.totalElements = this.dataSet?.length;
            this.dataSource = new MatTableDataSource(this.dataSet);
            console.log(this.dataSet);
        }, error => {

        })
    }

    getCategory(data): any {
        return this.researchCategoryTypeList.find(f => f.id == data.researcherProposalId.stResearchCatTypeId).categoryName;
        console.log("hello")
    }


}
