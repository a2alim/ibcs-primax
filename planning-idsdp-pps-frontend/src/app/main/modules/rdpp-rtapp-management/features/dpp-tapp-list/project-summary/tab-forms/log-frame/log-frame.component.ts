import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LogFrameModel} from '../../../../../models/logFrame.model';
import {DppLogFrameService} from '../../../../../services/dpp-log-frame.service';
import {DppProjectSummeryHelperService} from "../../../../../services/dpp-project-summery-helper.service";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {OK, SUCCESSFULLY_UPDATED} from "../../../../../../../core/constants/message";
import {ActivatedRoute, Router} from "@angular/router";
import {setDate} from "ngx-bootstrap/chronos/utils/date-setters";
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import {RdppLogFrameService} from "../../../../../services/rdpp-log-frame.service";
import {RdppObjectiveCostService} from "../../../../../services/rdpp-objective-cost.service";
import {DppObjectiveCostModel} from "../../../../../models/dppObjectiveCost.model";
import { MatDialog } from '@angular/material/dialog';

/*----/Lng Translation----*/
@Component({
    selector: 'app-log-frame',
    templateUrl: './log-frame.component.html',
    styleUrls: ['./log-frame.component.scss']
})
export class LogFrameComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild('logFrameCkEditor') logFrameCkEditor: TemplateRef<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPreviousPage = new EventEmitter<boolean>();
    conceptUuid: string;
    rdppMasterId: number;
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'important'];
    dataSource = [];
    model: LogFrameModel = new LogFrameModel();
    frmGroup: FormGroup;
    rdppMasterData : DppObjectiveCostModel;
    update: boolean = false;
    uuid: string;
    dppMasterData;
    projectConceptMasterId: number;
    spinner: boolean;
    referenceId: number;
    title: any;
    ckEditorData: any;
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private router: Router,
                private snackbarHelper: SnackbarHelper,
                private objectiveAndCostService: DppObjectiveCostService,
                private logFrameService: DppLogFrameService,
                private rdppLogFrameService: RdppLogFrameService,
                private projectSummaryService: ProjectSummaryService,
                private dialog: MatDialog,
                private dppHelperService: DppProjectSummeryHelperService,
                private rdppMasterService : RdppObjectiveCostService,
                private route: ActivatedRoute) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    /**
     * Initially called this method
     */
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
            this.getRdppMasterData(params['id']);
        });
        this.initForm();
        this.getLogFrameByRdppMasterId();
        this.getProjectSummaryMasterId();
    }

    getRdppMasterData(masterId){
        this.rdppMasterService.getObjectiveCostByRdppMasterId(masterId).subscribe(res =>{
            this.rdppMasterData = res;
        })
    }

    initForm(): any {
        this.frmGroup = this.formBuilder.group({
            plannedDate: [''],
            dateOfLogFrame: ['', Validators.required],
            goalNS: [''],
            goalOVI: [''],
            goalMOV: [''],
            objectiveNS: [''],
            objectiveOVI: [''],
            objectiveMOV: [''],
            objectiveIA: [''],
            outputNS: [''],
            outputOVI: [''],
            outputMOV: [''],
            outputIA: [''],
            inputNS: [''],
            inputOVI: [''],
            inputMOV: [''],
            inputIA: ['']

        });
    }

    /**
     * Get Log Frame By Pcid
     */
    private getLogFrameByPcid() {
        this.spinner = true;
        this.subscribe$.add(
            this.logFrameService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
                let res = response.res;
                if (res) {
                    this.setValueFromLogSummery(res);
                }
                this.spinner = false;
            })
        );
    }

    // set data from DB
    setValueFromLogSummery(res: any) {
        this.frmGroup.patchValue({
            dateOfLogFrame: res.dateOfLogFrame,
            goalNS: res.goalNS,
            goalOVI: res.goalOVI,
            goalMOV: res.goalMOV,
            objectiveNS: res.objectiveNS,
            objectiveOVI: res.objectiveOVI,
            objectiveMOV: res.objectiveMOV,
            objectiveIA: res.objectiveIA,
            outputNS: res.outputNS,
            outputOVI: res.outputOVI,
            outputMOV: res.outputMOV,
            outputIA: res.outputIA,
            inputNS: res.inputNS,
            inputOVI: res.inputOVI,
            inputMOV: res.inputMOV,
            inputIA: res.inputIA
        });
    }


    /**
     * Save data in DB
     */
    saveAndNext() {
        this.model.plannedDate = this.frmGroup.value.plannedDate;
        this.model.dateOfLogFrame = this.frmGroup.value.dateOfLogFrame;
        this.model.goalNS = this.frmGroup.value.goalNS;
        this.model.goalOVI = this.frmGroup.value.goalOVI;
        this.model.goalMOV = this.frmGroup.value.goalMOV;
        this.model.objectiveNS = this.frmGroup.value.objectiveNS;
        this.model.objectiveOVI = this.frmGroup.value.objectiveOVI;
        this.model.objectiveMOV = this.frmGroup.value.objectiveMOV;
        this.model.objectiveIA = this.frmGroup.value.objectiveIA;
        this.model.outputNS = this.frmGroup.value.outputNS;
        this.model.outputOVI = this.frmGroup.value.outputOVI;
        this.model.outputMOV = this.frmGroup.value.outputMOV;
        this.model.outputIA = this.frmGroup.value.outputIA;
        this.model.inputNS = this.frmGroup.value.inputNS;
        this.model.inputOVI = this.frmGroup.value.inputOVI;
        this.model.inputMOV = this.frmGroup.value.inputMOV;
        this.model.inputIA = this.frmGroup.value.inputIA;
        this.model.projectConceptMasterId = this.projectConceptMasterId;
        this.model.projectConceptUuid = this.conceptUuid;
        this.model.rdppMasterId = this.rdppMasterId;
        this.model.uuid = this.uuid;
        this.spinner = true;
        if (this.model.plannedDate && this.model.dateOfLogFrame) {
            if (this.update) {
                this.spinner = true;
                this.rdppLogFrameService.updateLogFrame(this.model, this.rdppMasterId).subscribe(res => {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.nextStep.emit(true);
                    this.getLogFrameByRdppMasterId();
                    this.spinner = false;
                });
            } else {
                this.spinner = true;
                this.rdppLogFrameService.create(this.model).subscribe(res => {
                    if (res) {
                        this.snackbarHelper.openSuccessSnackBar();
                        this.nextStep.emit(true);
                        this.getLogFrameByRdppMasterId();
                    } else {
                        this.nextStep.emit(false);
                        this.snackbarHelper.openErrorSnackBar();
                    }
                    this.spinner = false;
                });
            }
        }
    }

    saveAndExit() {
        this.model.plannedDate = this.frmGroup.value.plannedDate;
        this.model.dateOfLogFrame = this.frmGroup.value.dateOfLogFrame;
        this.model.goalNS = this.frmGroup.value.goalNS;
        this.model.goalOVI = this.frmGroup.value.goalOVI;
        this.model.goalMOV = this.frmGroup.value.goalMOV;
        this.model.objectiveNS = this.frmGroup.value.objectiveNS;
        this.model.objectiveOVI = this.frmGroup.value.objectiveOVI;
        this.model.objectiveMOV = this.frmGroup.value.objectiveMOV;
        this.model.objectiveIA = this.frmGroup.value.objectiveIA;
        this.model.outputNS = this.frmGroup.value.outputNS;
        this.model.outputOVI = this.frmGroup.value.outputOVI;
        this.model.outputMOV = this.frmGroup.value.outputMOV;
        this.model.outputIA = this.frmGroup.value.outputIA;
        this.model.inputNS = this.frmGroup.value.inputNS;
        this.model.inputOVI = this.frmGroup.value.inputOVI;
        this.model.inputMOV = this.frmGroup.value.inputMOV;
        this.model.inputIA = this.frmGroup.value.inputIA;
        this.model.projectConceptMasterId = this.projectConceptMasterId;
        this.model.projectConceptUuid = this.conceptUuid;
        this.model.rdppMasterId = this.rdppMasterId;
        this.model.uuid = this.uuid;
            if (this.model.plannedDate && this.model.dateOfLogFrame) {
                if (this.update) {
                    this.spinner = true;
                    this.rdppLogFrameService.updateLogFrame(this.model, this.rdppMasterId).subscribe(res => {
                        this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                        this.navigateToDashboard();
                        this.getLogFrameByRdppMasterId();
                        this.spinner = false;
                    });
                } else {
                    this.spinner = true;
                    this.rdppLogFrameService.create(this.model).subscribe(res => {
                        if (res) {
                            this.snackbarHelper.openSuccessSnackBar();
                            this.navigateToDashboard();
                            this.getLogFrameByRdppMasterId();
                        } else {
                            this.nextStep.emit(false);
                            this.snackbarHelper.openErrorSnackBar();
                        }
                        this.spinner = false;
                    });
                }
            }
    }


    /**
     * Get PC By Uuid
     */
    getProjectSummaryMasterId() {
        this.spinner = true;
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) => {
            this.projectConceptMasterId = res.id;
            this.getCompletionDate();
            this.spinner = false;
        })
    }


    getLogFrameByRdppMasterId(): any {
        this.rdppLogFrameService.getByRdppId(this.rdppMasterId).subscribe(response => {

                if (response == null && this.rdppMasterData.revisedVersion == '1st Revised') {
                    this.getLogFrameByPcid();
                } else if (response == null) {
                    this.getReveisedData();
                } else if (response.res == '') {
                    this.getReveisedData();
                } else {
                    this.update = true;
                    this.uuid = response.res.uuid;
                    this.setValueFromLogSummery(response.res);
                    this.getCompletionDate();
                    this.spinner = false;
                }
            }
        )
    }

    getReveisedData(){
        if(this.referenceId != null){
        this.rdppLogFrameService.getByRdppId(this.rdppMasterData.referenceId).subscribe(res =>{
            this.setValueFromLogSummery(res.res);
            this.frmGroup.patchValue({
                plannedDate: this.rdppMasterData.dateCompletion.toString()
            })
        })
    }
    }

    /**
     * Get PC By Uuid
     */
    getPCCompletionDate() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) => {
            console.log("date ", res);
            this.setPcDate(res);
        })
    }

    /**
     * Set Value From Project Summery
     * @param res
     */
    setDate(res: any) {
        this.frmGroup.patchValue({
            plannedDate: res.dateCompletion.toString()
        })
    }

    /**
     * Set Value From Project Summery
     * @param res
     */
    setPcDate(res: any) {
        this.frmGroup.patchValue({
            plannedDate: res.expCompletionDate.toString()
        })
    }

    getCompletionDate() {
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            this.dppMasterData = res.uuid;
            if (res.uuid != null) {
                this.setDate(res)
            } else {
                this.getPCCompletionDate();
            }
        })
    }

    navigateToDashboard(): any {
        this.router.navigate(['rdpp-rtapp/dashboard'], {queryParams: {pcUuid: this.conceptUuid, id: this.rdppMasterId}});
    }

    navigateToAnnexureI(): any {
        this.router.navigate(['rdpp-rtapp/location-wise-cost-breakdown'], {queryParams: {pcUuid: this.conceptUuid, id: this.rdppMasterId}});
    }

    navigateToAnnexureIIIa(): any {
        this.router.navigate(['rdpp-rtapp/add-annexuregoods'], {queryParams: {pcUuid: this.conceptUuid, id: this.rdppMasterId}});
    }

    navigateToAnnexureIIIb(): any {
        this.router.navigate(['rdpp-rtapp/add-annexurewokrs'], {queryParams: {pcUuid: this.conceptUuid, id: this.rdppMasterId}});
    }

    navigateToAnnexureIIIc(): any {
        this.router.navigate(['rdpp-rtapp/add-annexureservices'], {queryParams: {pcUuid: this.conceptUuid, id: this.rdppMasterId}});
    }

    navigateToAnnexureII(): any {
        this.router.navigate(['rdpp-rtapp/year-wise-fin-plan'], {queryParams: {pcUuid: this.conceptUuid, id: this.rdppMasterId}});
    }

    navigateToDPP(): any {
        this.router.navigate([`dpp-tapp/view-dashboard/${this.conceptUuid}`]);
    }

    openDialog(formControlName, title) {
        this.title = title;
        this.ckEditorData = this.frmGroup.get(formControlName).value;
        const dialogRef = this.dialog.open(this.logFrameCkEditor, {
            height: '32vw',
            width: '70vw',
            position: {
                top: '7vh',
                left: '19vw'
            },
        });
        dialogRef.afterClosed().subscribe(
            res => {
                if(res){
                    this.frmGroup.get(formControlName).patchValue(this.ckEditorData);
                    this.ckEditorData = null;
                }
                this.dialog.closeAll();
            }
        );
    }

}
