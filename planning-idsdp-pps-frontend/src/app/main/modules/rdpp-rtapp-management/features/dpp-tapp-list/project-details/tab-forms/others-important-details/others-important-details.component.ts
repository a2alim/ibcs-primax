import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { OtherImportantDetails } from '../../models/other-important-details.model';
import { OtherImportantDetailsService } from '../../services/other-important-details.service';
import { ProjectDetailsPartB } from '../../models/project-details-partb.model';
import { ProjectDetailsPartbService } from '../../services/project-details-partb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectSummaryService } from "../../../../../../project-concept-management/services/project-summary.service";
import { SnackbarHelper } from "../../../../../../../core/helper/snackbar.helper";
import { DppObjectiveCostService } from "../../../../../services/dpp-objective-cost.service";
import { UtilsService } from 'app/main/core/services/utils.service';

/*----/Lng Translation----*/
@Component({
    selector: 'app-others-important-details',
    templateUrl: './others-important-details.component.html',
    styleUrls: ['./others-important-details.component.scss']
})
export class OthersImportantDetailsComponent implements OnInit {
    formGroup: FormGroup;
    conceptUuid = this.route.snapshot.params['id'];
    uuid: string;
    otherImportantDetails: OtherImportantDetails = new OtherImportantDetails();
    projectDetailsPartBRequest: ProjectDetailsPartB = new ProjectDetailsPartB();
    buttonDisable: boolean;
    dppMasterUuid;
    editor1 = false;
    editor2 = false;
    editor3 = false;
    editor4 = false;
    editor5 = false;

    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private projectSummaryService: ProjectSummaryService,
        private route: ActivatedRoute,
        private snackbar: SnackbarHelper,
        private _formBuilder: FormBuilder,
        private objectiveAndCostService: DppObjectiveCostService,
        private otherImportantDetailsService: OtherImportantDetailsService,
        private projectDetailsPartbService: ProjectDetailsPartbService,
        private utilsService: UtilsService,
        private router: Router, private _snackBar: MatSnackBar) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.loadFormValue();
        this.getDppMasterUuid();
        this.projectDetailsPartbService.getProjectDetailsPartBuuid().subscribe(uuId => {
            this.projectDetailsPartBRequest.uuid = uuId;
        });
        this.getOtherImportantDetails();
    }

    buttonEnable() {
        if (this.dppMasterUuid == null) {
            this.buttonDisable = true;
        } else {
            this.buttonDisable = false;
        }
    }

    /* For getting Master table data */
    getDppMasterUuid() {
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            this.dppMasterUuid = res.uuid;
            this.buttonEnable();
        })
    }

    toggleShow1 = () => this.editor1 = this.editor1 = !this.editor1;

    toggleShow2 = () => this.editor2 = this.editor2 = !this.editor2;

    toggleShow3 = () => this.editor3 = this.editor3 = !this.editor3;

    toggleShow4 = () => this.editor4 = this.editor4 = !this.editor4;

    toggleShow5 = () => this.editor5 = this.editor5 = !this.editor5;

    /* For loading FormValue */
    loadFormValue() {
        this.formGroup = this._formBuilder.group({
            uuid: ['', Validators.required],
            sustainabilityBenefit: ['', Validators.required],
            steeringCommitteeTor: ['', Validators.required],
            implementationCommitteeTor: ['', Validators.required],
            others: ['', Validators.required],

        })
    }

    /* For setting Other Important Details */
    setOtherImportantDetails(res: any) {
        this.formGroup.patchValue({
            uuid: res.uuid,
            sustainabilityBenefit: res.sustainabilityBenefit,
            steeringCommitteeTor: res.steeringCommitteeTor,
            implementationCommitteeTor: res.implementationCommitteeTor,
            others: res.others,
            projectId: res.projectId,
        });
    }

    /* For getting other Important Details */
    getOtherImportantDetails() {
        this.otherImportantDetailsService.getOtherImportantDetails(this.conceptUuid).subscribe((res) => {
            this.setOtherImportantDetails(res);
            this.uuid = res.uuid;
        })
    }

    onSubmit() {
        if (this.uuid == null) {
            this.save();
        } else {
            this.updateOtherImportantDetails();
        }
    }

    /* For saving other Important Details */
    save() {
        this.spinner = true;
        this.otherImportantDetails.sustainabilityBenefit = this.formGroup.value.sustainabilityBenefit;
        this.otherImportantDetails.steeringCommitteeTor = this.formGroup.value.steeringCommitteeTor;
        this.otherImportantDetails.implementationCommitteeTor = this.formGroup.value.implementationCommitteeTor;
        this.otherImportantDetails.others = this.formGroup.value.others;
        this.otherImportantDetails.projectDetailsPartBRequest = this.projectDetailsPartBRequest;
        this.otherImportantDetails.projectConceptUuid = this.conceptUuid;
        this.otherImportantDetailsService.saveOtherImportantDetails(this.otherImportantDetails).subscribe(res => {
            this.snackbar.openSuccessSnackBar();
            this.spinner = false;
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.projectDetailsPartbService.projectDetailsPartBSubject.next(null);
        });
    }

    /* For updating other Important Details */
    updateOtherImportantDetails() {
        this.spinner = true;
        this.otherImportantDetails.sustainabilityBenefit = this.formGroup.value.sustainabilityBenefit;
        this.otherImportantDetails.steeringCommitteeTor = this.formGroup.value.steeringCommitteeTor;
        this.otherImportantDetails.implementationCommitteeTor = this.formGroup.value.implementationCommitteeTor;
        this.otherImportantDetails.others = this.formGroup.value.others;
        this.otherImportantDetails.projectDetailsPartBRequest = this.projectDetailsPartBRequest;
        this.otherImportantDetailsService.updateOtherImportantDetails(this.otherImportantDetails, this.conceptUuid).subscribe((res) => {
            this.spinner = false;
            this.snackbar.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok");
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.projectDetailsPartbService.projectDetailsPartBSubject.next(null);
        })
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formGroup, files, propertyName);
    }


}
