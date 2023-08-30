import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {IProjectLocation} from '../../../../../../project-concept-management/models/project-location';

import {ActivatedRoute, Router} from '@angular/router';
import {ProjectConceptService} from '../../../../../../project-concept-management/services/project-concept.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {UnsubscribeAdapterComponent} from '../../../../../../../core/helper/unsubscribeAdapter';
import {ERROR, FAILED_UPDATE, OK, SUCCESSFULLY_UPDATED} from '../../../../../../../core/constants/message';
import {FormControl, FormGroup} from '@angular/forms';
import {DppLocationService} from '../../../../../services/dpp-location.service';
import {DppProjectSummeryHelperService} from "../../../../../services/dpp-project-summery-helper.service";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {RdppLocationService} from "../../../../../services/rdpp-location.service";
import {RdppObjectiveCostService} from "../../../../../services/rdpp-objective-cost.service";
import {DppObjectiveCostModel} from "../../../../../models/dppObjectiveCost.model";

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
    objtiveCostModel : DppObjectiveCostModel;
    dppMasterId: number;
    projectSummeryId: number;
    conceptUuid: string;
    rdppMasterId: number;

    form: FormGroup;
    updateForm: FormGroup;

    spinner: boolean;
    dppId: number;
    private rdppUuid: string;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: DppLocationService,
                private rdppLocationService: RdppLocationService,
                private router: Router,
                private projectConceptService: ProjectConceptService,
                private projectSummaryService: ProjectSummaryService,
                private snackbarHelper: SnackbarHelper,
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
        this.getLocationByRdppMasterId();
        this.populateForm();

    }

    getRdppMasterData(masterId){
        this.rdppMasterService.getObjectiveCostByRdppMasterId(masterId).subscribe(res =>{
            this.objtiveCostModel = res;
        })
    }

    /**
     * FormGroup initialize
     */
    private populateForm(): void {
        this.form = new FormGroup({
            rdppMasterId: new FormControl(this.rdppMasterId),
            uuid: new FormControl(''),
            projectConceptMasterId: new FormControl(''),
            dppMasterId: new FormControl(''),
            division: new FormControl(''),
            zilla: new FormControl(''),
            upazila: new FormControl(''),
            municipality: new FormControl(''),
        });
    }

    private updatePopulateForm(): void {
        this.updateForm = new FormGroup({
            rdppMasterId: new FormControl(this.rdppMasterId),
            uuid: new FormControl(this.rdppUuid),
            division: new FormControl(''),
            zilla: new FormControl(''),
            upazila: new FormControl(''),
            municipality: new FormControl(''),
        });
    }

    /**
     * Get Project Summery by UUID;
     */
    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                if(res.id) {
                    this.projectSummeryId = res.id;
                    this.getProjectLocation(this.projectSummeryId);
                }
            })
        );
    }


    private getLocationByRdppMasterId(): any {
        this.subscribe$.add(
            this.rdppLocationService.getByRdppLocation(this.rdppMasterId).subscribe(res => {
                if (res.status == null) {
                    this.location = res;
                    this.rdppUuid = res.uuid;
                    this.form.patchValue({
                        uuid: res.uuid,
                        dppMasterId: res.dppMasterId
                    });
                    if(res){
                        this.addData({
                            divisions: res.divisions,
                            zilla: res.zillas,
                            upazilla: res.upazilas,
                            municipality: res.municipalitys
                        });
                    }
                    //
                }else if(res.status != null && this.objtiveCostModel.revisedVersion == '1st Revised'){
                    this.getProjectConceptById();
                }else {
                    this.getReveisedLocation(this.objtiveCostModel.referenceId);

                }
            })
        )
    }

    getReveisedLocation(refId){
        this.rdppLocationService.getByRdppLocation(refId).subscribe(res =>{
            if (res.status == null) {
                this.location = res;
                this.rdppUuid = res.uuid;
                this.form.patchValue({
                    uuid: res.uuid,
                    dppMasterId: res.dppMasterId
                });
                if(res){
                    this.addData({
                        divisions: res.divisions,
                        zilla: res.zillas,
                        upazilla: res.upazilas,
                        municipality: res.municipalitys
                    });
                }
                //
            }
        })
    }


    /**
     * Get Project Location
     */
    private getProjectLocation(psId: number) {
        this.subscribe$.add(
            this.service.getByProjectSummaryId(psId).subscribe(res => {
                this.location = res;
                this.dppMasterId = res.dppMasterId;
                this.form.patchValue({
                    uuid: res.uuid,
                    dppMasterId: res.dppMasterId
                });
                if (res) {
                    this.form.patchValue({uuid: res.uuid});
                    this.addData({divisions: res.divisions, zilla: res.zillas, upazilla: res.upazilas, municipality: res.municipalitys });
                }
            })
        );
    }

    /**
     * Save data in DB
     */


    saveAndNext(): any {
        if(this.rdppUuid != null){
            this.update(true);
        }else{
            this.create(true);
        }
    }

    /**
     * Save and Exit
     */
    saveAndExit(): void {
        if(this.rdppUuid != null){
            this.update(false);
        }else{
            this.create(false);
        }
    }

    /**
     * For create Location
     * @param next
     */
    private create(next: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.rdppLocationService.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.getProjectLocation(this.projectSummaryId);
                    this.snackbarHelper.openSuccessSnackBar();
                    (next) ? this.nextStep.emit(true) : this.navigateToList();
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
        this.subscribe$.add(
            this.rdppLocationService.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.getProjectLocation(this.projectSummaryId);
                    (next) ? this.nextStep.emit(true) : this.navigateToList();
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
        this.router.navigate(['/rdpp-rtapp/view-dashboard'], { queryParams: {pcUuid: this.conceptUuid, id: this.rdppMasterId}});
    }
}
