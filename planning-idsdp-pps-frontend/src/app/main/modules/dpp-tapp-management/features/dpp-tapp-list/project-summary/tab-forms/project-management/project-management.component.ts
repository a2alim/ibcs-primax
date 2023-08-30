import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
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
import {SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN} from "../../../../../../../core/constants/message";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import {UtilsService} from 'app/main/core/services/utils.service';
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";


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
    revenueBudget2: any;
    isShowImplArrangement: boolean = true;
    isShowRevenueBudget: boolean = true;
    isEnglish = true;
    i18nValue;
    update: boolean;
    uuid: string;
    dppMasterUuid;
    conceptUuid: string;
    pcMasterId: number;
    spinner: boolean;
    paripatraVersion: string;
    isParipatra2016: boolean;
    model: DppProjectManagementModel = new DppProjectManagementModel();
    minEditor = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    isForeignAid: boolean;

    isTransferableToRevenueBudget: boolean | null = null;
    expandedSection: number | null = null;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private fb: FormBuilder,
                private projectManagementService: DppProjectManagementService,
                private route: Router,
                private objectiveAndCostService: DppObjectiveCostService,
                private snackbarHelper: SnackbarHelper,
                private dppHelperService: DppProjectSummeryHelperService,
                private router: ActivatedRoute,
                private utilsService: UtilsService,
                private projectSummaryService: ProjectSummaryService,
                private cdr: ChangeDetectorRef,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla)

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
            revenueBudget: [''],
            revenueBudget2: ['']
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
                    this.isTransferableToRevenueBudget = res.isTransferableToRevenueBudget;
                    this.setValue(res);
                    this.chooseOption(this.isTransferableToRevenueBudget);
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
            revenueBudget: res.revenueBudget,
            revenueBudget2: res.revenueBudget2
        })

    }

    navigateToList(nextVal) {
        if (nextVal == 'next') {
            this.nextStep.emit(true);
        }
        if (nextVal == 'list') {
            this.route.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
        }
    }

    /**
     * Save data in DB
     */
    onSubmit(nextVal) {
        this.spinner = true;
        if (this.dppHelperService.objectiveCostCreateId > 0) {
            if (this.frmGroup.valid) {
                this.saveData(nextVal);
                this.spinner = false;
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessageEnBn("Fillup all required field", "সমস্ত প্রয়োজনীয় তথ্য প্রদান করুন");
            }
            this.spinner = false;
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Objectives & cost data is not provided yet!", "উদ্দেশ্য ও ব্যয় এর তথ্য এখনো প্রদান করা হয় নাই");
            this.spinner = false;
        }
    }

    saveData(nextVal) {
        this.spinner = true;
        if (this.frmGroup.valid) {
            this.model.implementationArrangement = this.frmGroup.value.implementationArrangement;
            this.model.revenueBudget = this.frmGroup.value.revenueBudget;
            this.model.revenueBudget2 = this.frmGroup.value.revenueBudget2;
            this.model.projectConceptMasterId = this.pcMasterId;
            this.model.dppMasterId = this.dppHelperService.objectiveCostCreateId;
            this.model.projectConceptUuid = this.conceptUuid;
            this.model.uuid = this.uuid;
            this.model.isTransferableToRevenueBudget = this.isTransferableToRevenueBudget;
            if (this.update) {

                this.projectManagementService.updateProjectConcept(this.model, this.conceptUuid).subscribe(res => {
                    if (res.uuid) {
                        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                        this.spinner = false;
                        this.navigateToList(nextVal);
                        this.route.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                    this.spinner = false;
                });
            } else {
                this.projectManagementService.create(this.model).subscribe(res => {
                    if (res.uuid) {
                        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                        this.spinner = false;
                        this.navigateToList(nextVal);
                        this.route.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
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
            this.isForeignAid = res?.isForeignAid;
            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
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

    chooseOption(isTransferableToRevenueBudget: boolean): void {
        this.isTransferableToRevenueBudget = isTransferableToRevenueBudget;
        this.expandedSection = null; // Reset expandedSection when changing the YES/NO option

        if (isTransferableToRevenueBudget) {
            this.toggleExpandCollapse(1);
            this.isExpanded(1);
            this.frmGroup.patchValue({
                revenueBudget2: ""
            });
        } else {
            this.toggleExpandCollapse(2);
            this.isExpanded(2);
            this.frmGroup.patchValue({
                revenueBudget: ""
            });
        }

        // Manually trigger change detection to reflect the UI updates
        this.cdr.detectChanges();
    }

    toggleExpandCollapse(section: number): void {
        if (this.expandedSection === section) {
            this.expandedSection = null; // Collapse the section if it's already expanded
        } else {
            this.expandedSection = section; // Expand the section
        }
    }

    isExpanded(section: number): boolean {
        return this.isTransferableToRevenueBudget != null
            && this.expandedSection === section
            && ((section === 1 && this.isTransferableToRevenueBudget) || (section === 2 && !this.isTransferableToRevenueBudget));
    }
}
