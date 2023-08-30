import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TappLogFrameModel} from '../../../../../models/tappLogFrame.model';
import {TappLogFrameService} from '../../../../../services/tapp-log-frame.service';
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {TappObjectiveCostService} from "../../../../../services/tapp-objective-cost.service";
import {TappProjectSummeryHelperService} from '../../../../../services/tapp-project-summery-helper.service';
import { MatDialog } from '@angular/material/dialog';
import {MEDIUM_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";
import * as moment from "moment/moment";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";

/*----/Lng Translation----*/
@Component({
    selector: 'app-tpp-log-frame',
    templateUrl: './tpp-log-frame.component.html',
    styleUrls: ['./tpp-log-frame.component.scss']
})
export class TppLogFrameComponent implements OnInit {
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    @ViewChild('logFrameCkEditor') logFrameCkEditor: TemplateRef<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    conceptUuid = this.route.snapshot.params['id'];
    pcMasterId : number;
    uuid: string;
    id: number;
    tappMasterUuid;
    tappMasterId: number;
    frmGroup: FormGroup;
    model: TappLogFrameModel = new TappLogFrameModel();
    spinner: boolean;
    title:any;
    ckEditorData:any;
    paripatraVersion: string;
    isParipatra2016: boolean;
    isForeignAid: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private router : Router,
                private  tappObjectiveCostService: TappObjectiveCostService,
                private tappProjectSummeryHelperService: TappProjectSummeryHelperService,
                private snackbar : SnackbarHelper,
                private pcService : ProjectSummaryService,
                private route : ActivatedRoute,
                private dialog: MatDialog,
                private tappLogFrameService: TappLogFrameService,
                private numberPipe: NumberPipe,) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    /**
     * When component initialize initially this method is called
     */
    ngOnInit(): void {
        this.tappMasterUuid = this.tappProjectSummeryHelperService.objectiveCostUuid;
        this.tappMasterId = this.tappProjectSummeryHelperService.objectiveCostCreateId;
        this.getTappMasterData();
        this.frmGroup = this.formBuilder.group({
            plannedDate: [''],
            dateOfLogFrame: [''],
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

    ngAfterViewInit(){
        this.tappMasterUuid = this.tappProjectSummeryHelperService.objectiveCostUuid;
        this.tappMasterId = this.tappProjectSummeryHelperService.objectiveCostCreateId;
    };

    /**
     * Get Project Concept Data
     */
    getPcMasterId(tapp){
        this.pcService.getByUuid(this.conceptUuid).subscribe((res)=>{
            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
            this.isForeignAid = res.isForeignAid;
            this.pcMasterId = res.id;
            this.getTappLogFrame();
            this.setDate(res, tapp);
        })
    }

    private getTappMasterData(){
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) =>{
            let res = response.res;
            this.tappMasterUuid = res.uuid;
            this.getPcMasterId(res);
        })
    }

    /**
     * Get Project Concept Data
     */
    getTappLogFrame(){
        this.tappLogFrameService.getTappLogFrame(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
            this.tappMasterId = res.tappMasterId;
            this.id = res.id;
            this.uuid = res.uuid;
            this.setLogFrameData(res);
        })
    }

    setDate(pc, tapp) {
        if (tapp.uuid != null) {
            this.frmGroup.patchValue({
                plannedDate: this.numberPipe.convertToBanglaNumber(moment(tapp.dateCommencement.toString()).format('DD-MM-YYYY')),
                dateOfLogFrame: this.numberPipe.convertToBanglaNumber(moment(tapp.dateCompletion.toString()).format('DD-MM-YYYY')),
            })
        } else {
            this.frmGroup.patchValue({
                plannedDate: this.numberPipe.convertToBanglaNumber(moment(pc.expCommencementDate.toString()).format('DD-MM-YYYY')),
                dateOfLogFrame: this.numberPipe.convertToBanglaNumber(moment(pc.expCompletionDate.toString()).format('DD-MM-YYYY')),
            })
        }
    }

    getTappId(callBack) {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) => {
            this.tappMasterUuid = response.res.uuid;
            this.tappMasterId = response.res.id;
            callBack(true);
        });
    }

    /**
     * Save data in DB
     */
    saveAndNext(nextVal) {
        this.getTappId(()=>{
            this.spinner = true;
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
            this.model.pcMasterId = this.pcMasterId;
            this.model.pcUuid = this.conceptUuid;
            this.model.id = this.id;
            this.model.uuid = this.uuid;
            this.model.tappMasterId = this.tappMasterId;

            if(this.tappMasterUuid != null){
                if(this.uuid == null){
                    if(this.frmGroup.valid){
                        this.tappLogFrameService.create(this.model).subscribe(res => {
                            this.snackbar.openSuccessSnackBar();
                            this.getTappLogFrame();
                            //this.gotNextPage();
                            this.navigateToList(nextVal);
                            this.spinner = false;
                        });
                    }else {
                        this.spinner = false;
                        this.nextStep.emit(false);
                        this.snackbar.openErrorSnackBarWithMessage("Please Fillup All Required Field", "Error")
                    }

                }else {
                    if(this.frmGroup.valid){
                        this.tappLogFrameService.updateTappLogFrame(this.model, this.conceptUuid).subscribe((res)=>{
                            this.spinner = false;
                            this.snackbar.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok")
                            this.getTappLogFrame();
                            //this.gotNextPage();
                            this.navigateToList(nextVal);
                        })
                    }else {
                        this.spinner = false;
                        this.nextStep.emit(false);
                        this.snackbar.openErrorSnackBarWithMessage("Please Fillup All Required Field", "Error")
                    }

                }
            }else {
                this.spinner = false;
                this.snackbar.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
            }
        });
    }

    gotNextPage(){
        this.nextStep.emit(true);
    }

    navigateToList(nextVal) {

        if(nextVal == 'next')
        {
            this.nextStep.emit(true);
        }
        if(nextVal == 'list')
        {
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
        }
    }

    saveAndExit(nextVal){
        this.getTappId(()=>{
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
            this.model.pcMasterId = this.pcMasterId;
            this.model.pcUuid = this.conceptUuid;
            this.model.id = this.id;
            this.model.uuid = this.uuid;
            this.model.tappMasterId = this.tappMasterId;
            if(this.tappMasterUuid != null){
                if(this.uuid == null){
                    if(this.frmGroup.valid){
                        this.tappLogFrameService.create(this.model).subscribe(res => {
                            this.snackbar.openSuccessSnackBar();
                            this.getTappLogFrame();
                            this.navigateToList(nextVal);
                            //this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                        });
                    }else {
                        this.nextStep.emit(false);
                        this.snackbar.openErrorSnackBarWithMessage("Please Fillup All Required Field", "Error")
                    }

                }else {
                    if(this.frmGroup.valid){
                        this.tappLogFrameService.updateTappLogFrame(this.model, this.conceptUuid).subscribe((res)=>{
                            this.snackbar.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok")
                            this.navigateToList(nextVal);
                            //this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                        })
                    }else {
                        this.nextStep.emit(false);
                        this.snackbar.openErrorSnackBarWithMessage("Please Fillup All Required Field", "Error")
                    }
                }
            }else {
                this.spinner = false;
                this.snackbar.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
            }
        });
    }

    setLogFrameData(res: any){
        this.frmGroup.patchValue({
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

    protected readonly isFinite = isFinite;
}
