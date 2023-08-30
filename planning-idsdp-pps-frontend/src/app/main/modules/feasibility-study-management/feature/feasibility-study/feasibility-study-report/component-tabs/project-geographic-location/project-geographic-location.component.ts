import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {ProjectLocationModel} from '../../../../../models/project-location.model';
import {FormControl, FormGroup} from '@angular/forms';
import {ProjectLocationService} from '../../../../../services/project-location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {ERROR, OK} from '../../../../../../../core/constants/message';
import {Subscription} from 'rxjs';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {LocationHelperService} from '../../../../../../../shared/services/location-helper.service';
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {FeasibilityStudySummaryService} from "../../../../../services/feasibility-study-summary.service";

@Component({
    selector: 'app-project-geographic-location',
    templateUrl: './project-geographic-location.component.html',
    styleUrls: ['./project-geographic-location.component.scss']
})
export class ProjectGeographicLocationComponent implements OnInit {
    clickEventSubscription: Subscription;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    projectLocation: ProjectLocationModel;

    form: FormGroup;
    model: ProjectLocationModel = new ProjectLocationModel();
    fsrMasterId: number = 0;
    pcMasterId: number = 0;
    update: boolean;
    show: boolean;
    uuid: string;
    conceptUuid: string;
    spinner: boolean;

    constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ProjectLocationService,
                private locationHelperService: LocationHelperService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private router: Router,
                private snackbarHelper: SnackbarHelper,
                private projectSummaryService: ProjectSummaryService,
                private fsService: FeasibilityStudySummaryService,
                private snackBar: SnackbarHelper,
                private route: ActivatedRoute) {
        this.clickEventSubscription = this.service.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    private populateForm(): void {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            fsrMasterId: new FormControl(''),
            division: new FormControl(''),
            zilla: new FormControl(''),
            upazila: new FormControl(''),
            municipality: new FormControl(''),
        });
    }

    //For form initial
    ngOnInit(): void {
        this.conceptUuid = this.route.snapshot.paramMap.get('uuid');
        this.populateForm();
        this.getFSByPcUuid();
    }

    private getFSByPcUuid() {
        this.show = true;
        this.fsService.getFsSummaryByPcUuid(this.conceptUuid).subscribe(res => {
            if (res) {
                this.fsrMasterId = res.id;
                this.getProjectConceptById();
            }
            this.show = false;
        });
    }

    private getProjectConceptById() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            if (res.id) {
                this.pcMasterId = res.id;
                this.getProjectLocation();
            } else {
                this.show = false;
            }
        });
    }

    // load all api data
    loadData(): void {
        this.show = true;
        this.fsrMasterId = this.feasibilityProposalHelperService.feasibilityReportCreateId;
        this.form.patchValue({
            fsrMasterId: this.fsrMasterId
        });
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            if (res.id) {
                this.pcMasterId = res.id;
                this.getProjectLocation();
            } else {
                this.show = false;
            }
        });
    }

    //For get project location
    private getProjectLocation() {
        if (this.fsrMasterId === 0 || this.pcMasterId === 0)
            return;
        this.service.getByProjectConceptId(this.fsrMasterId, this.pcMasterId).subscribe(res => {
            this.projectLocation = res;
            if (res) {
                if (res.id) {
                    this.update = true;
                    this.form.patchValue({
                        uuid: res.uuid,
                        fsrMasterId: res.fsrMasterId
                    });
                } else {
                    this.update = false;
                    this.form.patchValue({
                        fsrMasterId: res.fsrMasterId
                    });
                }
                // this.locationHelperService.setProjectLocationEvent();
                this.show = false;
                this.addData({
                    divisions: res.divisions,
                    zilla: res.zillas,
                    upazilla: res.upazilas,
                    municipality: res.municipalitys
                });
            } else {
                this.show = false;
            }
        });
    }

    //For create project location
    saveAndNext(): void {
        this.spinner = true;
        this.service.create(this.form.value).subscribe(res => {
            if (res.uuid) {
                this.getProjectLocation();
                this.snackBar.openSuccessSnackBar();
                this.spinner = false;
                this.nextStep.emit(true);
            } else {
                this.spinner = false;
                this.snackBar.openErrorSnackBar();
            }
        });

    }

    //For create project location
    saveAndExit(): void {
        this.spinner = true;
        this.service.create(this.form.value).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBar();
                this.spinner = false;
                // this.router.navigate([`feasibility-study`]);
                this.router.navigate(['feasibility-study/view-dashboard/' + this.conceptUuid]);
            } else {
                this.spinner = false;
                this.snackBar.openErrorSnackBar();
            }
        });
    }

    //For update project location
    updateAndNext() {
        this.spinner = true;
        this.service.update(this.form.value).subscribe(res => {
            if (res.uuid) {
                this.getProjectLocation();
                this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.nextStep.emit(true);
            } else {
                this.spinner = false;
                this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
            }
        });
    }

    //For update project location
    updateAndExit() {
        this.spinner = true;
        this.service.update(this.form.value).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                // this.router.navigate([`feasibility-study`]);
                this.router.navigate(['feasibility-study/view-dashboard/' + this.conceptUuid]);
            } else {
                this.spinner = false;
                this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
            }
        });
    }

    //For go to previous tab
    back(): void {
        this.backPrevious.emit(true);
    }

    //For add data
    addData($event: { divisions: number[]; zilla: number[]; upazilla: number[]; municipality: number[] }) {
        this.form.patchValue({
            division: $event.divisions.map(m => m['id']),
            zilla: $event.zilla.map(m => m['id']),
            upazila: $event.upazilla.map(m => m['id']),
            municipality: $event.municipality.map(m => m['id']),
        });
    }

    nextTab(): void {
        this.nextStep.emit(true);
    }

}
