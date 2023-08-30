import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ResearcherProposalInstitutionInformation } from "../../../../../models/ResearcherProposalInstitutionInformation";
import { FuseTranslationLoaderService } from "../../../../../../../core/services/translation-loader.service";
import { UnsubscribeAdapterComponent } from "../../../../../../../core/helper/unsubscribeAdapter";
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { ResearcherProposal } from 'app/main/modules/rpm/models/ResearcherProposal';
import { BehaviorSubject } from 'rxjs';
import { ResearcherProposalInstituteInfoService } from 'app/main/modules/rpm/services/researcher-proposal-institute-info.service';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { YearsForInstitution } from "../../../../../contants/different-type.constant";
import { ERROR, OK } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';

@Component({
    selector: 'app-researcher-proposal-institute-info',
    templateUrl: './researcher-proposal-institute-info.component.html',
    styleUrls: ['./researcher-proposal-institute-info.component.scss']
})
export class ResearcherProposalInstituteInfoComponent extends UnsubscribeAdapterComponent implements OnInit, OnChanges {

    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    spinner = true;
    institutionInformation: ResearcherProposalInstitutionInformation = new ResearcherProposalInstitutionInformation();
    canSave: boolean;
    years = YearsForInstitution;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;

    /*----/Button---*/
    file: File;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private researcherProposalInstituteInfoService: ResearcherProposalInstituteInfoService,
        private snackbarHelper: SnackbarHelper,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = false;
    }


    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposalInfo': {
                        if (this.existingProposalInfo.id) {
                            this.canSave = true;
                            this.findByResearcherProposalId(this.existingProposalInfo.id);
                        }
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.findByResearcherProposalId(res.id);
                            }
                        });
                    }
                }
            }
        }
    }

    findByResearcherProposalId(researcherProposalId) {
        this.spinner = true;
        this.institutionInformation.researcherProposalId = researcherProposalId;
        this.researcherProposalInstituteInfoService.findByResearcherProposalId(researcherProposalId).subscribe(
            response => {
                this.institutionInformation = response.obj ? response.obj : new ResearcherProposalInstitutionInformation();
                this.institutionInformation.researcherProposalId = researcherProposalId;
            }
        );
        this.spinner = false;
    }

    onSubmit(next: boolean) {

        if (!this.institutionInformation.instituteName || !this.institutionInformation.yearOfEstablishment || !this.institutionInformation.addressDetails || !this.institutionInformation.telephoneNo || !this.institutionInformation.emailAddress) {
            return;
        }

        this.canSave = false;
        if (this.institutionInformation.id) {
            this.onUpdate(next)
        } else {
            this.onSave(next);
        }
    }

    onSave(next: boolean) {
        this.spinner = true;


        // if(this.existingProposalInfo && this.existingProposalInfo.id){
        //     this.institutionInformation.researcherProposalId = this.existingProposalInfo.id;
        // }
        //
        // if(this.proposalInfo && this.proposalInfo.id){
        //     this.institutionInformation.researcherProposalId = this.proposalInfo.id;
        // }

        this.researcherProposalInstituteInfoService.createResearcherProposalInstituteInfo(this.institutionInformation, this.file).subscribe(
            response => {
                if (response.success) {
                    this.brodCastChange.next(response.obj);
                    this.institutionInformation = response.obj;
                    this.snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.spinner = false;
                this.canSave = true;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
                this.canSave = true;
            }
        );
    }

    onUpdate(next: boolean) {
        this.spinner = true;
        this.researcherProposalInstituteInfoService.UpdateResearcherProposalInstituteInfo(this.institutionInformation, this.file).subscribe(
            response => {
                if (response.success) {
                    this.institutionInformation = response.obj;
                    this.snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.spinner = false;
                this.canSave = true;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
                this.canSave = true;
            }
        );
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    uploadFile(file: FileList) {
        this.file = file.item(0);
    }

}
