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
import {
    OK,
    SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED,
    SUCCESSFULLY_UPDATED_BN
} from "../../../../../../../core/constants/message";
import {ActivatedRoute, Router} from "@angular/router";
import {setDate} from "ngx-bootstrap/chronos/utils/date-setters";
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from 'app/main/core/constants/editor-config';
import { MatDialog } from '@angular/material/dialog';
import * as moment from "moment";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";

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
    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    conceptUuid = this.route.snapshot.params['id'];
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'important'];
    dataSource = [];
    model: LogFrameModel = new LogFrameModel();
    frmGroup: FormGroup;
    update: boolean;
    uuid: string;
    dppMasterData;
    projectConceptMasterId: number;
    spinner: boolean;
    ckEditorData:any;
    title:any;
    paripatraVersion: string;
    isParipatra2016: boolean ;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private router: Router,
        private snackbarHelper: SnackbarHelper,
        private objectiveAndCostService: DppObjectiveCostService,
        private logFrameService: DppLogFrameService,
        private projectSummaryService: ProjectSummaryService,
        private dppHelperService: DppProjectSummeryHelperService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private numberPipe: NumberPipe,
    ) {
        super();
    }

    /**
     * Initially called this method
     */
    ngOnInit(): void {
        this.inItForm();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.getProjectSummaryMasterId();

    }

    inItForm(){
        this.frmGroup = this.formBuilder.group({
            startDate: [''],
            endDate: [''],
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
                    this.update = true;
                    this.uuid = res.uuid;

                    this.setValueFromLogSummery(res);
                } else {
                    this.update = false;
                    // this.getProjectSummaryMasterId();
                }
                this.spinner = false;
            })
        );
    }
    formControlName="goalOVI"
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

    save() {
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
        this.model.dppMasterId = this.dppHelperService.objectiveCostCreateId;
        this.model.uuid = this.uuid;
        this.spinner = true;
        if (this.dppHelperService.objectiveCostCreateId > 0) {
            if (this.model.plannedDate && this.model.dateOfLogFrame) {
                if (this.update) {
                    this.spinner = true;
                    this.logFrameService.updateLogFrame(this.model, this.conceptUuid).subscribe(
                        res => {
                            this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                            this.getLogFrameByPcid()
                            this.spinner = false;
                        },
                        err =>{
                            this.spinner = false;
                        }
                    );
                } else {
                    this.spinner = true;
                    this.logFrameService.create(this.model).subscribe(
                        res => {
                            if (res.uuid) {
                                this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                                this.getLogFrameByPcid();
                            } else {
                                this.snackbarHelper.openErrorSnackBar();
                            }
                            this.spinner = false;
                        },
                        err =>{
                            this.spinner = false;
                        }
                    );
                }
            }
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessageEnBn("Objectives & cost data is not provided yet!", "উদ্দেশ্য এবং খরচ তথ্য এখনও প্রদান করা হয় নাই!");
            this.spinner = false;
        }
    }


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
        this.model.dppMasterId = this.dppHelperService.objectiveCostCreateId;
        this.model.uuid = this.uuid;
        this.spinner = true;
        if (this.dppHelperService.objectiveCostCreateId > 0) {
            if (this.model.plannedDate && this.model.dateOfLogFrame) {
                if (this.update) {
                    this.spinner = true;
                    this.logFrameService.updateLogFrame(this.model, this.conceptUuid).subscribe(
                        res => {
                            // this.snackbarHelper.openSuccessSnackBar();
                            this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                            this.nextStep.emit(true);
                            this.getLogFrameByPcid()
                            this.spinner = false;
                        },
                        err =>{
                            this.spinner = false;
                        }
                    );
                } else {
                    this.spinner = true;
                    this.logFrameService.create(this.model).subscribe(
                        res => {
                            if (res.uuid) {
                                this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                                this.nextStep.emit(true);
                                this.getLogFrameByPcid();
                            } else {
                                this.nextStep.emit(false);
                                this.snackbarHelper.openErrorSnackBar();
                            }
                            this.spinner = false;
                        },
                        err =>{
                            this.spinner = false;
                        }
                    );
                }
            }
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessageEnBn("Objectives & cost data is not provided yet!", "উদ্দেশ্য এবং খরচ তথ্য এখনও প্রদান করা হয় নাই!");
            this.spinner = false;
        }

        //  this.nextStep.emit(true);
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
        this.model.dppMasterId = this.dppHelperService.objectiveCostCreateId;
        this.model.uuid = this.uuid;
        if (this.dppHelperService.objectiveCostCreateId > 0) {
            if (this.model.plannedDate && this.model.dateOfLogFrame) {
                if (this.update) {
                    this.spinner = true;
                    this.logFrameService.updateLogFrame(this.model, this.conceptUuid).subscribe(res => {
                        // this.snackbarHelper.openSuccessSnackBar();
                        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                        this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                        this.getLogFrameByPcid();
                        this.spinner = false;
                    });
                } else {
                    this.spinner = true;
                    this.logFrameService.create(this.model).subscribe(res => {
                        if (res.uuid) {
                            this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                            this.getLogFrameByPcid();
                        } else {
                            this.nextStep.emit(false);
                            this.snackbarHelper.openErrorSnackBar();
                        }
                        this.spinner = false;
                    });
                }
            }
        } else {
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.snackbarHelper.openWarnSnackBarWithMessage("Objectives & cost data is not provided yet!", "");

        }
    }


    /**
     * Get PC By Uuid
     */
    getProjectSummaryMasterId() {
        this.spinner = true;
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) => {

            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
            this.projectConceptMasterId = res.id;
            this.setProjectConceptData(res)
            this.getLogFrameByPcid();
            this.getCompletionDate(res);
            this.spinner = false;
        })
    }

    private setProjectConceptData(res) {
        this.frmGroup.patchValue({
            goalOVI: (res.projectTypeDTO.nameEn.toLowerCase() === 'tapp' || res.isForeignAid === true) ? res.objectivesEn ? res.objectivesEn : "" : res.objectivesBn ? res.objectivesBn : "",
            objectiveNS: (res.projectTypeDTO.nameEn.toLowerCase() === 'dpp' && !res.isForeignAid) ? res.objectivesBn:res.objectivesEn,
        });
    }

    /**
     * Set Value From Project Summery
     * @param res
     */
    setDate(res: any) {
        this.frmGroup.patchValue({
            plannedDate: res.dateCommencement.toString(),
            dateOfLogFrame: res.dateCompletion.toString(),

            startDate: this.numberPipe.convertToBanglaNumber(moment(res.dateCommencement.toString()).format('DD-MM-YYYY')),
            endDate: this.numberPipe.convertToBanglaNumber(moment(res.dateCompletion.toString()).format('DD-MM-YYYY')),
        })
    }

    /**
     * Set Value From Project Summery
     * @param res
     */
    setPcDate(pc: any) {
        this.frmGroup.patchValue({
            plannedDate: pc.expCommencementDate.toString(),
            dateOfLogFrame: pc.expCompletionDate.toString(),

            startDate: this.numberPipe.convertToBanglaNumber(moment(pc.expCommencementDate.toString()).format('DD-MM-YYYY')),
            endDate: this.numberPipe.convertToBanglaNumber(moment(pc.expCompletionDate.toString()).format('DD-MM-YYYY')),
        })
    }

    // setDate(pc, dpp) {
    //     if (dpp.uuid != null) {
    //         this.frmGroup.patchValue({
    //             plannedDate: this.numberPipe.convertToBanglaNumber(moment(dpp.dateCommencement.toString()).format('DD-MM-YYYY')),
    //             dateOfLogFrame: this.numberPipe.convertToBanglaNumber(moment(dpp.dateCompletion.toString()).format('DD-MM-YYYY')),
    //         })
    //     } else {
    //         this.frmGroup.patchValue({
    //             plannedDate: this.numberPipe.convertToBanglaNumber(moment(pc.expCommencementDate.toString()).format('DD-MM-YYYY')),
    //             dateOfLogFrame: this.numberPipe.convertToBanglaNumber(moment(pc.expCompletionDate.toString()).format('DD-MM-YYYY')),
    //         })
    //     }
    // }

    getCompletionDate(pc) {
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            this.dppMasterData = res.uuid;
            if (res.uuid != null) {
                this.setDate(res)
                // this.setDate(pc, response.res);
            } else {
                this.setPcDate(pc);
            }

        })
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
