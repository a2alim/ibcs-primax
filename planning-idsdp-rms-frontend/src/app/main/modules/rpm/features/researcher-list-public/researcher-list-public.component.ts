import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { ERROR, OK } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ExpertEvaluatorService } from 'app/main/modules/settings/services/expert-evaluator.service';
import { FiscalYearServiceService } from 'app/main/modules/settings/services/fiscal-year-service.service';
import { ResearchCategoryTypeService } from 'app/main/modules/settings/services/research-category-type.service';
import { SectorTypeService } from 'app/main/modules/settings/services/sector-type.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { addNewIcon, deleteIcon, downloadIcon, editIcon, pdfIcon, viewIcon } from 'app/main/modules/training-institute/constants/button.constants';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { ResearcherCategoryType } from '../../enums/enum-list.enum';
import { FiscalYearWiseDocFilesModel } from '../../models/FiscalYearWiseDocFilesModel';
import { FiscalYearWiseDocFilesService } from '../../services/fiscal-year-wise-doc-files.service';
import { JasperServiceService } from '../../services/jasper-service.service';
import { ResearchProfileMultiFormService } from '../../services/research-profile-multi-form.service';
import { ResearcherListService } from '../../services/researcher-list.service';
import { ResearcherProposalService } from '../../services/researcher-proposal.service';
import { ProposalEligibilityCheckModalComponent } from '../researcher-proposal/proposal-eligibility-check-modal/proposal-eligibility-check-modal.component';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-researcher-list-public',
  templateUrl: './researcher-list-public.component.html',
  styleUrls: ['./researcher-list-public.component.scss']
})
export class ResearcherListPublicComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  filteredOptions: Observable<any[]>;


  /*----Button---*/
  viewIcon = viewIcon;

  /*----/Button---*/
  subscription: Subscription;
  spinner: boolean = false;
  frmGroup: FormGroup;

  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = ''; //Edit  

  dataSet = new Array<{
    uuid: any;
    stFiscalYearId: any;
    stSectorTypeId: any;
    stSubSectorId: number;
    active: boolean;

    researcher_name: '',
    research_title: '',
    st_fiscal_year_id: '',
    st_research_cat_type_id: '',
    st_sector_type_id: '',
    proposal: '',
    ProfileProposalMarks: '',
    ApprovalStatus: '',
    Action: '',
  }>();


  divisionList = [];
  districtList = [];
  upzilaList = [];

  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;

  displayedColumns: string[] = ['sl', 'researcher_name', 'st_research_cat_type_id', 'st_sector_type_id', 'location', 'action'];


  dataSource: any = [
    {
      researcher_name: '',
      research_title: '',
      st_fiscal_year_id: '',
      st_research_cat_type_id: '',
      st_sector_type_id: '',
      proposal: '',
      ProfileProposalMarks: '',
      ApprovalStatus: '',
      Action: '',
    },
    {
      researcher_name: '',
      research_title: '',
      st_fiscal_year_id: '',
      st_research_cat_type_id: '',
      st_sector_type_id: '',
      proposal: '',
      ProfileProposalMarks: '',
      ApprovalStatus: '',
      Action: '',
    }
  ];

  sectorTypeList = [];
  subSectorTypeListStore = [];
  fiscalYearList: any[] = [];
  researchCategoryTypeList: any[] = [];


  sendData: { stFiscalYearId: number, profileId: number } = { stFiscalYearId: null, profileId: null }
  sendDataForGrid: {

    stFiscalYearId: number,
    stSectorTypeId: number,
    keyWord: string,
    divisionId: number,
    districtId: number,
    upzilaId: number,

    pageableRequestBodyDTO: {
      page: number,
      size: number
    }

  } = {

      stFiscalYearId: null,
      stSectorTypeId: null,
      keyWord: null,
      divisionId: null,
      districtId: null,
      upzilaId: null,

      pageableRequestBodyDTO: {
        page: this.page,
        size: this.pageSize
      }

    };

  constructor(
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _fiscalYearService: FiscalYearServiceService,
    private _researcherListService: ResearcherListService,
    private _researchCategoryTypeService: ResearchCategoryTypeService,
    private _sectorTypeService: SectorTypeService,
    private _researchProfileMultiFormService: ResearchProfileMultiFormService,
    private _researcherProposalService: ResearcherProposalService,
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.totalElements = this.dataSet.length;
    this.dataSource = new MatTableDataSource(this.dataSet);
  }

  ngOnInit(): void {

    this.spinner = false;

    this.frmGroup = this.formBuilder.group({
      stFiscalYearId: [''],
      stSectorTypeId: [''],
      keyWord: [''],
      divisionId: [''],
      districtId: [''],
      upzilaId: ['']
    });

    this.getSectorTypeList();
    this.getFiscalYearList();
    this.getResearchCategoryTypeList();
    this.getDivisionList();

    // for ============= Auto complite
    this.filteredOptions = this.frmGroup.get('keyWord').valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap(val => {
        return this.filter(val || '')
      })
    );

    this.onInit();
  }

  filter(val: string): Observable<any[]> {
    return this._researcherListService.findByKeyWord({ keyWord: val })
      .pipe(map(response => response && response.filter(option => {
        return option
      })));
  }

  onSubmit() {
    const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
    const stSectorTypeId = this.frmGroup.value.stSectorTypeId;
    const keyWord = this.frmGroup.value.keyWord;
    const divisionId = this.frmGroup.value.divisionId;
    const districtId = this.frmGroup.value.districtId;
    const upzilaId = this.frmGroup.value.upzilaId;


    this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
    this.sendDataForGrid.stSectorTypeId = stSectorTypeId ? stSectorTypeId : null;
    this.sendDataForGrid.keyWord = keyWord ? keyWord : null;
    this.sendDataForGrid.divisionId = divisionId ? divisionId : null;
    this.sendDataForGrid.districtId = districtId ? districtId : null;
    this.sendDataForGrid.upzilaId = upzilaId ? upzilaId : null;

    this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
    this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
    this.onInit();
  }

  // search data by filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFiscalYearList() {

    this.spinner = true;
    this._fiscalYearService.getAllActive().subscribe(
      response => {
        this.fiscalYearList = response.items ? response.items : [];
        this.spinner = false;
      },
      error => {
        this.spinner = false;
      }
    );
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

    const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
    const stSectorTypeId = this.frmGroup.value.stSectorTypeId;
    const keyWord = this.frmGroup.value.keyWord;
    const divisionId = this.frmGroup.value.divisionId;
    const districtId = this.frmGroup.value.districtId;
    const upzilaId = this.frmGroup.value.upzilaId;


    this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
    this.sendDataForGrid.stSectorTypeId = stSectorTypeId ? stSectorTypeId : null;
    this.sendDataForGrid.keyWord = keyWord ? keyWord : null;
    this.sendDataForGrid.divisionId = divisionId ? divisionId : null;
    this.sendDataForGrid.districtId = districtId ? districtId : null;
    this.sendDataForGrid.upzilaId = upzilaId ? upzilaId : null;

    this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
    this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
  }

  // =============  RESEARCHER_GRID_LIST ===============
  getGridList() {
    this.spinner = true;
    this._researcherListService.getResearcherGridListPublic(this.sendDataForGrid).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.content ? res.content : []);
      this.totalElements = res.totalElements;
      this.spinner = false;
    },
      error => {
        this.spinner = false;
      }
    );

  }


  getSectorTypeList() {
    this.spinner = false;
    this._sectorTypeService.getAllActiveList().subscribe(
      response => {
        this.sectorTypeList = response.items ? response.items : [];
        this.spinner = false;
      },
      error => {
        this.spinner = false;
      }
    );
  }

  onInit() {
    this.getGridList();
  }

  // ============== For Location =======================
  getDivisionList() {
    this.divisionList = [];
    this._researchProfileMultiFormService.getDivisionList().subscribe(data => {
      if (data.items.length > 0) {
        this.divisionList = data.items;
      }
    });
  }

  getDistrictByChangeDivision(divisionId) {
    this.districtList = [];
    this._researchProfileMultiFormService.getDistrictListByDivisionId(divisionId).subscribe(data => {
      if (data.items.length > 0) {
        this.districtList = data.items;
      }
    });
  }

  getUpazilaByChangeDistrict(districtId) {
    this.upzilaList = [];
    this._researchProfileMultiFormService.getUpazilaListByDistrictId(districtId).subscribe(data => {
      if (data.items.length > 0) {
        this.upzilaList = data.items;
      }
    });
  }

}

































