import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { ERROR, OK } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import {
    districtList,
    divisionList,
} from 'app/main/modules/rpm/contants/location/division-district-list.constant';
import { upazilaList } from 'app/main/modules/rpm/contants/location/upazila-list.constant';
import { sdgsGoalsList } from 'app/main/modules/rpm/contants/sdgs-goals-list.constant';
import { DivisionDistrictUpzilaService } from 'app/main/modules/rpm/services/division-district-upzila.service';
import { ResearcherProposalService } from 'app/main/modules/rpm/services/researcher-proposal.service';
import { ProposalSubmissionService } from 'app/main/modules/training-institute/services/proposal-submission.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, switchMap } from 'rxjs/operators';
import { UnsubscribeAdapterComponent } from '../../../../../../../core/helper/unsubscribeAdapter';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { FiscalYearServiceService } from '../../../../../../settings/services/fiscal-year-service.service';
import { ResearchCategoryTypeService } from '../../../../../../settings/services/research-category-type.service';
import { SectorTypeService } from '../../../../../../settings/services/sector-type.service';
import { SubSectorService } from '../../../../../../settings/services/sub-sector.service';
import { ResearcherProposal } from '../../../../../models/ResearcherProposal';
import { ResearchProfileMultiFormService } from '../../../../../services/research-profile-multi-form.service';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';
@Component({
    selector: 'app-researcher-proposal',
    templateUrl: './researcher-proposal.component.html',
    styleUrls: ['./researcher-proposal.component.scss'],
})
export class ResearcherProposalComponent
    extends UnsubscribeAdapterComponent
    implements OnInit, OnChanges
{    
    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>;
    @Input() researcherProfileUuId: string;
    @Input() categoryTypeId: number;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Output() onChangrResearchCategoryType = new EventEmitter<any>();
    @Output() setFiscalYearId = new EventEmitter<any>();
    proposalInfo: ResearcherProposal = new ResearcherProposal();
    resProfilePersonalInfoId: number;
    spinner: boolean;
    researchCategoryTypeList: any[];
    sectorList: any[];
    subSectorList: any[];
    saveDisable: boolean;
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    sdgsGoalsList = sdgsGoalsList;
    userDetails: { userType: null };
    nationalPlanAlignmentList = [
        'Five Year Plan',
        'Perspective Plan',
        'Delta Plan',
    ];
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    //==================  For Location ====================
    divisionList = divisionList;
    storeDistrictList = districtList;
    storeUpazilaList = upazilaList;
    districtList_s = [];
    upazilaList_s = [];
    ParDivisionList = [];
    ParDistrictList = [];
    ParUpzilaList = [];
    activeFisYear: any[];
    activeFiscalYearFinalList: any[] = [];
    sectorFinalList: any[];
    subSectorFinalList: any[];
    fiscalYearsList: any[];
    activeSectorList: any[] = [];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fiscalYearService: FiscalYearServiceService,
        private researchCategoryTypeService: ResearchCategoryTypeService,
        private sectorTypeService: SectorTypeService,
        private subSectorService: SubSectorService,
        private snackbarHelper: SnackbarHelper,
        private researchProfileMultiFormService: ResearchProfileMultiFormService,
        private researcherProposalService: ResearcherProposalService,
        private storageService: StorageService,
        private _proposalSubmissionService: ProposalSubmissionService,
        private DividionDU: DivisionDistrictUpzilaService,
        private api: ApiService,
        private _toastrService: ToastrService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        // this.getDivisionList();
        // this.getDistrictList();
        // this.getUpazilaList();
    }

    ngOnInit(): void {
        this.proposalInfo.stResearchCatTypeId = Number(this.categoryTypeId);

        this.onChangrResearchCategory({
            value: this.proposalInfo.stResearchCatTypeId,
        });
        this.userDetails = this.storageService.getUserData();
        this.getAll((res) => {
            if (res) {
                this.processData((res2) => {
                    if (res2) {
                        if (this.proposalInfo.stSectorTypeId) {
                            this.onChangeSectorFinal(this.proposalInfo.stSectorTypeId);
                        }
                    }
                });
            }
        });
        if (this.researcherProfileUuId) {
            this.getResearcherProfileByUuId();
        }
        // if (this.proposalInfo.divisionId) {
        //     this.getDistrictByChangeDivision(this.proposalInfo.divisionId);
        // }
        // if (this.proposalInfo.districtId) {
        //     this.getUpazilaByChangeDistrict(this.proposalInfo.districtId);
        // }
    }
    ngOnChanges(changes: SimpleChanges) {
        
        for (const i in changes)
            if (changes.hasOwnProperty(i) && "existingProposalInfo" === i)
                if (this.existingProposalInfo.id) {

                    this.proposalInfo = this.existingProposalInfo;
                    let i = this.proposalInfo.divisionId,
                        o = this.proposalInfo.districtId,
                        s = this.proposalInfo.upzilaId;
                    if (null != i && "" != i) {
                        let t = "string" == typeof i ? JSON.parse(i) : i;
                        this.proposalInfo.divisionId = t, this.getDistrictByChangeDivision(t, 0, (i => {
                            if (i && null != o && "" != o) {
                                let i = "string" == typeof o ? JSON.parse(o) : o;
                                if (this.proposalInfo.districtId = i, this.getUpazilaByChangeDistrict(i), null != s && "" != s) {
                                    let i = "string" == typeof s ? JSON.parse(s) : s;
                                    this.proposalInfo.upzilaId = i
                                }
                            }
                        }))
                    }
                    this.processData((i => {
                        i && this.proposalInfo.stSectorTypeId && this.onChangeSectorFinal(this.proposalInfo.stSectorTypeId)
                    })), this.onChangrResearchCategoryType.emit(this.proposalInfo.researchCategoryType.id)
                }
    }
    private getAll(callBack) {
        this.spinner = true;
        this.subscribe$.add( this.fiscalYearService.getAllActive().pipe(switchMap((fy) =>                    
                        this.researchCategoryTypeService.getAllActiveList().pipe(
                                switchMap((rct) =>this.sectorTypeService.getAllActiveList().pipe(
                                            switchMap((sec) => this.subSectorService.getAllActiveList().pipe(
                                                        switchMap((subSec) =>
                                                            this._proposalSubmissionService.getProposalSubmissionDates().pipe(
                                                                    map((activeFisYear) => ({
                                                                            fy: fy,
                                                                            rct: rct,
                                                                            sec: sec,
                                                                            subSec: subSec,
                                                                            activeFisYear:activeFisYear,
                                                                        })
                                                                    )
                                                                )
                                                        )
                                                    )
                                            )
                                        )
                                )
                            )
                    )
                )
                .subscribe((res) => {
                    
                    this.fiscalYearsList = res.fy.items ? res.fy.items : [];
                    this.researchCategoryTypeList = res.rct.items
                        ? res.rct.items
                        : [];
                    this.sectorList = res.sec.items ? res.sec.items : [];
                    this.activeFisYear = [res.activeFisYear];
                    this.subSectorList = res.subSec.items
                        ? res.subSec.items
                        : [];
                    this.spinner = false;
                    callBack(true);
                })
        );
        callBack(false);
        this.spinner = false;
    }
    onChangeSector(id: any) {
        this.subscribe$.add(
            this.subSectorService.getBySectorId(id).subscribe((res) => {
                this.subSectorList = res.items ? res.items : [];
            })
        );
    }
    onSubmit(next: boolean, f: any) {
        if (!this.proposalInfo) {
            return;
        }
        if (
            !this.proposalInfo.stFiscalYearId ||
            !this.proposalInfo.stResearchCatTypeId ||
            !this.proposalInfo.stSectorTypeId ||
            !this.proposalInfo.stSubSectorsId ||
            !this.proposalInfo.researchTitle
        ) {
            this._toastrService.warning(
                'Please enter the required information !.',
                '',
                this.config
            );
            return;
        }
        this.saveDisable = true;
        this.proposalInfo.stSdgsGoalsId =
            typeof this.proposalInfo.stSdgsGoalsId == 'object'
                ? JSON.stringify(this.proposalInfo.stSdgsGoalsId)
                : this.proposalInfo.stSdgsGoalsId;
        this.proposalInfo.divisionId =
            typeof this.proposalInfo.divisionId == 'object'
                ? JSON.stringify(this.proposalInfo.divisionId)
                : this.proposalInfo.divisionId;
        this.proposalInfo.districtId =
            typeof this.proposalInfo.districtId == 'object'
                ? JSON.stringify(this.proposalInfo.districtId)
                : this.proposalInfo.districtId;
        this.proposalInfo.upzilaId =
            typeof this.proposalInfo.upzilaId == 'object'
                ? JSON.stringify(this.proposalInfo.upzilaId)
                : this.proposalInfo.upzilaId;
        if (this.proposalInfo.id) {
            this.onUpdate(next);
        } else {
            this.onSave(next);
        }
    }
    onSave(next: boolean) {
        this.proposalInfo.resProfilePersonalInfoId =
            this.resProfilePersonalInfoId;
        this.proposalInfo.approvalStatus = 3;
        this.spinner = true;
        this.researcherProposalService.create(this.proposalInfo).subscribe(
            (response) => {
                if (response.success) {
                    this.brodCastChange.next(response.obj);
                    this.proposalInfo = response.obj;
                    if (this.proposalInfo.stSdgsGoalsId) {
                        this.proposalInfo.stSdgsGoalsId =
                            typeof this.proposalInfo.stSdgsGoalsId == 'object'
                                ? this.proposalInfo.stSdgsGoalsId
                                : this.proposalInfo.stSdgsGoalsId;
                    } else {
                        this.proposalInfo.stSdgsGoalsId = '';
                    }
                    this.snackbarHelper.openSuccessSnackBarWithMessage(
                        response.message,
                        OK
                    );
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(
                        response.message,
                        ERROR
                    );
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            (error) => {
                console.log('error ==== >>>> ', error);
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }
    onUpdate(next: boolean) {
        this.spinner = true;
        this.researcherProposalService.update(this.proposalInfo).subscribe(
            (response) => {
                if (response.success) {
                    this.proposalInfo = response.obj;
                    this.setFieldData(response.obj);
                    //this.snackbarHelper.openSuccessSnackBarWithMessage(response.message,OK);
                    this.snackbarHelper.openSuccessSnackBar();
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            (error) => {
                console.log('error ==== >>>> ', error);
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }
    setFieldData(objData) {
        if (objData.stSdgsGoalsId) {
            this.proposalInfo.stSdgsGoalsId =
                typeof objData.stSdgsGoalsId == 'object'
                    ? objData.stSdgsGoalsId
                    : objData.stSdgsGoalsId;
        } else {
            this.proposalInfo.stSdgsGoalsId = '';
        }
        if (objData.divisionId.length > 0) {
            // for set field values
            this.proposalInfo.divisionId = JSON.parse(objData.divisionId);
            // for set field values
            this.getDistrictByChangeDivision(objData.divisionId, 0, (res) => {
                if (res) {
                    if (objData.districtId.length > 0) {
                        //For load districts list
                        this.proposalInfo.districtId = JSON.parse(
                            objData.districtId
                        );
                        // for set field values
                        this.getUpazilaByChangeDistrict(
                            this.proposalInfo.districtId
                        );
                    }
                }
            });
        }
        if (objData.upzilaId.length > 0) {
            //for load upazilas list
            this.proposalInfo.upzilaId =
                typeof objData.upzilaId == 'object'
                    ? objData.upzilaId
                    : JSON.parse(objData.upzilaId);
        }
    }
    getResearcherProfileByUuId() {
        this.spinner = true;
        this.researchProfileMultiFormService.getResearcherProfileByUuid(this.researcherProfileUuId).subscribe((response) => {
                    if (response.success) {
                        
                        this.resProfilePersonalInfoId = response.obj.id;
                    }
                    this.spinner = false;
                },
                (error) => {
                    console.log('error ==== >>>> ', error);
                    this.spinner = false;
                }
            );
    }
    nextTab() {
        this.nextStep.emit(true);
    }
    previousTab(): void {
        this.backPrevious.emit(true);
    }
    onChangrResearchCategory(event: any) {
        this.onChangrResearchCategoryType.emit(event.value);
    }
    //================== For Location =========================
    setEmptyValue() {
        this.proposalInfo.divisionId = '';
        this.proposalInfo.divisionName = '';
        this.proposalInfo.districtId = '';
        this.proposalInfo.districtName = '';
        this.proposalInfo.upzilaId = '';
        this.proposalInfo.upzilaName = '';
        this.districtList_s = [];
        this.upazilaList_s = [];
    }
    getDistrictByChangeDivision(divisionIdList, fromHtml = 0, callBack) {
        divisionIdList =
            typeof divisionIdList == 'string'
                ? JSON.parse(divisionIdList)
                : divisionIdList;
        //var oldDistrictIds = (typeof this.proposalInfo.districtId == 'object') ? this.proposalInfo.districtId : JSON.parse(this.proposalInfo.districtId);
        let oldDistrictIdsVal = this.proposalInfo.districtId;
        let valStore = typeof oldDistrictIdsVal;
        if (fromHtml == 1) {
            var oldDistrictIds =
                typeof oldDistrictIdsVal == 'object' ? oldDistrictIdsVal : [];
        } else {
            var oldDistrictIds =
                typeof oldDistrictIdsVal == 'object'
                    ? oldDistrictIdsVal
                    : typeof oldDistrictIdsVal == 'string' &&
                      oldDistrictIdsVal != ''
                    ? JSON.parse(oldDistrictIdsVal)
                    : oldDistrictIdsVal;
        }
        var updateDistrictIds = [];
        var root = this;
        if (divisionIdList.length < 1) {
            this.setEmptyValue();
        }
        var storeDivisionName = '';
        var divisionList = this.divisionList;
        var storeDistricts = [];
        var i = 0;
        // this.DividionDU.getDistrictsList().subscribe(disList => {
        if (
            Array.isArray(this.storeDistrictList) &&
            this.storeDistrictList.length > 0
        ) {
            if (Array.isArray(divisionIdList)) {
                divisionIdList.forEach(function (divisionId, index) {
                    //Save division names create for easy report
                    divisionList.forEach(function (d: any, i) {
                        if (d.id == divisionId) {
                            storeDivisionName += d.en_name + ', ';
                        }
                    });
                    //Load district list by division id wise
                    root.storeDistrictList.forEach(function (disInfo: any, k) {
                        if (disInfo.division_id == divisionId) {
                            storeDistricts.push(disInfo);
                            if (Array.isArray(oldDistrictIds)) {
                                oldDistrictIds.forEach((oldIds) => {
                                    disInfo.list.forEach(function (val) {
                                        if (oldIds == val.id) {
                                            updateDistrictIds.push(val.id);
                                        }
                                    });
                                });
                                //Set upzila name after remove any district name from district field
                                root.spinner = true;
                                root.saveDisable = true;
                                setTimeout(function () {
                                    root.spinner = false;
                                    root.saveDisable = false;
                                    if (oldDistrictIds.length > 0) {
                                        root.getUpazilaByChangeDistrict(
                                            updateDistrictIds
                                        );
                                    }
                                }, 3000);
                            }
                        }
                    });
                });
                this.proposalInfo.divisionName =
                    storeDivisionName != ''
                        ? this.removeLastComma(storeDivisionName)
                        : '';
                this.districtList_s =
                    typeof storeDistricts == 'object'
                        ? storeDistricts
                        : JSON.parse(storeDistricts);
                if (typeof callBack == 'function') {
                    callBack(true);
                }
            }
        }
        // });
        if (typeof callBack == 'function') {
            callBack(false);
        }
    }
    getUpazilaByChangeDistrict(districtsIdList, fromHtml = 0) {
        var districtList = this.districtList_s;
        var storeDistrictName = '';
        this.upazilaList_s = [];
        let upzilaId = this.proposalInfo.upzilaId;
        if (fromHtml == 1) {
            var oldUpazilaIds = typeof upzilaId == 'object' ? upzilaId : [];
        } else {
            var oldUpazilaIds =
                typeof upzilaId == 'object'
                    ? upzilaId
                    : typeof upzilaId == 'string' && upzilaId != ''
                    ? JSON.parse(upzilaId)
                    : upzilaId;
        }
        var updateUpzilaIds = [];
        let root = this;
        root.spinner = false;
        root.saveDisable = false;
        if (districtsIdList.length > 0) {
            let storeUpazilas = [];
            //this.DividionDU.getUpazilaListByDistrictsIds().subscribe(upList => {
            root.proposalInfo.districtId = districtsIdList;
            districtsIdList.forEach(function (districtIdVal) {
                //Save district names create for easy Report
                root.districtList_s.forEach(function (d: any) {
                    d.list.forEach(function (v) {
                        if (v.id == districtIdVal) {
                            storeDistrictName += v.en_name + ', ';
                        }
                    });
                });
                //Load upazila list by district id wise
                root.storeUpazilaList.forEach(function (upInfo: any) {
                    if (upInfo.district_id == districtIdVal) {
                        storeUpazilas.push(upInfo);
                        //Set upzila id after remove any district name from district field
                        if (Array.isArray(oldUpazilaIds)) {
                            oldUpazilaIds.forEach((oldIds) => {
                                upInfo.list.forEach(function (v) {
                                    if (oldIds == v.id) {
                                        updateUpzilaIds.push(oldIds);
                                    }
                                });
                            });
                            //Set upzila name after remove any district name from district field
                            root.spinner = true;
                            root.saveDisable = true;
                            setTimeout(function () {
                                if (oldUpazilaIds.length > 0) {
                                    root.changeUpazilas(updateUpzilaIds);
                                }
                                root.spinner = false;
                                root.saveDisable = false;
                            }, 3000);
                        }
                    }
                });
            });
            this.proposalInfo.upzilaId = updateUpzilaIds;
            this.proposalInfo.districtName =
                storeDistrictName != ''
                    ? this.removeLastComma(storeDistrictName)
                    : '';
            this.upazilaList_s =
                typeof storeUpazilas == 'object'
                    ? storeUpazilas
                    : JSON.parse(storeUpazilas);
        } else {
            this.proposalInfo.districtName = '';
            this.proposalInfo.upzilaId = '';
        }
    }
    changeUpazilas(upazilaIds) {
        this.spinner = false;
        this.saveDisable = false;
        var storeUpzilaName = '';
        var upazilaList = this.upazilaList_s;
        let root = this;
        if (Array.isArray(upazilaIds)) {
            upazilaIds.forEach(function (upId) {
                //Save upazila names create for easy Report
                root.upazilaList_s.forEach(function (val) {
                    val.list.forEach(function (info) {
                        if (info.id == upId) {
                            storeUpzilaName += info.en_name + ', ';
                        }
                    });
                });
            });
        }
        this.proposalInfo.upzilaName =
            storeUpzilaName != '' ? this.removeLastComma(storeUpzilaName) : '';
    }
    /*
    getDivisionList() {
        this.divisionList = [];
        this.DividionDU.getDivision().subscribe(data => {
            this.divisionList = data;
        })
    }
    getDistrictList() {
        this.storeDistrictList = [];
        this.DividionDU.getDistrictsList().subscribe(data => {
            this.storeDistrictList = data;
        })
    }
    getUpazilaList() {
        this.storeUpazilaList = [];
        this.DividionDU.getUpazilaList().subscribe(data => {
            this.storeUpazilaList = data;
        })
    }
    */
    removeLastComma(str) {
        return str.replace(/,\s*$/, '');
    }
    processData(callBack) {
        if (!this.activeFisYear) {
            return;
        }
        
        this.activeFiscalYearFinalList = this.activeFisYear.map((m) => {
            this.setFiscalYearId.emit(m.stFiscalYearId);
            let f = this.fiscalYearsList.find((f) => f.id == m.stFiscalYearId);
            return f;
        });
        if (this.activeFiscalYearFinalList) {
            let fiscalYearId = ''; 

            // let URL = `${environment.ibcs.rpmBackend}api/fyw-sector-sub-sector-selection/get-fyw-sector-sub-sector/${this.activeFiscalYearFinalList[0].id}`;
            
            if(this.existingProposalInfo?.fiscalYear?.id > 0) //This is for edit time
            {
                fiscalYearId = this.existingProposalInfo?.fiscalYear?.id;
            }
            else
            { // This is for new add time
                this.proposalInfo.stFiscalYearId = fiscalYearId = this.activeFiscalYearFinalList[0].id;
            }
            let URL = `${environment.ibcs.rpmBackend}api/fyw-sector-sub-sector-selection/get-fyw-sector-sub-sector/${fiscalYearId}`;
            this.api.get(URL).subscribe((res2) => {
                if (res2.success) {
                    this.activeSectorList = res2.items ? res2.items : [];
                    this.sectorFinalList = this.activeSectorList.map((m) => {
                        let f = this.sectorList.find(
                            (f) => f.id == m.stSectorTypeId
                        );
                        return f;
                    });
                }
                callBack(true);
            });
        }
        callBack(false);
    }
    onChangeSectorFinal(id: any) {
        let f = this.activeSectorList.find((f) => f.stSectorTypeId == id);
        this.subSectorFinalList = JSON.parse(f?.stSubSectorId).map((m) => {
            let f = this.subSectorList.find((f) => f.id == m);
            return f;
        });
    }
}
