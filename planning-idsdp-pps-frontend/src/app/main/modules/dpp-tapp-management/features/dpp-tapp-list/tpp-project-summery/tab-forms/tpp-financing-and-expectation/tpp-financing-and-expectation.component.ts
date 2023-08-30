import {Component, EventEmitter, OnInit, Output} from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TappFinancingAndExpectationModel} from '../../../../../models/tappFinancingAndExpectation.model';
import {TappFinancingAndExpectationService} from '../../../../../services/tapp-financing-and-expectation.service';
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {GlobalValidationService} from "../../../../../../../../global/validation/global-validation.service";
import {TappObjectiveCostService} from "../../../../../services/tapp-objective-cost.service";
import {TappProjectSummeryHelperService} from '../../../../../services/tapp-project-summery-helper.service';
import { UtilsService } from 'app/main/core/services/utils.service';
import {MEDIUM_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";

/*----/Lng Translation----*/
@Component({
    selector: 'app-tpp-financing-and-expectation',
    templateUrl: './tpp-financing-and-expectation.component.html',
    styleUrls: ['./tpp-financing-and-expectation.component.scss']
})
export class TppFinancingAndExpectationComponent implements OnInit {
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    @Output() nextStep = new EventEmitter<boolean>();
    frmGroup: FormGroup;
    pcMasterId: number;
    fUuid: string;
    fId: number;
    tappMasterUuid;
    editor1 = true;
    editor2 = true;
    model: TappFinancingAndExpectationModel = new TappFinancingAndExpectationModel();
    conceptUuid = this.router.snapshot.params['id'];

    spinner: boolean;

    content = '';
    paripatraVersion: string;
    isParipatra2016: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private route: Router,
                private validation: GlobalValidationService,
                private snackbar: SnackbarHelper,
                private pcService: ProjectSummaryService,
                private router: ActivatedRoute,
                private tappObjectiveCostService: TappObjectiveCostService,
                private tappFinancingAndExpectationService: TappFinancingAndExpectationService,
                private utilsService: UtilsService,
                private tappProjectSummeryHelperService: TappProjectSummeryHelperService) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    /**
     * When component initialize initially this method is called
     */
    ngOnInit(): void {
        this.tappMasterUuid = this.tappProjectSummeryHelperService.objectiveCostUuid;
        // this.tappMasterId = this.tappProjectSummeryHelperService.objectiveCostCreateId;
        this.loadFormValue();
        this.getTappMasterData();


    }

    loadFormValue() {
        this.frmGroup = this.formBuilder.group({
            requiredAmount: ['',
                [
                    Validators.required,

                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')

                ]
            ],
            sourceFinancing: ['',
                [
                    Validators.required,
                ]
            ],
            modeFinancing: [''],
            outcome: ['']
        });
    }


    toggleShow1 = () => this.editor1 = this.editor1 = !this.editor1;

    toggleShow2 = () => this.editor2 = this.editor2 = !this.editor2;

    getPcMasterId() {
        this.pcService.getByUuid(this.conceptUuid).subscribe((res) => {
            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
            this.pcMasterId = res.id;
            this.getFinancingExpectation();
        })
    }

    private getTappMasterData() {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            this.tappMasterUuid = res.uuid;
            this.getPcMasterId();
        })
    }

    getFinancingExpectation() {
        this.tappFinancingAndExpectationService.getFinancingExpectation(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            this.fUuid = res.uuid;
            this.fId = res.id;
            this.frmGroup = this.formBuilder.group({
                requiredAmount: res.requiredAmount,
                sourceFinancing: res.sourceFinancing,
                modeFinancing: res.modeFinancing,
                outcome: res.outcome

            });
        })
    }

    gotNextPage() {
        this.nextStep.emit(true);
    }

    getTappId(callBack) {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) => {
            this.tappMasterUuid = response.res.uuid;
            callBack(true);
        });
    }

    /**
     * Save data in DB
     */
    saveAndNext(nextVal) {
        this.getTappId(()=>{
            this.spinner = true;
            this.model.requiredAmount = this.frmGroup.value.requiredAmount;
            this.model.sourceFinancing = this.frmGroup.value.sourceFinancing;
            this.model.modeFinancing = this.frmGroup.value.modeFinancing;
            this.model.outcome = this.frmGroup.value.outcome;
            this.model.pcMasterId = this.pcMasterId;
            this.model.pcUuid = this.conceptUuid;
            this.model.id = this.fId;
            this.model.uuid = this.fUuid;
            if (this.tappMasterUuid != null) {
                if (this.frmGroup.valid) {
                    if (this.fUuid == null) {
                        this.spinner = true;
                        this.tappFinancingAndExpectationService.createFinancingExpectation(this.model).subscribe(res => {
                            this.snackbar.openSuccessSnackBar();
                            this.spinner = false;
                            if (nextVal == 'exit') {
                                this.route.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                            }
                        });
                    } else {
                        this.spinner = true;
                        this.tappFinancingAndExpectationService.updateFinancingExpectation(this.model, this.conceptUuid).subscribe((res) => {
                            this.snackbar.openSuccessSnackBarWithMessage("Successfully Update Data", "Ok")
                            this.spinner = false;
                            if (nextVal == 'exit') {
                                this.route.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                            }
                        })
                    }
                } else {
                    this.snackbar.openErrorSnackBar();
                    this.spinner = false;
                }
            } else {
                this.spinner = false;
                this.snackbar.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
            }
        });
    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
    }

}
