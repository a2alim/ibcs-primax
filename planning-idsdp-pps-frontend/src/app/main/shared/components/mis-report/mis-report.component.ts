import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UnsubscribeAdapterComponent} from "../../../core/helper/unsubscribeAdapter";
import {FuseTranslationLoaderService} from "../../../core/services/translation-loader.service";
import {DivisionService} from "../../../modules/configuration-management/services/division.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectSummaryService} from "../../../modules/project-concept-management/services/project-summary.service";
import {LocationHelperService} from "../../services/location-helper.service";
import {locale as lngEnglish} from "../project-location-common/i18n/en";
import {locale as lngBangla} from "../project-location-common/i18n/bn";
import {Subscription} from "rxjs";
import {SectorDivisionService} from "../../../modules/configuration-management/services/sector-division.service";
import {SectorService} from "../../../modules/configuration-management/services/sector.service";
import {SubSectorService} from "../../../modules/configuration-management/services/sub-sector.service";
import {SectorModel} from "../../../modules/configuration-management/models/sector.model";
import {SectorDivisionModel} from "../../../modules/configuration-management/models/sector-division.model";
import {SubSectorModel} from "../../../modules/configuration-management/models/sub-sector.model";
import {MinistryDivisionService} from "../../../modules/configuration-management/services/ministry-division.service";
import {IMinistryDivision} from "../../../modules/configuration-management/models/ministry-divisiont";
import {IAgency} from "../../../modules/configuration-management/models/agency";
import {AgencyService} from "../../../modules/configuration-management/services/agency.service";
import {ProjectTypeService} from "../../../modules/configuration-management/services/project-type.service";
import {ProjectType} from "../../../modules/configuration-management/models/project-type.model";
import {MisReportService} from "../../services/mis-report.service";
import {MatTableDataSource} from "@angular/material/table";
import {IProjectConcept} from "../../../modules/project-concept-management/models/project-concept";
import {NumberPipe} from "../../pipes/number-pipe.pipe";
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from "../../../core/constants/constant";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MisReportModel} from "../../model/mis-report.model";
import {DivisionModel} from "../../../modules/configuration-management/models/division.model";
import {ZillaModel} from "../../../modules/configuration-management/models/zilla.model";
import {UpazillaModel} from "../../../modules/configuration-management/models/upazilla.model";
import {ZillaService} from "../../../modules/configuration-management/services/zilla.service";
import {UpazillaService} from "../../../modules/configuration-management/services/upazilla.service";
import {MisReportApplyModel} from "../../model/mis-report-apply.model";

@Component({
  selector: 'app-mis-report',
  templateUrl: './mis-report.component.html',
  styleUrls: ['./mis-report.component.scss']
})
export class MisReportComponent extends UnsubscribeAdapterComponent implements OnInit {
    navigationPage: any;
    form: FormGroup;
    spinner: boolean = false;

    dataList = [];
    data = [];
    // uuid: string;
    selectedDivisions = [];
    selectedZilla = [];
    selectedUpazilla = [];
    selectedMunicipality = [];
    clickEventSubscription: Subscription;
    isLocation: boolean = false;

    sectorDivision: SectorDivisionModel[] = [];
    sectors: SectorModel[] = [];
    subSectors: SubSectorModel[] = [];
    projectTypeModel: ProjectType[] = [];

    ministryDivision : IMinistryDivision[] = [];
    agencyModel : any;
    ministryModel : any;
    commonDatasource: MatTableDataSource<IProjectConcept>;
    misDataSource: MatTableDataSource<MisReportModel>;
    displayedColumnsList: string[] = ['sl', 'projectName', 'total', 'gob', 'ownFund', 'other'];
    displayedColumns: string[] = ['thSl', 'thProjectName', 'thProjectCost'];
    totalElement: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    divisions: DivisionModel[];
    zillas: ZillaModel[];
    upazillas: UpazillaModel[];
    model : MisReportApplyModel = new MisReportApplyModel();
    dataTable: boolean = false;
    applyForm: boolean = true;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private sectorDivisionService : SectorDivisionService,
                private sectorService : SectorService,
                private subSectorService : SubSectorService,
                private ministryService : MinistryDivisionService,
                private agencyService : AgencyService,
                private projectTypeService : ProjectTypeService,
                private misReportService : MisReportService,
                private divisionService: DivisionService,
                public numberPipe : NumberPipe,
                private router: Router,
                private route: ActivatedRoute,
                private projectSummaryService: ProjectSummaryService,
                private locationHelperService: LocationHelperService,
                private zillaService : ZillaService,
                private upazillaService : UpazillaService,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

  ngOnInit(): void {
        this.populateForm();
        this.getMinistryDivision();
        this.getSectorDivision();
        this.getAllDivision();
        this.getActiveProjectType();
  }

  populateForm(){
      this.form = this.formBuilder.group({
          projectTypeId: ['0'],
          divisionLocationId: ['0'],
          zillaLocationId: ['0'],
          upazilaLocationId: ['0'],
          sectorDivisionId: ['0'],
          sectorId: ['0'],
          agency: [''],
          ministry: [''],
          subSectorIid: ['0'],
          agencyName: [''],
          ministryName: [''],
          isFundingTypeGob: [false],
          isFinancingTypeGob: [false],
          isFinancingTypePa: [false],
          isFundingTypeOwn: [false],
          isFundingTypeOther: [false],
          financingType: [''],
          fiscalYearFrom: [''],
          fiscalYearTo: [''],
          gobAmountFrom: [null],
          gobAmountTo: [null],
          paAmountFrom: [null],
          paAmountTo: [null],
          ownAmountFrom: [null],
          ownAmountTo: [null],
          totalAmountFrom: [null],
          totalAmountTo: [null],
      });
  }

    getAllDivision(){
        this.divisionService.getList().subscribe(res =>{
            this.divisions = res;
        })
    }

  getSectorDivision(){
        this.sectorDivisionService.getActiveSectorDivision().subscribe(res =>{
            this.sectorDivision = res;
        })
  }


    clearSearchForm() {
        this.dataTable = false;
        this.applyForm = true;
        this.clearForm();

    }

    searchByCriteria() {
    }

    selectLocation(checked: boolean) {
        if(checked){
            this.isLocation = true;
        }else{
            this.isLocation = false;
        }

    }
    onchangeZillas(id: number) {
        this.form.patchValue({
            zillaLocationId: "",
            upazilaLocationId: ""
        })
        this.zillas = [];
        this.upazillas = [];
        if(id){
            this.subscribe$.add(
                this.zillaService.getZillaByDivisionId(id).subscribe(res => {
                    this.zillas = res;
                })
            );
        }
    }

    onchangeUpazillas(id: number) {
        this.form.patchValue({
            upazilaLocationId: "",
        })
        this.upazillas = [];
        if(id){
            this.subscribe$.add(
                this.upazillaService.getUpazillaByZillaId(id).subscribe(res => {
                    this.upazillas = res;
                })
            );
        }
    }

    onchangeSectorDivision(id: number) {
        this.form.patchValue({
            sector: "",
            subSector: ""
        })
        this.sectors = [];
        this.subSectors = [];
        this.subscribe$.add(
            this.sectorService.getBySectorDivisionId(id).subscribe(res => {
                this.sectors = res;
            })
        );
    }

    onchangeSector(id: number) {
        this.subscribe$.add(
            this.subSectorService.getBySectorId(id).subscribe(res => {
                this.subSectors = res;
            })
        );
    }

    onchangeSubSector() {

    }

    getMinistryDivision(){
        this.ministryService.getList().subscribe(res =>{
            this.ministryDivision = res;
        })
    }

    onchangeAgency(id: number) {
        this.form.patchValue({
        })
        this.subscribe$.add(
            this.agencyService.getAllAgencyByMinistryDivisionId(id).subscribe(res =>{
               this.agencyModel = res;
               this.getMinistryName(id);
            })
        );
    }

    getMinistryName(id){
        this.ministryService.getById(id).subscribe(res =>{
            this.form.patchValue({
                ministryName : res.nameEn
            })
        })
    }
    getAgencyName(id){
        this.agencyService.getById(id).subscribe(res =>{
            this.form.patchValue({
                agencyName : res.nameEn
            })
        })
    }


    getActiveProjectType(){
        this.projectTypeService.getActiveProjectType().subscribe(res =>{
            this.projectTypeModel = res;
        })
    }
    getMisReport(){
        this.model.projectTypeId = this.form.value.projectTypeId;
        this.model.divisionLocationId = this.form.value.divisionLocationId;
        this.model.zillaLocationId = this.form.value.zillaLocationId;
        this.model.upazilaLocationId = this.form.value.upazilaLocationId;
        this.model.sectorDivisionId = this.form.value.sectorDivisionId;
        this.model.sectorId = this.form.value.sectorId;
        this.model.subSectorIid = this.form.value.subSectorIid;
        this.model.ministryName = this.form.value.ministryName;
        this.model.agencyName = this.form.value.agencyName;
        this.model.gobAmountFrom = this.form.value.gobAmountFrom;
        this.model.gobAmountTo = this.form.value.gobAmountTo;
        this.model.paAmountFrom = this.form.value.paAmountFrom;
        this.model.paAmountTo = this.form.value.paAmountTo;
        this.model.ownAmountFrom = this.form.value.ownAmountFrom;
        this.model.ownAmountTo = this.form.value.ownAmountTo;
        this.model.totalAmountFrom = this.form.value.totalAmountFrom;
        this.model.totalAmountTo = this.form.value.totalAmountTo;
        this.model.isFinancingTypeGob = this.form.value.isFinancingTypeGob;
        this.model.isFinancingTypePa = this.form.value.isFinancingTypePa;
        this.model.isFundingTypeGob = this.form.value.isFundingTypeGob;
        this.model.isFundingTypeOwn = this.form.value.isFundingTypeOwn;
        this.model.isFundingTypeOther = this.form.value.isFundingTypeOther;
        this.model.fiscalYearFrom = this.form.value.fiscalYearFrom;
        this.model.fiscalYearTo = this.form.value.fiscalYearTo;
        this.form.value.page = this.page;
        this.form.value.size = this.size;
        this.spinner = true;
        this.misReportService.misReportList(this.form.value).subscribe(res =>{
            this.misDataSource = res.content;
            this.totalElement = res.totalElements;
            this.size = res.size;
            this.dataTable = true;
            this.applyForm = false;
            this.spinner = false;
        },error => this.spinner = false)
    }

    backToList() {
        window.history.back();
    }
    onchangeAgencyName(id: number) {
        this.getAgencyName(id);
    }

    gotToViewDashboard(row) {
        this.router.navigate([`dpp-tapp/view-dashboard/${row}`]);
    }
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex;
        this.getMisReport();
    }

    clearForm(){
        this.form.patchValue({
            projectTypeId: '0',
            divisionLocationId: '0',
            zillaLocationId: '0',
            upazilaLocationId: '0',
            sectorDivisionId: '0',
            sectorId: '0',
            agency: '',
            ministry: '',
            subSectorIid: '0',
            agencyName: '',
            ministryName: '',
            isFundingTypeGob: false,
            isFinancingTypeGob: false,
            isFinancingTypePa: false,
            isFundingTypeOwn: false,
            isFundingTypeOther: false,
            financingType: '',
            fiscalYearFrom: '',
            fiscalYearTo: '',
            gobAmountFrom: null,
            gobAmountTo: null,
            paAmountFrom: null,
            paAmountTo: null,
            ownAmountFrom: null,
            ownAmountTo: null,
            totalAmountFrom: null,
            totalAmountTo: null,
        })
        this.page = DEFAULT_PAGE;
        this.size = DEFAULT_SIZE;
    }
}
