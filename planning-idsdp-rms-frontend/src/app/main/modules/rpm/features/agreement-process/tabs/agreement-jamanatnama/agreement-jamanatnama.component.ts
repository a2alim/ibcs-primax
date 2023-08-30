import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {
    downloadIcon,
    nextIcon,
    previousIcon,
    printIcon,
    saveIcon,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import { ToastrService } from "ngx-toastr";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { FiscalYearServiceService } from "../../../../../settings/services/fiscal-year-service.service";
import { AgreementJamanatnamaFormModel } from "../../../../models/AgreementJamanatnamaFormModel";
import { LatterModel } from "../../../../models/LatterModel";
import { AgreementWithResearcherServiceService } from "../../../../services/agreement-with-researcher-service.service";
import { LatterService } from "../../../../services/latter.service";
import { ResearcherProposalService } from "../../../../services/researcher-proposal.service";
import { locale as lngBangla, locale as lngEnglish } from "../../i18n/en";

@Component({
    selector: 'app-agreement-jamanatnama',
    templateUrl: './agreement-jamanatnama.component.html',
    styleUrls: ['./agreement-jamanatnama.component.scss']
})
export class AgreementJamanatnamaComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    nextIcon = nextIcon;
    saveIcon = saveIcon;
    updateSuccess = updateSuccess;

    /*----/Button---*/
    fiscalYearList: any[] = [];
    researchTitleNames: any[] = [];
    userList: any[] = [];
    latter: LatterModel = new LatterModel();

    agreementJamanatnamaFormModel: AgreementJamanatnamaFormModel = new AgreementJamanatnamaFormModel();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    profileImageName: string = null;
    signatureImageName: string = null;
    fiscalYearId: number;
    formGroup: any;

    researcherProposalList: any[] = new Array();

    fileToUpload: any = [];

    agreementId: any;
    isEditable: boolean = false;
    spinner: boolean = false;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private fiscalyearservice: FiscalYearServiceService,
                private toastr: ToastrService,
                private _researcherProposalService: ResearcherProposalService,
                private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _latterService: LatterService,
                private agreementWithResearcher: AgreementWithResearcherServiceService) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.agreementId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.agreementId != null) {
            this.isEditable = true;
        }
    }

    ngOnInit(): void {
        if (this.isEditable) {
            this.getAllTabData();
        }
    }

    getAllTabData() {
        this.agreementWithResearcher.agreementAllDataResponse.asObservable().subscribe(response => {
            if (response != null) {
                this.agreementJamanatnamaFormModel = response.obj.tabThree;
                this.profileImageName = response.obj.tabThree.fileNameImage;
                this.signatureImageName = response.obj.tabThree.fileNameSignature;

            }

        })

    }

    /*
   * Bottom Default Tab Options
   * */
    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

    save() {
        if (!this.isEditable) {
            this.spinner = true;
            this.agreementJamanatnamaFormModel.agreementId = localStorage.getItem('agreement_with_researcher_id')
            this.agreementWithResearcher.saveTabThreeData(this.agreementJamanatnamaFormModel, this.fileToUpload).subscribe(res => {
                this.spinner = false;
                if (res.success) {
                    this.toastr.success(res.message, "", this.config);
                } else {
                    this.toastr.error(res.message, "", this.config);
                }
            })
        }

        else if (this.isEditable && !this.agreementJamanatnamaFormModel.agreementWithResearcherId?.id) {
            this.spinner = true;
            this.agreementJamanatnamaFormModel.agreementId = localStorage.getItem('agreement_with_researcher_id')
            this.agreementWithResearcher.saveTabThreeData(this.agreementJamanatnamaFormModel, this.fileToUpload).subscribe(res => {
                this.spinner = false
                if (res.success) {
                    this.toastr.success(res.message, "", this.config);
                } else {
                    this.toastr.error(res.message, "", this.config);
                }
            })
        }
        else {
            this.spinner = true;
            this.agreementJamanatnamaFormModel.agreementId = localStorage.getItem('agreement_with_researcher_id')
            this.agreementWithResearcher.updateTabThreeData(this.agreementJamanatnamaFormModel.agreementWithResearcherId.id,
                this.agreementJamanatnamaFormModel, this.fileToUpload).subscribe(res => {
                this.spinner = false;
                if (res.success) {
                    this.toastr.success(this.updateSuccess, "", this.config);
                } else {
                    this.toastr.error(res.message, "", this.config);
                }
            })

        }
    }

    saveAndNext() {
        this.save();
        this.nextTab();
    }

    handleFileInput(files: FileList, index: number) {
        this.fileToUpload[index] = files.item(0);
    }
}
