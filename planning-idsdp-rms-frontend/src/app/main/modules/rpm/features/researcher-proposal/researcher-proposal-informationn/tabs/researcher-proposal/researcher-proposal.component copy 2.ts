import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ResearcherProposal } from "../../../../../models/ResearcherProposal";
import { FiscalYearServiceService } from "../../../../../../settings/services/fiscal-year-service.service";
import { UnsubscribeAdapterComponent } from "../../../../../../../core/helper/unsubscribeAdapter";
import { map, switchMap } from "rxjs/operators";
import { ResearchCategoryTypeService } from "../../../../../../settings/services/research-category-type.service";
import { SectorTypeService } from "../../../../../../settings/services/sector-type.service";
import { SubSectorService } from "../../../../../../settings/services/sub-sector.service";
import { FuseTranslationLoaderService } from "../../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ResearcherProposalService } from 'app/main/modules/rpm/services/researcher-proposal.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { refreshIcon, saveIcon, previousIcon, addNewIcon, nextIcon } from 'app/main/modules/rpm/constants/button.constants';
import { sdgsGoalsList } from 'app/main/modules/rpm/contants/sdgs-goals-list.constant';
import {divisionList, districtList} from 'app/main/modules/rpm/contants/location/division-district-list.constant';
import {upazilaList} from 'app/main/modules/rpm/contants/location/upazila-list.constant';
import { ResearchProfileMultiFormService } from "../../../../../services/research-profile-multi-form.service";
import { ERROR, OK } from 'app/main/core/constants/message';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { ProposalSubmissionService } from 'app/main/modules/training-institute/services/proposal-submission.service';
import { DivisionDistrictUpzilaService } from 'app/main/modules/rpm/services/division-district-upzila.service';
import { environment } from 'environments/environment';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-researcher-proposal',
    templateUrl: './researcher-proposal.component.html',
    styleUrls: ['./researcher-proposal.component.scss']
})
export class ResearcherProposalComponent extends UnsubscribeAdapterComponent implements OnInit, OnChanges {

    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>
    @Input() researcherProfileUuId: string;
    @Input() categoryTypeId: number;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Output() onChangrResearchCategoryType = new EventEmitter<any>();

    
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
    nationalPlanAlignmentList = ["Five Year Plan", "Perspective Plan", "Delta Plan"];
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };


    //==================  For Location ====================
    

    divisionList = divisionList;
    storeDistrictList = districtList;
    storeUpazilaList = upazilaList;

    districtList_s = [];
    upazilaList = [];

    ParDivisionList = [];
    ParDistrictList = [];
    ParUpzilaList = [];

    activeFisYear: any[];
    activeFiscalYearFinalList: any[] = [];
    sectorFinalList: any[];
    subSectorFinalList: any[];
    fiscalYearsList: any[];
    activeSectorList: any[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
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
        private _toastrService: ToastrService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        
        // this.getDivisionList();
        // this.getDistrictList();
        // this.getUpazilaList();
    }

    ngOnInit(): void {
        
        this.proposalInfo.stResearchCatTypeId = Number(this.categoryTypeId);
        this.onChangrResearchCategory({ value: this.proposalInfo.stResearchCatTypeId });
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
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposalInfo': {
                        if (this.existingProposalInfo.id) {
                            //console.log('this.existingProposalInfo => ', this.existingProposalInfo);
                            this.proposalInfo = this.existingProposalInfo;

                            let divisionIds = this.proposalInfo.divisionId;
                            let districtIds = this.proposalInfo.districtId;
                            let upzilaIdS = this.proposalInfo.upzilaId;



                            if (divisionIds != null && divisionIds != "") {

                                let divisionIds2 = (typeof divisionIds == 'string') ? JSON.parse(divisionIds) : divisionIds;
                                // for set division Ids
                                this.proposalInfo.divisionId = divisionIds2;
                                // for set field values                                                
                                this.getDistrictByChangeDivision(divisionIds2, 0, (res) => {
                                    if (res) {
                                        if (districtIds != null && districtIds != "") {
                                            let districtIds2 = (typeof districtIds == 'string') ? JSON.parse(districtIds) : districtIds;
                                            //For set district ids
                                            this.proposalInfo.districtId = districtIds2;
                                            // for set field values                                                           
                                            this.getUpazilaByChangeDistrict(districtIds2);

                                            if (upzilaIdS != null && upzilaIdS != "") {
                                                let upzilaIdS2 = (typeof upzilaIdS == 'string') ? JSON.parse(upzilaIdS) : upzilaIdS;
                                                //For set upzila Ids
                                                this.proposalInfo.upzilaId = upzilaIdS2;
                                            }
                                        }
                                    }
                                });
                            }
                            this.processData((res2) => {
                                if (res2) {
                                    if (this.proposalInfo.stSectorTypeId) {
                                        this.onChangeSectorFinal(this.proposalInfo.stSectorTypeId);
                                    }
                                }
                            });
                            //this.onChangeSector(this.proposalInfo.stSectorTypeId);
                            this.onChangrResearchCategoryType.emit(this.proposalInfo.researchCategoryType.id);
                        }
                    }
                }
            }
        }
    }

    private getAll(callBack) {
        this.spinner = true;
        this.subscribe$.add(
            this.fiscalYearService.getAllActive().pipe(
                switchMap(fy => this.researchCategoryTypeService.getAllActiveList().pipe(
                    switchMap(rct => this.sectorTypeService.getAllActiveList().pipe(
                        switchMap(sec => this.subSectorService.getAllActiveList().pipe(
                            switchMap(subSec => this._proposalSubmissionService.getProposalSubmissionDates().pipe(
                                map(activeFisYear => ({ fy: fy, rct: rct, sec: sec, subSec: subSec, activeFisYear: activeFisYear }))
                            ))
                        ))
                    ))
                ))
            ).subscribe(res => {               
                this.fiscalYearsList = res.fy.items ? res.fy.items : [];
                this.researchCategoryTypeList = res.rct.items ? res.rct.items : [];
                this.sectorList = res.sec.items ? res.sec.items : [];
                this.activeFisYear = [res.activeFisYear];               
                this.subSectorList = res.subSec.items ? res.subSec.items : [];
                this.spinner = false;
                callBack(true);
            })
        );
        callBack(false);
        this.spinner = false;
    }

    onChangeSector(id: any) {
        this.subscribe$.add(
            this.subSectorService.getBySectorId(id).subscribe(res => {
                this.subSectorList = res.items ? res.items : [];
            })
        );
    }

    onSubmit(next: boolean, f: any) {

        if (!this.proposalInfo) {
            return;
        }

        if (!this.proposalInfo.stFiscalYearId || !this.proposalInfo.stResearchCatTypeId || !this.proposalInfo.stSectorTypeId || !this.proposalInfo.stSubSectorsId || !this.proposalInfo.researchTitle) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }


        this.saveDisable = true;
        this.proposalInfo.stSdgsGoalsId = (typeof this.proposalInfo.stSdgsGoalsId == 'object') ? JSON.stringify(this.proposalInfo.stSdgsGoalsId) : this.proposalInfo.stSdgsGoalsId;
        this.proposalInfo.divisionId = (typeof this.proposalInfo.divisionId == 'object') ? JSON.stringify(this.proposalInfo.divisionId) : this.proposalInfo.divisionId;
        this.proposalInfo.districtId = (typeof this.proposalInfo.districtId == 'object') ? JSON.stringify(this.proposalInfo.districtId) : this.proposalInfo.districtId;
        this.proposalInfo.upzilaId = (typeof this.proposalInfo.upzilaId == 'object') ? JSON.stringify(this.proposalInfo.upzilaId) : this.proposalInfo.upzilaId;

        if (this.proposalInfo.id) {
            this.onUpdate(next);
        } else {
            this.onSave(next);
        }
    }

    onSave(next: boolean) {
        this.proposalInfo.resProfilePersonalInfoId = this.resProfilePersonalInfoId;
        this.proposalInfo.approvalStatus = 3;
        this.spinner = true;
        this.researcherProposalService.create(this.proposalInfo).subscribe(
            response => {
                if (response.success) {
                    this.brodCastChange.next(response.obj);
                    this.proposalInfo = response.obj;
                    if (this.proposalInfo.stSdgsGoalsId) {
                        this.proposalInfo.stSdgsGoalsId = (typeof this.proposalInfo.stSdgsGoalsId == 'object') ? this.proposalInfo.stSdgsGoalsId : this.proposalInfo.stSdgsGoalsId;
                    } else {
                        this.proposalInfo.stSdgsGoalsId = '';
                    }
                    this.snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }

    onUpdate(next: boolean) {
        this.spinner = true;
        this.researcherProposalService.update(this.proposalInfo).subscribe(
            response => {
                if (response.success) {
                    this.proposalInfo = response.obj;
                    this.setFieldData(response.obj)

                    // if (this.proposalInfo.stSdgsGoalsId) {
                    //     this.proposalInfo.stSdgsGoalsId = (typeof this.proposalInfo.stSdgsGoalsId == 'object') ? this.proposalInfo.stSdgsGoalsId : this.proposalInfo.stSdgsGoalsId;
                    // } else {
                    //     this.proposalInfo.stSdgsGoalsId = '';
                    // }
                    
                    this.snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }

    setFieldData(objData) {

        if (objData.stSdgsGoalsId) {
            this.proposalInfo.stSdgsGoalsId = (typeof objData.stSdgsGoalsId == 'object') ? objData.stSdgsGoalsId : objData.stSdgsGoalsId;
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
                        this.proposalInfo.districtId = JSON.parse(objData.districtId);
                        // for set field values                                                           
                        this.getUpazilaByChangeDistrict(this.proposalInfo.districtId);
                    }
                }
            });
        }



        if (objData.upzilaId.length > 0) {
            //for load upazilas list
            this.proposalInfo.upzilaId = (typeof objData.upzilaId == 'object') ? objData.upzilaId : JSON.parse(objData.upzilaId);
        }
    }

    getResearcherProfileByUuId() {
        this.spinner = true;
        this.researchProfileMultiFormService.getResearcherProfileByUuid(this.researcherProfileUuId).subscribe(
            response => {
                if (response.success) {
                    this.resProfilePersonalInfoId = response.obj.id;
                }
                this.spinner = false;
            },
            error => {
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
        this.proposalInfo.divisionId = "";
        this.proposalInfo.divisionName = "";

        this.proposalInfo.districtId = "";
        this.proposalInfo.districtName = "";

        this.proposalInfo.upzilaId = "";
        this.proposalInfo.upzilaName = "";

        this.districtList_s = [];
        this.upazilaList = [];
    }



    getDistrictByChangeDivision(divisionIdList, fromHtml = 0, callBack) {

        divisionIdList = (typeof divisionIdList == 'string') ? JSON.parse(divisionIdList) : divisionIdList;

        //var oldDistrictIds = (typeof this.proposalInfo.districtId == 'object') ? this.proposalInfo.districtId : JSON.parse(this.proposalInfo.districtId);
        let oldDistrictIdsVal = this.proposalInfo.districtId;
        console.log('typeof oldDistrictIdsVal = ', typeof oldDistrictIdsVal);
        console.log('oldDistrictIdsVal val=>', oldDistrictIdsVal);
        
        let valStore = typeof oldDistrictIdsVal;
        if (fromHtml == 1) {
            //var oldDistrictIds = (typeof oldDistrictIdsVal == 'object') ? oldDistrictIdsVal : (typeof oldDistrictIdsVal == 'string') ? JSON.parse(oldDistrictIdsVal) : [];
            var oldDistrictIds = (typeof oldDistrictIdsVal == 'object') ? oldDistrictIdsVal : [];
        }
        else {
            var oldDistrictIds = (typeof oldDistrictIdsVal == 'object') ? oldDistrictIdsVal : (typeof oldDistrictIdsVal == 'string') ? JSON.parse(oldDistrictIdsVal) : oldDistrictIdsVal;
        }

        var updateDistrictIds = [];
        var root = this;

        if (divisionIdList.length < 1) {
            this.setEmptyValue();
        }

        var storeDivisionName = "";

        var divisionList = this.divisionList;

        var storeDistricts = [];

        var i = 0;
        // this.DividionDU.getDistrictsList().subscribe(disList => {            
            if (Array.isArray(this.storeDistrictList) && this.storeDistrictList.length > 0) {            
                if (Array.isArray(divisionIdList)) {
                    divisionIdList.forEach((function (divisionId, index) {
                        
                        //Save division names create for easy report
                        divisionList.forEach(function (d: any, i) {
                            if (d.id == divisionId) {
                                storeDivisionName += d.en_name + ", ";

                                storeDistricts[index] = {"levelNmae":"", "fieldVal":[]};
                                storeDistricts[index]['levelNmae'] = d.en_name;
                            }
                            
                        })

                        //Load district list by division id wise
                        root.storeDistrictList.forEach(function (disInfo: any, k) {
                            if (disInfo.division_id == divisionId) {

                                if(disInfo?.id > 0){
                                    storeDistricts[index]['fieldVal'][index] = disInfo;
                                }

                                if (oldDistrictIds.length > 0) {

                                    if (Array.isArray(oldDistrictIds)) {
                                        oldDistrictIds.forEach(oldIds => {
                                            if (oldIds == disInfo.id) {
                                                updateDistrictIds.push(oldIds);
                                            }
                                        });

                                        //Set upzila name after remove any district name from district field
                                        root.spinner = true;
                                        setTimeout(function () {
                                            if (oldDistrictIds.length > 0) {
                                                root.getUpazilaByChangeDistrict(updateDistrictIds)
                                            }
                                        }, 3000)


                                    }
                                }
                            }

                        })
                    }))

                    this.proposalInfo.divisionName = (storeDivisionName != "") ? this.removeLastComma(storeDivisionName) : "";

                    console.log("storeDistricts level name 1 = ", storeDistricts);
                    storeDistricts.filter(x => x != null);
                    console.log("storeDistricts level name 2 = ", storeDistricts);
                    this.districtList_s = (typeof storeDistricts == 'object') ? storeDistricts : JSON.parse(storeDistricts);
                    if (typeof callBack == "function") {
                        callBack(true);
                    }
                }
            }
        // });
        if (typeof callBack == "function") {
            callBack(false);
        }
    }

    getUpazilaByChangeDistrict(districtsIdList, fromHtml = 0) {
        var districtList = this.districtList_s;
        var storeDistrictName = "";
        this.upazilaList = [];

        let upzilaId = this.proposalInfo.upzilaId;

        if (fromHtml == 1) {
            var oldUpazilaIds = (typeof upzilaId == 'object') ? upzilaId : [];
        } else {
            var oldUpazilaIds = (typeof upzilaId == 'object') ? upzilaId : (typeof upzilaId == 'string') ? JSON.parse(upzilaId) : upzilaId;
        }

        var updateUpzilaIds = [];
        let root = this;

        root.spinner = false;

        if (districtsIdList.length > 0) {
            let storeUpazilas = [];
            //this.DividionDU.getUpazilaListByDistrictsIds().subscribe(upList => {

            districtsIdList.forEach((function (districtId) {

                //Save district names create for easy Report
                districtList.forEach(function (d: any) {
                    if (d.id == districtId) {
                        storeDistrictName += d.en_name + ", ";
                    }
                })

                //Load upazila list by district id wise
                root.storeUpazilaList.forEach(function (upInfo: any) {
                    if (upInfo.district_id == districtId) {
                        storeUpazilas.push(upInfo);

                        //Set upzila id after remove any district name from district field
                        if (oldUpazilaIds.length > 0) {

                            if (Array.isArray(oldUpazilaIds)) {
                                oldUpazilaIds.forEach(oldIds => {
                                    if (oldIds == upInfo.id) {
                                        updateUpzilaIds.push(oldIds);
                                    }
                                });

                                //Set upzila name after remove any district name from district field
                                root.spinner = true;
                                setTimeout(function () {
                                    if (oldUpazilaIds.length > 0) {
                                        root.changeUpazilas(updateUpzilaIds)
                                    }
                                }, 3000)
                            }
                        }
                    }
                })
            }))

            this.proposalInfo.upzilaId = updateUpzilaIds;



            this.proposalInfo.districtName = (storeDistrictName != "") ? this.removeLastComma(storeDistrictName) : "";
            this.upazilaList = (typeof storeUpazilas == 'object') ? storeUpazilas : JSON.parse(storeUpazilas);
            //})
        }
        else {
            this.proposalInfo.districtName = "";
            this.proposalInfo.upzilaId = "";
        }
    }

    changeUpazilas(upazilaIds) {
        this.spinner = false;
        var storeUpzilaName = "";
        var upazilaList = this.upazilaList;

        if (Array.isArray(upazilaIds)) {
            upazilaIds.forEach(function (upId) {

                //Save upazila names create for easy Report
                upazilaList.forEach(function (val) {
                    if (val.id == upId) {
                        storeUpzilaName += val.en_name + ", ";
                    }
                })
            })
        }
        this.proposalInfo.upzilaName = (storeUpzilaName != "") ? this.removeLastComma(storeUpzilaName) : "";
    }


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

    removeLastComma(str) {
        return str.replace(/,\s*$/, "");
    }


    processData(callBack) {
        if (!this.activeFisYear) {
            return;
        }

        this.activeFiscalYearFinalList = this.activeFisYear.map(m => {
            let f = this.fiscalYearsList.find(f => f.id == m.stFiscalYearId);
            return f;
        });

        if (this.activeFiscalYearFinalList) {
            let URL = `${environment.ibcs.rpmBackend}api/fyw-sector-sub-sector-selection/get-fyw-sector-sub-sector/${this.activeFiscalYearFinalList[0].id}`;
            this.api.get(URL).subscribe(res2 => {
                if (res2.success) {
                    this.activeSectorList = res2.items ? res2.items : [];
                    this.sectorFinalList = this.activeSectorList.map(m => {
                        let f = this.sectorList.find(f => f.id == m.stSectorTypeId);
                        return f;
                    });
                }
                callBack(true);
            });
        }

        callBack(false);
    }

    onChangeSectorFinal(id: any) {
        let f = this.activeSectorList.find(f => f.stSectorTypeId == id);
        this.subSectorFinalList = JSON.parse(f.stSubSectorId).map(m => {
            let f = this.subSectorList.find(f => f.id == m);
            return f;
        });
    }

}
