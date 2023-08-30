import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ERROR, OK } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs/internal/Subscription';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { DEFAULT_SIZE } from './core/constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {divisionList, districtList} from 'app/main/modules/auth/features/contants/location/division-district-list.constant'
import {upazilaList} from 'app/main/modules/auth/features/contants/location/upazila-list.constant';

@Component({
  selector: 'app-researcher-list-public',
  templateUrl: './researcher-list-public.component.html',
  styleUrls: ['./researcher-list-public.component.scss']
})
export class ResearcherListPublicComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  filteredOptions: Observable<any[]>;

  divisionList = divisionList;
  districtList = districtList;
  upzilaList = upazilaList;

  viewDistrictList = [];
  viewUpzilaList = [];

  rmsFrontendApp: string = environment.ibcs.rmsFrontendApp;

  /*----/Button---*/
  subscription: Subscription;
  spinner: boolean = false;
  frmGroup: FormGroup;

  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = ''; //Edit  

  dataSet = new Array<{
    uuid: any;
    stFiscalYearId: any;
    stResearchCatTypeId:any;
    stSectorTypeId: any;
    stSubSectorId: number;
    hashTag: any;

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

  page: number = 0;
  totalElements: number = 20; //DEFAULT_SIZE;
  pageSize: number = 20; //DEFAULT_SIZE;

  displayedColumns: string[] = ['sl', 'researcher_name', 'st_research_cat_type_id', 'st_sector_type_id', 'location','hash_tag'];


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
      hashTag: '',
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
      hashTag: '',
    }
  ];

  sectorTypeList = [];
  subSectorTypeList = [];
  fiscalYearList: any[] = [];
  researchCategoryTypeList: any[] = [];


  sendData: { stFiscalYearId: number, profileId: number } = { stFiscalYearId: null, profileId: null }
  sendDataForGrid: {

    stFiscalYearId: number,
    stResearchCatTypeId:any;
    stSectorTypeId: number,
    stSubSectorsId: number,
    hashTag: string,
    divisionName: string,
    districtName: string,
    upzilaName: string,

    pageableRequestBodyDTO: {
      page: number,
      size: number
    }

  } = {

      stFiscalYearId: null,
      stResearchCatTypeId:null,
      stSectorTypeId: null,
      stSubSectorsId: null,
      hashTag: null,
      divisionName: null,
      districtName: null,
      upzilaName: null,

      pageableRequestBodyDTO: {
        page: this.page,
        size: this.pageSize
      }

    };

  isEmptyRows:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _httpClient: HttpClient,
    private _router: Router,
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
      stResearchCatTypeId:[''],
      stSectorTypeId: [''],
      stSubSectorsId:[''],
      hashTag: [''],
      divisionName: [''],
      districtName: [''],
      upzilaName: ['']
    });

    this.getSectorTypeList();
    this.getFiscalYearList();
    this.getResearchCategoryTypeList();
    //this.getDivisionList();

    // for ============= Auto complite
    this.filteredOptions = this.frmGroup.get('hashTag').valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap(val => {
        return this.filter(val || '')
      })
    );
    this.getPublicToken();
    
  }

  filter(val: string): Observable<any[]> {
    return this.findByKeyWord({ hashTag: val })
      .pipe(map(response => response && response.filter(option => {
        //console.log("option = ",  option);
        return option
      })));
  }

  getHeaderOption() {
    let headers = new HttpHeaders().set('Authorization', 'bearer ' + sessionStorage.getItem('access_token'));
    return {headers: headers};
  }

  getPublicToken(){
    let userData = {
      "userName":"rmspublic-user@gmail.com",
      "password":"123456"
    }

    this.getPublicAccessToken(userData).subscribe(res => {
      console.log("res ==", res);
      if(res?.access_token){
        sessionStorage.setItem('access_token', res.access_token);
        this.onInit();
      }      
    })
  }

  onSubmit() {
    const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
    const stResearchCatTypeId = this.frmGroup.value.stResearchCatTypeId;
    const stSectorTypeId = this.frmGroup.value.stSectorTypeId;
    const stSubSectorsId = this.frmGroup.value.stSubSectorsId;
    const hashTag = this.frmGroup.value.hashTag;
    const divisionName = this.frmGroup.value.divisionName;
    const districtName = this.frmGroup.value.districtName;
    const upzilaName = this.frmGroup.value.upzilaName;


    this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
    this.sendDataForGrid.stResearchCatTypeId = stResearchCatTypeId ? stResearchCatTypeId : null;
    this.sendDataForGrid.stSectorTypeId = stSectorTypeId ? stSectorTypeId : null;
    this.sendDataForGrid.stSubSectorsId = stSubSectorsId ? stSubSectorsId : null;
    this.sendDataForGrid.hashTag = hashTag ? hashTag : null;
    this.sendDataForGrid.divisionName = divisionName ? divisionName.toString() : null;
    this.sendDataForGrid.districtName = districtName ? districtName.toString() : null;
    this.sendDataForGrid.upzilaName = upzilaName ? upzilaName.toString() : null;

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
    const URL = environment.ibcs.rmsConfigurationBackend+'public/get-all-active-fiscal-year';
    this._httpClient.get<any>(URL).pipe(map((data: any) => data)).subscribe(
      response => {
        this.fiscalYearList = response.items ? response.items : [];
        this.spinner = false;
      }, error => {
        this.spinner = false;
      }
    );
  }

  getResearchCategoryTypeList() {
    this.spinner = true;
    const URL = `${environment.ibcs.rmsConfigurationBackend}api/research-category-type/get-active-list`;
    this._httpClient.get<any>(URL).pipe(map((data: any) => data)).subscribe(
      response => {
        this.researchCategoryTypeList = response.items ? response.items : [];
        this.spinner = false;
      }, error => {
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
    const hashTag = this.frmGroup.value.hashTag;
    const divisionName = this.frmGroup.value.divisionName;
    const districtName = this.frmGroup.value.districtName;
    const upzilaName = this.frmGroup.value.upzilaName;


    this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
    this.sendDataForGrid.stSectorTypeId = stSectorTypeId ? stSectorTypeId : null;
    this.sendDataForGrid.hashTag = hashTag ? hashTag : null;
    this.sendDataForGrid.divisionName = divisionName ? divisionName : null;
    this.sendDataForGrid.districtName = districtName ? districtName : null;
    this.sendDataForGrid.upzilaName = upzilaName ? upzilaName : null;

    this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
    this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
  }

  // =============  RESEARCHER_GRID_LIST ===============
  getGridList() {
    this.spinner = true;
    this.getResearcherGridListPublic(this.sendDataForGrid).subscribe(res => {   
      console.log('res?.content?.[0]?.id =', res?.content?.[0]?.id);
      this.isEmptyRows = res?.content?.[0]?.id ? false : true;
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
    this.spinner = true;
    const URL = `${environment.ibcs.rmsConfigurationBackend}public/get-sectors`;
    this._httpClient.get<any>(URL).pipe(map((data: any) => data)).subscribe(
      response => {
        this.sectorTypeList = response.items ? response.items : [];
        this.spinner = false;
      }, error => {
        this.spinner = false;
      }
    );
  }

  getSubSectorTypeList(sectorId) {
    this.spinner = true;
    const URL = `${environment.ibcs.rmsConfigurationBackend}public/get-sub-sectors/${sectorId}`;
    this._httpClient.get<any>(URL).pipe(map((data: any) => data)).subscribe(
      response => {
        this.subSectorTypeList = response.items ? response.items : [];
        this.spinner = false;
      }, error => {
        this.spinner = false;
      }
    );
  }

  onInit() {
    this.getGridList();
  }

  // ============== For Location =======================

  getDivisionList() {
    //let divisionList = this.divisionList

    // this.getDivisionListApi().subscribe(data => {
    //   if (data.items.length > 0) {
    //     this.divisionList = data.items;
    //   }
    // });
  }

  detailsFinalReport(profileId, ProposalId, Pro_uuid){
    console.log('ddddddddddddddd');
    window.location.href = this.rmsFrontendApp +'view-final-report-of-research-submission/10/14/727e9363-b4b9-46fc-b76d-ff2d0eb66f68';
    //window.location.href = this.rmsFrontendApp + `view-final-report-of-research-submission/${profileId}/${ProposalId}/${Pro_uuid}`;
    //this._router.navigate(["view-final-report-of-research-submission/10/14/727e9363-b4b9-46fc-b76d-ff2d0eb66f68"]);
  }


  getDistrictByChangeDivision(divisionName) {
    console.log(divisionName);
    this.viewDistrictList = [];
    let districtList = this.districtList;
    let root = this;

    // if (Array.isArray(divisionName)) {
    //   divisionName.forEach((fName) => {

    if(divisionName != null && divisionName != "") {
      districtList.forEach(val =>{
        if(val.en_name == divisionName) {
          console.log(val.list);
          root.viewDistrictList.push(val);
        }
      })
    }
       

    //   })
    // }

    console.log('root.viewDistrictList =',root.viewDistrictList);

    

    // this.getDistrictListByDivisionIdApi(divisionId).subscribe(data => {
    //   if (data.items.length > 0) {
    //     this.districtList = data.items;
    //   }
    // });
  }

  getUpazilaByChangeDistrict(districtName) {
    console.log(districtName);
    this.viewUpzilaList = [];
    let root = this;

    // if (Array.isArray(districtName)) {
    //   districtName.forEach((fName) => {

    if(districtName != null && districtName != ""){
      root.upzilaList.forEach(val =>{
        if(val.en_name == districtName) {
          root.viewUpzilaList.push(val)
        }
      })
    }
        

    //   })
    // }


    
    //viewUpzilaList
    // this.getUpazilaListByDistrictIdApi(districtId).subscribe(data => {
    //   if (data.items.length > 0) {
    //     this.upzilaList = data.items;
    //   }
    // });
  }
 



  // ======================== apiCall ===========================



  opts = [];
  findByKeyWord(data) {
    this.spinner = true;
    let URL = environment.ibcs.rpmBackend + 'api/view-research-public/find-by-key-word';
    return this._httpClient.post<any>(URL, data).pipe(map((data: any) => data.items)).pipe(tap(data => this.opts = data));
  }

  getResearcherGridListPublic(data: any) {
    let URL = environment.ibcs.rpmBackend + 'api/view-research-public/get-public-proposal-info';
    return this._httpClient.post<any>(URL, data, this.getHeaderOption());
  }

  getPublicAccessToken(data: any) {
    let URL = environment.ibcs.baseApiEndPoint + 'api/get-access-token';
    return this._httpClient.post<any>(URL, data,);
  }

  getDivisionListApi(): Observable<any> {
    const URL = `${environment.ibcs.rmsConfigurationBackend}api/division/activeDivision`;
    return this._httpClient.get<any>(URL).pipe(map((data: any) => data))
  }

  getDistrictListByDivisionIdApi(divisionId: number): Observable<any> {
    const URL = `${environment.ibcs.rmsConfigurationBackend}api/zilla/find-by-division-id/${divisionId}`;
    return this._httpClient.get<any>(URL).pipe(map((data: any) => data))
  }

  getUpazilaListByDistrictIdApi(districtId: number): Observable<any> {
    const URL = `${environment.ibcs.rmsConfigurationBackend}api/upazilla/find-by-zilla-id/${districtId}`;
    return this._httpClient.get<any>(URL).pipe(map((data: any) => data))
  }

}

































