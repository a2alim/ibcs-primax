import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import {OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN} from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { DppAnnualPhasingConstant } from 'app/main/modules/dpp-tapp-management/constants/dpp-annual-phasing.constant';
import { IDppAnnexure5ACostTotal } from 'app/main/modules/dpp-tapp-management/models/dpp-annexure5A-cost-total';
import { IDppAnnualPhasingEstimatedCostTabDetails } from 'app/main/modules/dpp-tapp-management/models/dpp-annual-phasing-estimated-cost-tab-details';
import { AssingEcnecMeetingService } from 'app/main/modules/dpp-tapp-management/services/assign-ecnec-meeting.service';
import { DppAnnualPhasingCostService } from 'app/main/modules/dpp-tapp-management/services/dpp-annual-phasing-cost.service';
import { DppObjectiveCostService } from 'app/main/modules/dpp-tapp-management/services/dpp-objective-cost.service';
import { DppTappGoService } from 'app/main/modules/dpp-tapp-management/services/dpp-tapp-go.service';
import { EcnecMeetingService } from 'app/main/modules/dpp-tapp-management/services/ecnec-meeting.service';
import { AnnualPhasingCostValidator } from 'app/main/modules/dpp-tapp-management/validators/annual-phasing-cost.validator';
import { NumberPipe } from 'app/main/shared/pipes/number-pipe.pipe';
import {ProjectMovementService as StageMovementService} from "../../../../services/project-movement.service";

@Component({
    selector: 'app-create-dpp-tapp-go',
    templateUrl: './create-dpp-tapp-go.component.html',
    styleUrls: ['./create-dpp-tapp-go.component.scss'],
})
export class CreateDppTappGoComponent implements OnInit {

    show: boolean;
    isForeignAid: boolean;
    uuid: string;
    orderType: string;
    projectSummary: any = {};
    objectiveCost: any = {};
    annualPhasingCostObj: any = {};
    dppTappGoObj: any = {};
    ecnecMeetingObj: any = {};
    revenueTotal: IDppAnnexure5ACostTotal;
    capitalTotal: IDppAnnexure5ACostTotal;
    grantTotal: IDppAnnexure5ACostTotal;
    revenueList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    capitalList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;

    goForm: FormGroup;
    aoForm: FormGroup;
    minEditorConfig: any = MIN_EDITOR_CONFIG;
    approvalDate: any;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dppTappGoService: DppTappGoService,
        private snackbarHelper: SnackbarHelper,
        private objectiveAndCostService : DppObjectiveCostService,
        private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
        private assignMeetingService : AssingEcnecMeetingService,
        public numberPipe : NumberPipe,
        private stageMovementService: StageMovementService,
    ) {}

    ngOnInit(): void {
        this.uuid = this.activatedRoute.snapshot.params['uuid'];
        this.orderType = this.activatedRoute.snapshot.params['orderType'];
        this.findByPcUuidAndOrderType();
        this.populateForm();
        this.getDppObjectiveCostByPcUuid();
        this.getAll();
        this.ecnecMeetingFindByUuid();
    }

    private populateForm(): void {
        if(this.orderType == 'ECNEC-GO' || this.orderType == 'PLANCOM-GO'){
            this.goForm= new FormGroup({
                id: new FormControl(''),
                isDeleted: new FormControl(false),
                uuid: new FormControl(''),
                pcUuid: new FormControl(this.uuid),
                orderType: new FormControl(this.orderType),
                recordNo: new FormControl(''),
                wing: new FormControl(''),
                recordDate: new FormControl(''),
                ecnecMeetingInfo: new FormControl(''),
                ecnecMeetingDate: new FormControl(''),
                projectOtherInfo: new FormControl(''),
            });
        } else if(this.orderType == 'AO'){
            this.aoForm= new FormGroup({
                id: new FormControl(''),
                isDeleted: new FormControl(false),
                uuid: new FormControl(''),
                pcUuid: new FormControl(this.uuid),
                orderType: new FormControl(this.orderType),
                recordNo: new FormControl(''),
                recordDate: new FormControl(''),
                ecnecMeetingInfo: new FormControl(''),
                ecnecMeetingDate: new FormControl(''),
                projectOtherInfo: new FormControl(''),
                seniorAssistantHead: new FormControl(''),
            });
        }

    }

    findByPcUuidAndOrderType(){
        let type = 'AO';
        this.dppTappGoService.findByPcUuid(this.uuid, this.orderType).subscribe(
            res =>{
                if(res){
                    this.dppTappGoObj = res;
                    if(this.orderType == 'ECNEC-GO' || this.orderType == 'PLANCOM-GO'){
                        this.goForm.patchValue(res);
                    } else if(this.orderType == 'AO'){
                        this.aoForm.patchValue(res);
                    }
                }
            },
            err =>{
            }
        );
    }

    saveOrUpdate(){
        if(((this.orderType=='ECNEC-GO' || this.orderType=='PLANCOM-GO') && this.goForm.invalid) || (this.orderType=='AO' && this.aoForm.invalid)){
            this.snackbarHelper.openErrorSnackBarWithMessage("Please fill-up required field ", OK);
            return;
        }
        this.show = true;
        let data = (this.orderType=='ECNEC-GO' || this.orderType=='PLANCOM-GO') ? this.goForm.value: this.orderType=='AO' ? this.aoForm.value : '';
        this.dppTappGoService.createOrUpdate(data).subscribe(
            res=>{
                if(res){
                    this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);

                    this.navigateToDashboard();
                }else{
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.show = false;
            },
            err =>{
                this.snackbarHelper.openErrorSnackBar();
                this.show = false;
            }
        );
    }

    navigateToDashboard() {
        this.show = false;
        this.router.navigate([`dpp-tapp/view-dashboard/${this.uuid}`]);
    }

    getDppCurrentStage(dppMasterId) {
        this.stageMovementService.getCurrentStage(dppMasterId, 'DPP').subscribe(async res => {
            if (res.res) {
                this.approvalDate = res.res.movementTime;
            }
        });
    }

    private getDppObjectiveCostByPcUuid() {
        this.objectiveAndCostService.getObjectiveCostByPcUuid(this.uuid).subscribe(
            res => {
                if (res != null) {
                    this.objectiveCost = res;
                    console.log("objectiveCost =", res);
                    this.getDppCurrentStage(res.id);
                }
            }
        );
    }

    private getAll() {
        this.dppAnnualPhasingCostService.getDetailsEstimatedCost(this.uuid).subscribe(
            res => {
                res.dppAnnualPhasingCostDTOList.forEach(e => {
                    if (e.componentName === DppAnnualPhasingConstant.Revenue_Component) {
                        this.revenueList = e.estimatedCostTabDetailsDTOS;
                        this.revenueTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Capital_Component) {
                        this.capitalList = e.estimatedCostTabDetailsDTOS;
                        this.capitalTotal = e.dppAnnualPhasingCostTotal;
                    } else if (e.componentName === DppAnnualPhasingConstant.Contingency) {
                        this.physicalContingencyTotal = e.estimatedCostTabDetailsDTOS[0];
                        this.priceContingencyTotal = e.estimatedCostTabDetailsDTOS[1];
                    }
                }
            );
            this.grantTotal = res.grandTotalResponses;
        })
    }


    ecnecMeetingFindByUuid() {
        this.assignMeetingService.findByPcUuid(this.uuid).subscribe(
            res=>{
                if(res){
                    this.ecnecMeetingObj = res.ecnecMeeting;

                }
            }
        )
    }

    goBackToHome() {
        window.history.back();
    }


}
