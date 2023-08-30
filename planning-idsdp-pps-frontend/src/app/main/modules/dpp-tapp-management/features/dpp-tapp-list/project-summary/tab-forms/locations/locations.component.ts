import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {IProjectLocation} from '../../../../../../project-concept-management/models/project-location';

import {ActivatedRoute, Router} from '@angular/router';
import {ProjectConceptService} from '../../../../../../project-concept-management/services/project-concept.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {UnsubscribeAdapterComponent} from '../../../../../../../core/helper/unsubscribeAdapter';
import {
    ERROR,
    FAILED_UPDATE,
    OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED,
    SUCCESSFULLY_UPDATED_BN
} from '../../../../../../../core/constants/message';
import {FormControl, FormGroup} from '@angular/forms';
import {DppLocationService} from '../../../../../services/dpp-location.service';
import {DppProjectSummeryHelperService} from "../../../../../services/dpp-project-summery-helper.service";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {TranslateService} from "@ngx-translate/core";
import {MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";

@Component({
    selector: 'app-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss']
})
export class LocationsComponent extends UnsubscribeAdapterComponent implements OnInit {

    @Input() projectSummaryId: number;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    location: IProjectLocation;
    dppMasterId: number;
    projectSummeryId: number;
    conceptUuid: string;

    form: FormGroup;
    formJustification: FormGroup;

    spinner: boolean;
    paripatraVersion: string;
    isParipatra2016: boolean;
    isShowJustification: boolean = true;
    minEditorConfig: any = MIN_EDITOR_CONFIG;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: DppLocationService,
                private router: Router,
                private projectConceptService: ProjectConceptService,
                private projectSummaryService: ProjectSummaryService,
                private snackbarHelper: SnackbarHelper,
                private dppHelperService: DppProjectSummeryHelperService,
                private route: ActivatedRoute) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.conceptUuid = this.route.snapshot.params['id'];
    }


    /**
     * Initially called this method
     */
    ngOnInit(): void {
        this.populateForm();
        this.getProjectConceptById();
    }

    /**
     * FormGroup initialize
     */
    private populateForm(): void {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            projectConceptMasterId: new FormControl(''),
            dppMasterId: new FormControl(''),
            division: new FormControl(''),
            zilla: new FormControl(''),
            upazila: new FormControl(''),
            municipality: new FormControl(''),
            projectAreaJustification: new FormControl('')
        });
        this.formJustification = new FormGroup({
            projectAreaJustification: new FormControl('')
        });
    }

    /**
     * Get Project Summery by UUID;
     */
    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                if(res.id) {
                    this.paripatraVersion = res.paripatraVersion.nameEn;
                    this.isParipatra2016 = res.isParipatra2016;

                    this.projectSummeryId = res.id;
                    this.form.patchValue({
                        dppMasterId: this.dppHelperService.objectiveCostCreateId,
                        projectConceptMasterId: res.id
                    });
                    this.getProjectLocation(this.projectSummeryId);
                }
            })
        );
    }

    toggleJustification = () => this.isShowJustification = this.isShowJustification = !this.isShowJustification;

    /**
     * Get Project Location
     */
    private getProjectLocation(psId: number) {
        this.subscribe$.add(
            this.service.getByProjectSummaryId(psId).subscribe(res => {
                if (res) {
                    this.location = res;
                    this.dppMasterId = res.dppMasterId;
                    this.form.patchValue({
                        uuid: res.uuid,
                        dppMasterId: res.dppMasterId,
                        projectAreaJustification: res.projectAreaJustification
                    });
                    this.formJustification.patchValue({
                        projectAreaJustification: res.projectAreaJustification
                    });
                    // this.form.patchValue({uuid: res.uuid});
                    this.addData({divisions: res.divisions, zilla: res.zillas, upazilla: res.upazilas, municipality: res.municipalitys });
                }
            })
        );
    }

    save(): void {
        if (this.dppHelperService.objectiveCostCreateId > 0) {
            (this.dppMasterId) ? this.update(false) : this.create(false);
        } else this.snackbarHelper.openWarnSnackBarWithMessage("Objectives & cost data is not provided yet!", "");

    }

    /**
     * Save data in DB
     */
    saveAndNext(): void {
        if (this.dppHelperService.objectiveCostCreateId > 0) {
            (this.dppMasterId) ? this.update(true) : this.create(true);
        } else this.snackbarHelper.openWarnSnackBarWithMessage("Objectives & cost data is not provided yet!", "");

    }

    /**
     * Save and Exit
     */
    saveAndExit(): void {
        if (this.dppHelperService.objectiveCostCreateId > 0) {
            (this.dppMasterId) ? this.update(true) : this.create(true);
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
        } else this.snackbarHelper.openWarnSnackBarWithMessage("Objectives & cost data is not provided yet!", "");
    }

    /**
     * For create Location
     * @param next
     */
    private create(next: boolean) {
        this.spinner = true;
        this.form.patchValue({
            projectAreaJustification: this.formJustification.value.projectAreaJustification
        });
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if(res.uuid){
                    this.getProjectLocation(this.projectSummeryId);
                    this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                    if (next) this.nextStep.emit(true);
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
            })
        );
    //    this.nextStep.emit(true);
    }

    /**
     * For update location
     * @param next
     */
    private update(next: boolean) {
        this.spinner = true;
        this.form.patchValue({
            projectAreaJustification: this.formJustification.value.projectAreaJustification
        });
        this.subscribe$.add(
            this.service.update(this.form.value).subscribe(res => {
                if(res.uuid){
                    this.getProjectLocation(this.projectSummeryId);
                    this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                    if (next) this.nextStep.emit(true);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
                this.spinner = false;
            })
        );
    }

    /**
     * Back method
     */
    back(): void {
        this.backPrevious.emit(true);
    }

    /**
     * @param $event
     */
    addData($event: { divisions: number[]; zilla: number[]; upazilla: number[]; municipality: number[] }) {
        this.form.patchValue({
            projectSummaryId: this.projectConceptService.projectSummaryCreateId,
            division: $event.divisions.map(m => m['id']),
            zilla: $event.zilla.map(m => m['id']),
            upazila: $event.upazilla.map(m => m['id']),
            municipality: $event.municipality.map(m => m['id']),
        });
    }

    /**
     * Goto home
     */
    navigateToList() {
        this.router.navigate([`dpp-tapp`]);
    }
}
