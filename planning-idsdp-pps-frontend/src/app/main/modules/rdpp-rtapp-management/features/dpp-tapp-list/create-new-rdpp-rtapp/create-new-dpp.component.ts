import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ProjectSummaryService} from "../../../../project-concept-management/services/project-summary.service";
import {Router} from "@angular/router";
import {ProjectConceptService} from "../../../../project-concept-management/services/project-concept.service";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {UtilsService} from "../../../../../core/services/utils.service";
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import {locale as lngEnglish} from "../../../../project-concept-management/features/project-concepts/project-concept-setup/component-tabs/project-summary/i18n/en";
import {locale as lngBangla} from "../../../../project-concept-management/features/project-concepts/project-concept-setup/component-tabs/project-summary/i18n/bn";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DppTappApproveProjectListService} from "../../../services/dpp-tapp-approve-project-list.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatSelectChange} from "@angular/material/select";
import {RdppRtappModel} from "../../../models/rdpp-rtapp-model";
import {TappObjectiveCostService} from "../../../services/tapp-objective-cost.service";
import {RtappObjectiveCostModel} from "../../../models/rtapp-objective-cost.model";
import { RdppObjectiveCostService } from '../../../services/rdpp-objective-cost.service';


@Component({
    selector: 'app-create-new-dpp',
    templateUrl: './create-new-dpp.component.html',
    styleUrls: ['./create-new-dpp.component.scss']
})
export class CreateNewDppComponent extends UnsubscribeAdapterComponent implements OnInit {
    form: FormGroup;
    formGroup: FormGroup;
    updateForm: FormGroup;
    expCommencementMaxDate: Date;
    expCompletionMinDate: Date;
    spinner: boolean;
    show = true;
    userId: any;
    ministry_name: string;
    agency_name: string;
    selectTimeExtension: boolean;
    approveDppTappList: any;
    pcUUid: string;
    rdppRtapp: RdppRtappModel = new RdppRtappModel();
    rtappModel: RtappObjectiveCostModel = new RtappObjectiveCostModel();
    projectType: string;

    constructor(
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: ProjectSummaryService,
        private dppService: DppTappApproveProjectListService,
        private router: Router,
        private projectConceptService: ProjectConceptService,
        private snackbarHelper: SnackbarHelper,
        private utilsService: UtilsService,
        private userGroupService: UserGroupService,
        // private dppObjectiveCostService: DppObjectiveCostService,
        private rtappObjAndCostService: TappObjectiveCostService,
        private rdppObjectiveCostService: RdppObjectiveCostService
    ) {
        super();
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getUserGroup();
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userId = res.res.userId;
            this.getUserInfoByUserId(this.userId);
        })
    }

    getUserInfoByUserId(userId) {
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.agency_name = res.agency.nameEn;
            this.ministry_name = res.agency.ministryDivision.nameEn;
            this.getApproveDppTappProjectList(res.agency.id);
        })
    }

    getApproveDppTappProjectList(agencyId) {
        this.dppService.getApproveDppTappList(agencyId).subscribe(res => {
            this.approveDppTappList = res.res;
        })
    }

    public create(): any {
        this.spinner= true;
        this.rdppObjectiveCostService.createRdppRtapp(this.rdppRtapp).subscribe(
            res => {
                if (res) {
                    this.rdppRtapp = new RdppRtappModel();
                    this.selectTimeExtension = true;
                    this.snackbarHelper.openSuccessSnackBar();
                    this.router.navigate(['/rdpp-rtapp'], { queryParams: {projectType: this.projectType}, skipLocationChange: true});
                }
                this.spinner = false;
            },
            err => {
                this.spinner = false;
                this.snackbarHelper.openErrorSnackBar();
            }
        );
    }

    public createRtapp(): any {
        this.spinner = true;
        this.rtappObjAndCostService.createObjectiveCost(this.rtappModel, false).subscribe(
            res => {
                if (res) {
                    this.rtappModel = new RtappObjectiveCostModel();
                    this.selectTimeExtension = true;
                    this.snackbarHelper.openSuccessSnackBar();
                    this.router.navigate(['/rdpp-rtapp'], { queryParams: {projectType: this.projectType}, skipLocationChange: true});
                }
                this.spinner = false;
            },
            err => {
                this.spinner = false;
                this.snackbarHelper.openErrorSnackBar();
            }
        );
    }

    // set Commencement Max Date
    completionDataChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.expCommencementMaxDate = new Date(value.getFullYear(), value.getMonth(), value.getDate())
    }

    // set Completion Min Date
    commencementDataChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.expCompletionMinDate = new Date(value.getFullYear(), value.getMonth(), value.getDate())
    }

    onTimeExtensionChecked($event: MatCheckboxChange, projectType: string) {
        if(projectType == 'RDPP') {
            if($event.checked) {
                this.selectTimeExtension = true;
            } else {
                this.selectTimeExtension = false;
                this.rdppRtapp.cumulativeDate = null;
            }
        } else {
            if($event.checked) {
                this.selectTimeExtension = true;
            } else {
                this.selectTimeExtension = false;
                this.rtappModel.cumulativeDate = null;
            }
        }
    }

    /*----------  Get Project Concept By Id ------------*/
    private getObjectiveAndCostByProjectConceptId(pcUUid: string) {
        this.rdppObjectiveCostService.getByProjectConceptUuid(pcUUid).subscribe((response: any) => {
            this.rdppRtapp = response.res;
            this.checkCurrentVersionRdppOrRtapp(pcUUid, "DPP");
            this.rdppRtapp.timeExtension = true;
            if (response.status > 0) {
                this.show = false;
            }
        });
    }

    private getTappObjectiveAndCostByPcUuid(pcUuid: string){
        this.rtappObjAndCostService.getObjCostProjectConceptByUuid(pcUuid).subscribe((response) =>{
            this.setTappData(response.res);
            this.checkCurrentVersionRdppOrRtapp(pcUuid, "TAPP");
            this.rtappModel.timeExtension = true;
            if (response.status > 0) {
                this.show = false;
            }
        })
    }

    private setTappData(res: any){
        this.rtappModel.tappMasterId = res.id;
        this.rtappModel.currencyRateList = res.tappCurrencyRateDTOS;
        this.rtappModel.concernedDivisionId = res.concernedDivisionId;
        this.rtappModel.dateCommencement = res. dateCommencement;
        this.rtappModel.dateCompletion = res.dateCompletion;
        this.rtappModel.implementingAgency = res.implementingAgency;
        this.rtappModel.ministryDivision = res.ministryDivision;
        this.rtappModel.objectivesTargets = res.objectivesTargets;
        this.rtappModel.projectTitleBn = res.projectTitleBn;
        this.rtappModel.projectTitleEn = res.projectTitleEn;
        this.rtappModel.responsiblePreparation = res.responsiblePreparation;
        this.rtappModel.status = res.status;
        this.rtappModel.projectConceptUuid = res.projectConceptUuid;
        this.rtappModel.developmentPartner = res.developmentPartner;
        this.rtappModel.designationContactPerson = res.designationContactPerson;
        this.rtappModel.devPartnerlist = res.developmentPartnersList;
        this.rtappModel.developmentEA = res.tappModeFinanceDTO.developmentEA;
        this.rtappModel.developmentSource = res.tappModeFinanceDTO.developmentSource;
        this.rtappModel.developmentFe = res.tappModeFinanceDTO.developmentFe;
        this.rtappModel.developmentLocal = res.tappModeFinanceDTO.developmentLocal;
        this.rtappModel.developmentLocal = res.tappModeFinanceDTO.developmentLocal;
        this.rtappModel.developmentTotal = res.tappModeFinanceDTO.developmentTotal;
        this.rtappModel.gobEA = res.tappModeFinanceDTO.gobEA;
        this.rtappModel.gobFe = res.tappModeFinanceDTO.gobFe;
        this.rtappModel.gobLocal = res.tappModeFinanceDTO.gobLocal;
        this.rtappModel.gobSource = res.tappModeFinanceDTO.gobSource;
        this.rtappModel.gobTotal = res.tappModeFinanceDTO.gobTotal;
        this.rtappModel.grandTotalEa = res.tappModeFinanceDTO.grandTotalEa;
        this.rtappModel.grandTotalFe = res.tappModeFinanceDTO.grandTotalFe;
        this.rtappModel.grandTotalLocal = res.tappModeFinanceDTO.grandTotalLocal;
        this.rtappModel.grandTotalTotal = res.tappModeFinanceDTO.grandTotalTotal;
        this.rtappModel.othersSpecifyEA = res.tappModeFinanceDTO.othersSpecifyEA;
        this.rtappModel.othersSpecifyFe = res.tappModeFinanceDTO.othersSpecifyFe;
        this.rtappModel.othersSpecifyLocal = res.tappModeFinanceDTO.othersSpecifyLocal;
        this.rtappModel.othersSpecifySource = res.tappModeFinanceDTO.othersSpecifySource;
        this.rtappModel.othersSpecifyTotal = res.tappModeFinanceDTO.othersSpecifyTotal;
        this.rtappModel.ownFundEA = res.tappModeFinanceDTO.ownFundEA;
        this.rtappModel.ownFundFe = res.tappModeFinanceDTO.ownFundFe;
        this.rtappModel.ownFundLocal = res.tappModeFinanceDTO.ownFundLocal;
        this.rtappModel.ownFundSource = res.tappModeFinanceDTO.ownFundSource;
        this.rtappModel.ownFundTotal = res.tappModeFinanceDTO.ownFundTotal;
        this.rtappModel.tappMasterId = res.id;

        this.rtappModel.referenceId = res.id;
        this.rtappModel.referenceUuid = res.uuid;
    }

    private getProjectType(pcUuid){
        this.spinner = true;
        let referenceObj = this.approveDppTappList.find(data => data.projectConceptUuid === pcUuid);
        this.projectType = referenceObj.dppTappType;

        if(referenceObj && (referenceObj.dppTappType=="DPP" || referenceObj.dppTappType=="TAPP")){
            this.service.getByUuid(pcUuid).subscribe(res=>{

                let projectType = res.projectTypeDTO.nameEn;
                if(projectType === "DPP"){
                    this.getObjectiveAndCostByProjectConceptId(pcUuid);
                }else{
                    this.getTappObjectiveAndCostByPcUuid(pcUuid);
                }
                this.spinner = false;
            })
        } else if(referenceObj && referenceObj.dppTappType=="RDPP"){
            this.rdppObjectiveCostService.findObjectiveCostByUuid(referenceObj.uuid).subscribe(
                res =>{
                    if(res){
                        this.rdppRtapp = res.res;
                        this.rdppRtapp.referenceId = res.res.id;
                        this.rdppRtapp.referenceUuid = res.res.uuid;
                        this.checkCurrentVersionRdppOrRtapp(res.res.projectConceptUuid, "DPP");
                        if (res.status > 0) {
                            this.show = false;
                        }
                        this.spinner = false;
                    }
                }
            )
        } else if(referenceObj && referenceObj.dppTappType=="RTAPP"){
            this.rtappObjAndCostService.findObjectiveCostByUuid(referenceObj.uuid).subscribe(
                res => {
                    if(res){
                        this.setTappData(res.res);
                        this.checkCurrentVersionRdppOrRtapp(res.res.projectConceptUuid, "TAPP");
                        if (res.status > 0) {
                            this.show = false;
                        }
                        this.spinner = false;
                    }
                }
            )
        }
    }

    onChangeProjectTitle($event: MatSelectChange) {
        this.selectTimeExtension = true;
        this.getProjectType($event.value)
    }

    checkCurrentVersionRdppOrRtapp(pcUuid: any, type: string) {
        this.rdppObjectiveCostService.checkCurrentVersionRdppOrRtapp(pcUuid).subscribe( response => {
            if (type === "DPP") {
                this.rdppRtapp.version = response.res.currentVersion;
                if (response.res.currentVersion === "1st Revised") {
                    this.rdppRtapp.projectTitleEn = this.rdppRtapp.projectTitleEn + " (" + response.res.currentVersion + ")";
                    this.rdppRtapp.projectTitleBn = this.rdppRtapp.projectTitleBn + " (" + response.res.currentVersionBn + ")";
                } else {
                    this.rdppRtapp.projectTitleEn = this.rdppRtapp.projectTitleEn.replace(response.res.previousVersion, response.res.currentVersion);
                    this.rdppRtapp.projectTitleBn = this.rdppRtapp.projectTitleBn.replace(response.res.previousVersionBn, response.res.currentVersionBn);
                }
            } else if (type === "TAPP") {
                this.rtappModel.revisedVersion = response.res.currentVersion;
                if (response.res.currentVersion === "1st Revised") {
                    this.rtappModel.projectTitleEn = this.rtappModel.projectTitleEn + " (" + response.res.currentVersion + ")";
                    this.rtappModel.projectTitleBn = this.rtappModel.projectTitleBn + " (" + response.res.currentVersionBn + ")";
                } else {
                    this.rtappModel.projectTitleEn = this.rtappModel.projectTitleEn.replace(response.res.previousVersion, response.res.currentVersion);
                    this.rtappModel.projectTitleBn = this.rtappModel.projectTitleBn.replace(response.res.previousVersionBn, response.res.currentVersionBn);
                }
            }
        });
    }

    goBackToHome() {
        window.history.back();
    }
}
