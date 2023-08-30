/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { TppAnnexureSavenService } from 'app/main/modules/dpp-tapp-management/services/tpp-annexure-saven.service';
import { ActivatedRoute } from '@angular/router';
import { TappObjectiveCostService } from "../../../../services/tapp-objective-cost.service";
import { UtilsService } from 'app/main/core/services/utils.service';
import {MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";
import {
    REQUIRED_FIELD_BN,
    REQUIRED_FIELD_EN,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED,
    SUCCESSFULLY_UPDATED_BN
} from "../../../../../../core/constants/message";
/*----/Lng Translation----*/


@Component({
    selector: 'app-tpp-annexure-saven',
    templateUrl: './tpp-annexure-seven.component.html',
    styleUrls: ['./tpp-annexure-seven.component.scss']
})
export class TppAnnexureSavenComponent implements OnInit {
    frmGroup: FormGroup;
    uuid: string;
    tappMasterUuid;
    pcMasterId;
    titleEn: string;
    proConceptUuid = this.route.snapshot.params['id'];

    spinner: boolean;
    minEditorConfig: any = MIN_EDITOR_CONFIG;
    isParipatra2016: boolean;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private tappObjectiveCostService: TappObjectiveCostService,
        private matSnackBar: SnackbarHelper,
        private globalVal: GlobalValidationService,
        private tppAnnexureSavenService: TppAnnexureSavenService,
        private route: ActivatedRoute,
        private utilsService: UtilsService
    ) {
        /*---- Translate language Bng and Eng ----*/
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.frmGroup = this.formBuilder.group({
            id: [''],
            uuid: [''],
            projectConceptMasterId: [1],
            projectConceptUuid: this.proConceptUuid,
            letterOfAgreement: ['', [this.globalVal.trimValidator('Field')]]
        });
    }


    ngOnInit(): void {
        this.getTappMasterData();
        this.setFormFieldValue();
    }

    /*---- Set form field value------*/
    setFormFieldValue() {
        const proConceptMs_id = this.route.snapshot.params['id'];
        this.tppAnnexureSavenService.getData("get-data/" + proConceptMs_id).subscribe((response) => {
            const res = response.res;
            // if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
            //     this.isParipatra2016 = true;
            // } else {
            //     this.isParipatra2016 = false;
            // }

            if (response.status > 0) {
                this.uuid = res.uuid
                this.frmGroup = this.formBuilder.group({
                    id: [res.id],
                    uuid: [res.uuid],
                    projectConceptMasterId: [res.projectConceptMasterId],
                    projectConceptUuid: [this.proConceptUuid],
                    letterOfAgreement: [res.letterOfAgreement]
                });
            }

        });
    }

    /*----Submit form----*/
    onSubmit() {
        this.saveData();
    }

    /*----If validation is true the data will be save into the database table----*/
    saveData() {
        this.spinner = true;
        if (this.tappMasterUuid != null) {
            if (this.frmGroup.valid) {
                this.tppAnnexureSavenService.saveData(this.frmGroup.value).subscribe((response) => {
                    if (this.uuid == null) {
                        this.matSnackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                    } else {
                        this.matSnackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                    }
                    this.setFormFieldValue();
                    this.spinner = false;
                });
            } else {
                this.matSnackBar.openErrorSnackBarWithMessageEnBn(REQUIRED_FIELD_EN, REQUIRED_FIELD_BN);
            }


        } else {
            this.matSnackBar.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
        }

    }

    private getTappMasterData() {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.proConceptUuid).subscribe((response) => {
            let res = response.res;
            this.tappMasterUuid = res.uuid;
            this.pcMasterId = res.id;
            this.titleEn = res.projectTitleEn;
        })
    }

    /*
********* Go Back to Project Home Page
*/

    goBackToHome() {
        window.history.back();
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
    }
}
