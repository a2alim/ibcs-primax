import {Component, OnInit, Output, EventEmitter} from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {DppProjectManagementModel} from '../../../../../models/dppProjectManagement.model';
import {DppProjectManagementService} from '../../../../../services/dpp-project-management.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DppProjectSummeryHelperService} from "../../../../../services/dpp-project-summery-helper.service";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {OK, SUCCESSFULLY_UPDATED} from "../../../../../../../core/constants/message";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import { UtilsService } from 'app/main/core/services/utils.service';
import {MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";


/*----/Lng Translation----*/
@Component({
    selector: 'app-project-management',
    templateUrl: './project-management.component.html',
    styleUrls: ['./project-management.component.scss']
})
export class ProjectManagementComponent extends UnsubscribeAdapterComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();

    content = '';
    frmGroup: FormGroup;
    implementationArrangement: any;
    revenueBudget: any;
    isShowImplArrangement: boolean = false;
    isShowRevenueBudget: boolean = false;
    isEnglish = true;
    i18nValue;
    update: boolean;
    uuid: string;
    dppMasterUuid;
    conceptUuid: string;
    pcMasterId: number;
    spinner: boolean;
    model: DppProjectManagementModel = new DppProjectManagementModel();
    minEditorConfig = MIN_EDITOR_CONFIG;


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private fb: FormBuilder,
                private projectManagementService: DppProjectManagementService,
                private route: Router,
                private objectiveAndCostService: DppObjectiveCostService,
                private snackbarHelper: SnackbarHelper,
                private dppHelperService: DppProjectSummeryHelperService,
                private router: ActivatedRoute,
                private utilsService: UtilsService,
                private projectSummaryService: ProjectSummaryService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla)

        console.log(this._fuseTranslationLoaderService.getActiveLang());
        if (this.isEnglish) {
            this.i18nValue = lngEnglish.data;
        } else {
            this.i18nValue = lngBangla.data;
        }

    }

    /**
     * Initially called this method
     */
    ngOnInit(): void {
        this.frmGroup = this.fb.group({
            implementationArrangement: ['', Validators.required],
            revenueBudget: ['', Validators.required]
        })
        this.conceptUuid = this.router.snapshot.params['id'];
        this.getProjectManagementByPcUuid();
        this.getProjectSummaryMasterId();
    }

    /**
     * Get Project Management By Pcid
     */
    private getProjectManagementByPcUuid() {
        this.subscribe$.add(
            this.projectManagementService.getByProjectConceptUuid(this.conceptUuid).subscribe((res) => {
                if (res) {
                    this.update = true;
                    this.uuid = res.uuid;
                    this.setValue(res);
                } else {
                    this.update = false;
                }
            })
        );
    }

    /**
     * Set Value
     * @param res
     */
    setValue(res: any) {
        this.frmGroup.patchValue({
            implementationArrangement: res.implementationArrangement,
            revenueBudget: res.revenueBudget
        })

    }

    navigateToList(nextVal) {
        if (nextVal == 'next') {
            this.nextStep.emit(true);
        }
        if (nextVal == 'list') {
            this.route.navigate(['rdpp-rtapp/dashboard/' + this.conceptUuid]);
        }
    }

    /**
     * Save data in DB
     */
    onSubmit(nextVal) {
        console.log(this.dppHelperService.objectiveCostCreateId);
        this.spinner = true;
        if (this.dppHelperService.objectiveCostCreateId > 0) {
            if (this.frmGroup.valid) {
                this.saveData(nextVal);
                this.spinner = false;
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage("Fillup all required field", "Ok");
            }
            this.spinner = false;
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Objectives & cost data is not provided yet!", "");
            this.spinner = false;
        }
    }

    saveData(nextVal) {
        this.spinner = true;
        if (this.frmGroup.valid) {
            this.model.implementationArrangement = this.frmGroup.value.implementationArrangement;
            this.model.revenueBudget = this.frmGroup.value.revenueBudget;
            this.model.projectConceptMasterId = this.pcMasterId;
            this.model.dppMasterId = this.dppHelperService.objectiveCostCreateId;
            this.model.projectConceptUuid = this.conceptUuid;
            this.model.uuid = this.uuid;
            if (this.update) {

                this.projectManagementService.updateProjectConcept(this.model, this.conceptUuid).subscribe(res => {
                    if (res.uuid) {
                        this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                        this.spinner = false;
                        this.navigateToList(nextVal);
                        this.route.navigate(['rdpp-rtapp/dashboard/' + this.conceptUuid]);
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                    this.spinner = false;
                });
            } else {
                this.projectManagementService.create(this.model).subscribe(res => {
                    if (res.uuid) {
                        this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                        this.spinner = false;
                        this.navigateToList(nextVal);
                        this.route.navigate(['rdpp-rtapp/dashboard/' + this.conceptUuid]);
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                    this.spinner = false;
                });
            }
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessage("Value is Required", "Error");
        }


    }

    /**
     * get pcMaster id
     */
    getProjectSummaryMasterId() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {

            this.pcMasterId = res.id;
        })
    }

    /**
     * CK Editor expand Collapse
     */
    expand(i: number) {
        if (i === 1) {
            this.isShowImplArrangement = true;
        } else if (i === 2) {
            this.isShowRevenueBudget = true;
        }
    }

    collapse(i: number) {
        if (i === 1) {
            this.isShowImplArrangement = false;
        } else if (i === 2) {
            this.isShowRevenueBudget = false;
        }
    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
    }


}
