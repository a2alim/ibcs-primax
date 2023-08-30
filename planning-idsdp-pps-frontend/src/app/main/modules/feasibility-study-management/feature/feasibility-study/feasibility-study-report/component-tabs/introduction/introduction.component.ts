import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {IntroductionModel} from '../../../../../models/introduction.model';
import {IntroductionService} from '../../../../../services/introduction.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {ERROR, OK} from '../../../../../../../core/constants/message';
import {Subscription} from 'rxjs';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {
    MIN_EDITOR_CONFIG,
    MEDIUM_EDITOR_CONFIG
} from '../../../../../../../core/constants/editor-config';
import {UtilsService} from 'app/main/core/services/utils.service';
import {FeasibilityStudySummaryService} from "../../../../../services/feasibility-study-summary.service";

@Component({
    selector: 'app-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    clickEventSubscription: Subscription;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    formIntroduction: FormGroup;
    model: IntroductionModel = new IntroductionModel();

    fsrMasterId: number;

    expProjectBackground: boolean = true;
    expObjectiveOfTheFeasibility: boolean = true;
    expApproachAndMethology: boolean = true;
    expOrganizationOfFeasibility: boolean = true;

    update: boolean;

    uuid: string;

    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private router: Router,
                private fsService: FeasibilityStudySummaryService,
                private introductionService: IntroductionService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private snackBar: SnackbarHelper,
                private utilsService: UtilsService,
                private route: ActivatedRoute) {
        this.clickEventSubscription = this.introductionService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    //For form initial
    ngOnInit(): void {
        this.formIntroduction = this.formBuilder.group({
            projectBackground: new FormControl(''),
            objectiveOfTheFeasibility: new FormControl(''),
            approachAndMethology: new FormControl(''),
            organizationOfFeasibility: new FormControl(''),
        });
        this.getFSByPcUuid();

        // this.formIntroduction = this.formBuilder.group({
        //     projectBackground: '',
        //     objectiveOfTheFeasibility: '',
        //     approachAndMethology: '',
        //     organizationOfFeasibility: '',
        // });
    }

    private getFSByPcUuid() {
        this.spinner = true;
        this.fsService.getFsSummaryByPcUuid(this.route.snapshot.paramMap.get('uuid')).subscribe(res => {
            if (res) {
                this.fsrMasterId = res.id;
                this.getIntroductionByFsrMasterId();
            }
            this.spinner = false;
        });
    }

    // load all api data
    loadData(): void {
        this.fsrMasterId = this.feasibilityProposalHelperService.feasibilityReportCreateId;
        if (this.fsrMasterId > 0) {
            this.getIntroductionByFsrMasterId();
        }
    }

    //For create introduction
    saveAndNext(): void {
        this.model.project_background = this.formIntroduction.value.projectBackground;
        this.model.obj_of_fs_study = this.formIntroduction.value.objectiveOfTheFeasibility;
        this.model.approach_methodology_fs_study = this.formIntroduction.value.approachAndMethology;
        this.model.org_fs_study = this.formIntroduction.value.organizationOfFeasibility;
        this.model.fsrMasterId = this.fsrMasterId;
        this.spinner = true;
        this.introductionService.create(this.model).subscribe(res => {
            if (res.uuid) {
                ;this.snackBar.openSuccessSnackBar();
                this.spinner = false;
                this.nextStep.emit(true);
            }
        }, err => {
            this.spinner = false;
            this.snackBar.openErrorSnackBar();
        });

    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formIntroduction, files, propertyName);
    }

    //For get introduction by pc uuid
    getIntroductionByFsrMasterId(): any {
        this.introductionService.getIntroductionByFsrMasterId(this.fsrMasterId).subscribe(res => {
            if (res) {
                this.update = true;
                this.setValueFromIntroduction(res);
                this.uuid = res.uuid;
            }
        });
    }

    //For set introduction form value
    setValueFromIntroduction(res: any) {
        this.formIntroduction.patchValue({
            projectBackground: res.project_background,
            objectiveOfTheFeasibility: res.obj_of_fs_study,
            approachAndMethology: res.approach_methodology_fs_study,
            organizationOfFeasibility: res.org_fs_study
        });
    }

    //For create introduction
    saveAndExit(): void {
        this.model.project_background = this.formIntroduction.value.projectBackground;
        this.model.obj_of_fs_study = this.formIntroduction.value.objectiveOfTheFeasibility;
        this.model.approach_methodology_fs_study = this.formIntroduction.value.approachAndMethology;
        this.model.org_fs_study = this.formIntroduction.value.organizationOfFeasibility;
        this.model.fsrMasterId = this.fsrMasterId;
        this.spinner = true;
        this.introductionService.create(this.model).subscribe(res => {
            if (res.uuid) {
                this.snackBar.openSuccessSnackBar();
                this.spinner = false;
                this.router.navigate([`feasibility-study`]);
            }
        }, err => {
            this.spinner = false;
            this.snackBar.openErrorSnackBar();
        });
    }

    //For update introduction
    updateAndNext(): void {
        this.model.project_background = this.formIntroduction.value.projectBackground;
        this.model.obj_of_fs_study = this.formIntroduction.value.objectiveOfTheFeasibility;
        this.model.approach_methodology_fs_study = this.formIntroduction.value.approachAndMethology;
        this.model.org_fs_study = this.formIntroduction.value.organizationOfFeasibility;
        this.model.fsrMasterId = this.fsrMasterId;
        this.model.uuid = this.uuid;
        this.spinner = true;
        this.introductionService.update(this.model).subscribe(res => {
            if (res.uuid) {
                // this.snackBar.openSuccessSnackBar();
                this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.nextStep.emit(true);
            }
        }, err => {
            // this.snackBar.openErrorSnackBar();
            this.spinner = false;
            this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
        });
    }

    //For update introduction
    updateAndExit(): void {
        this.model.project_background = this.formIntroduction.value.projectBackground;
        this.model.obj_of_fs_study = this.formIntroduction.value.objectiveOfTheFeasibility;
        this.model.approach_methodology_fs_study = this.formIntroduction.value.approachAndMethology;
        this.model.org_fs_study = this.formIntroduction.value.organizationOfFeasibility;
        this.model.fsrMasterId = this.fsrMasterId;
        this.model.uuid = this.uuid;
        this.spinner = true;
        this.introductionService.update(this.model).subscribe(res => {
            if (res.uuid) {
                // this.snackBar.openSuccessSnackBar();
                this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.router.navigate([`feasibility-study`]);
            }
        }, err => {
            // this.snackBar.openErrorSnackBar();
            this.spinner = false;
            this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
        });
    }

    /**
     * For Expanding CK Editor
     * @param i
     */
    expand(i: number): void {
        if (i === 1) {
            this.expProjectBackground = true;
        }
        if (i === 2) {
            this.expObjectiveOfTheFeasibility = true;
        }
        if (i === 3) {
            this.expApproachAndMethology = true;
        }
        if (i === 4) {
            this.expOrganizationOfFeasibility = true;
        }
    }

    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapse(i: number): void {
        if (i === 1) {
            this.expProjectBackground = false;
        }
        if (i === 2) {
            this.expObjectiveOfTheFeasibility = false;
        }
        if (i === 3) {
            this.expApproachAndMethology = false;
        }
        if (i === 4) {
            this.expOrganizationOfFeasibility = false;
        }
    }

    //For go to previous tab
    back(): void {
        this.backPrevious.emit(true);
    }

}
