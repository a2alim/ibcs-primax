import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ProjectLocationService} from '../../../../../services/project-location.service';
import {UnsubscribeAdapterComponent} from '../../../../../../../core/helper/unsubscribeAdapter';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {Router} from '@angular/router';
import {IProjectLocation} from '../../../../../models/project-location';
import {ERROR, FAILED_UPDATE, OK, SUCCESSFULLY_UPDATED} from '../../../../../../../core/constants/message';
import {ProjectConceptService} from '../../../../../services/project-concept.service';

@Component({
    selector: 'app-project-location',
    templateUrl: './project-location.component.html',
    styleUrls: ['./project-location.component.scss']
})
export class ProjectLocationComponent extends UnsubscribeAdapterComponent implements OnInit {

    @Input() projectConceptId: number;
    @Input() canEdit: boolean;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    projectLocation: IProjectLocation;
    form: FormGroup;
    show = true;
    conceptUuid: string;
    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ProjectLocationService,
                private router: Router,
                private projectConceptService: ProjectConceptService,
                private snackbarHelper: SnackbarHelper) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    private populateForm(): void {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            projectConceptMasterId: new FormControl(''),
            division: new FormControl(''),
            zilla: new FormControl(''),
            upazila: new FormControl(''),
            municipality: new FormControl(''),
        });
    }

    ngOnInit(): void {
        if (this.projectConceptService.projectSummaryCreateId > 0) {
            this.projectConceptId = this.projectConceptService.projectSummaryCreateId;
            this.conceptUuid = this.projectConceptService.projectSummaryCreateUuid;
            this.getProjectLocation();
        }
        this.populateForm();
    }

    // For saved getting project location by project summary id
    private getProjectLocation() {
        this.subscribe$.add(
            this.service.getByProjectSummaryId(this.projectConceptId).subscribe(res => {
                this.projectLocation = res;
                if (res) {
                    this.form.patchValue({uuid: res.uuid});
                    this.addData({divisions: res.divisions, zilla: res.zillas, upazilla: res.upazilas, municipality: res.municipalitys });
                }
            })
        );
    }


    // For saving and going next tab
    saveAndNext(): void {
        if (this.projectConceptService.projectSummaryCreateId > 0) {
            (this.projectLocation) ? this.update(true) : this.create(true);
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please create Project Summary", "")
        }

    }

    // For saving and going list tab
    saveAndExit(): void {
        if (this.projectConceptService.projectSummaryCreateId > 0) {
            (this.projectLocation) ? this.update(false) : this.create(false);
        } else {
            this.snackbarHelper.openWarnSnackBarWithMessage("Please create Project Summary", "")
        }
    }

    nextTab(): void {
        this.nextStep.emit(true);
    }

    // For creating location
    private create(next: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.getProjectLocation();
                    this.snackbarHelper.openSuccessSnackBar();
                    (next) ? this.nextStep.emit(true) : this.navigateToList();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
            })
        );
    }

    // For updating location
    private update(next: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.service.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.getProjectLocation();
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    (next) ? this.nextStep.emit(true) : this.navigateToList();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
                this.spinner = false;
            })

        );
    }

    // For going back
    back(): void {
        this.backPrevious.emit(true);
    }

    // For adding data from main form
    addData($event: { divisions: number[], zilla: number[], upazilla: number[], municipality: number[] }) {
        this.form.patchValue({
            projectConceptMasterId: this.projectConceptService.projectSummaryCreateId,
            division: $event.divisions.map(m => m['id']),
            zilla: $event.zilla.map(m => m['id']),
            upazila: $event.upazilla.map(m => m['id']),
            municipality: $event.municipality.map(m => m['id']),
        });
    }


    // For navigate to list
    navigateToList() {
        this.router.navigate([`project-concept`]);
    }
}
