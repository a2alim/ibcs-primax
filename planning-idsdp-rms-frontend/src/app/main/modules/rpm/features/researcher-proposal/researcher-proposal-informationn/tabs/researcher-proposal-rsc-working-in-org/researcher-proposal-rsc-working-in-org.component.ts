import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ResearcherProposalRscWorkingInOrganization } from '../../../../../models/ResearcherProposalRscWorkingInOrganization';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { UnsubscribeAdapterComponent } from '../../../../../../../core/helper/unsubscribeAdapter';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ResearcherProposalInformation } from 'app/main/modules/rpm/models/ResearcherProposalInformation';
import { ResearcherProposal } from 'app/main/modules/rpm/models/ResearcherProposal';
import { BehaviorSubject } from 'rxjs';
import { ResearcherProposalRscWorkingInOrgService } from 'app/main/modules/rpm/services/researcher-proposal-rsc-working-in-org.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';

import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { ResearcherProfileRscWorkingInOrgService } from 'app/main/modules/rpm/services/researcher-profile-rsc-working-in-org.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { ERROR } from 'app/main/core/constants/message';

@Component({
    selector: 'app-researcher-proposal-rsc-working-in-org',
    templateUrl: './researcher-proposal-rsc-working-in-org.component.html',
    styleUrls: ['./researcher-proposal-rsc-working-in-org.component.scss']
})
export class ResearcherProposalRscWorkingInOrgComponent extends UnsubscribeAdapterComponent implements OnInit, OnChanges {

    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();


    existingProposalInfoId: number = 0;
    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;


    researcherProposalRscWorkingInOrganizations: ResearcherProposalRscWorkingInOrganization[] = [];
    proposalInfo: ResearcherProposalInformation = new ResearcherProposalInformation();
    canSave: boolean;
    profileId: number;
    researcherList: any[] = [];
    userDetails: { id: null, userId: null, name: null, userType: null, emailId: null, designation: null, mobileNumber: null, isActive: false, isInstitutional: false };


    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;

    /*----/Button---*/

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private researcherProposalRscWorkingInOrgService: ResearcherProposalRscWorkingInOrgService,
        private researcherProfileRscWorkingInOrgService: ResearcherProfileRscWorkingInOrgService,
        private snackbarHelper: SnackbarHelper,
        private storageService: StorageService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userDetails = this.storageService.getUserData();
    }

    ngOnInit(): void {
        this.addNewRow();
        if (this.userDetails.isInstitutional) {
            this.getAllByResearcherUserId(this.userDetails.id);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {

                    case 'existingProposalInfo': {
                        if (this.existingProposalInfo && this.existingProposalInfo.id) {
                            this.canSave = true;
                            this.existingProposalInfoId = this.existingProposalInfo.id;
                            // researcherProfilePersonalInfoDto.userDto.id
                            if (!this.userDetails.isInstitutional) {
                                this.getAllByResearcherUserId(this.existingProposalInfo.researcherProfilePersonalInfoDto.userId);
                            }
                            this.getAllfindByResearcherProposalId(this.existingProposalInfo.id);
                        }
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.existingProposalInfoId = res.id;

                                if (!this.userDetails.isInstitutional) {
                                    this.getAllByResearcherUserId(res.researcherProfilePersonalInfoDto.userId);
                                }

                                this.getAllfindByResearcherProposalId(res.id);
                            }
                        });
                    }
                }
            }
        }
    }


    onSubmit(next: boolean) {
        if(this.existingProposalInfoId < 1 || this.existingProposalInfoId == null){
            this.snackbarHelper.openWarnSnackBarWithMessage('Submit the proposal information first!.', '');
            return;
        }
        
        this.canSave = false;
        this.onSaveAndUpdate(next);
    }

    addNewRow() {
        let researchProposalInfo;
        if (this.existingProposalInfo && this.existingProposalInfo.id) {
            researchProposalInfo = this.existingProposalInfo.id;
            // this.rscWorkingInOrganizations.researcherProposalId = this.existingProposalInfo.id;
        }
        if (this.proposalInfo && this.proposalInfo.id) {
            researchProposalInfo = this.proposalInfo.id;
            // this.rscWorkingInOrganizations.researcherProposalId = this.proposalInfo.id;
        }

        this.researcherProposalRscWorkingInOrganizations.push({
            id: null,
            uuid: null,
            researcherProposalId: researchProposalInfo,
            researcherProfileId: null,
            researcherName: '',
            telephoneNo: '',
            age: '',
            occupation: '',
            isMainResearcher: false,
            mobileNo: '',
            emailAddress: '',
            nidNo: '',
            designation: '',
            educationQualification: '',
            isDeleted: 0,
            researcherTypeName: '',
            personalDigitalInformation: '',
            fileName: ''
        });
    }

    deleteNewRelativeForm(data: any, i: any) {
        if (data.id) {
            this.researcherProposalRscWorkingInOrganizations[i].isDeleted = 1;
        } else {
            this.researcherProposalRscWorkingInOrganizations.splice(i, 1);
        }
    }

    onSaveAndUpdate(next: boolean) {

        // if (!this.ekeckValidation(this.researcherProposalRscWorkingInOrganizations[this.researcherProposalRscWorkingInOrganizations.length - 1].emailAddress)) {
        //     this.canSave = true;
        //     return;
        // }

        this.spinner = true;
        this.researcherProposalRscWorkingInOrgService.onSaveOrUpdateList(this.researcherProposalRscWorkingInOrganizations.map(m => ({ ...m, researcherProposalId: this.existingProposalInfoId }))).subscribe(
            response => {
                if (response.success) {
                    this.researcherProposalRscWorkingInOrganizations = response.items ? response.items : [];
                    this.spinner = false;
                    this.canSave = true;
                    this.snackbarHelper.openSuccessSnackBar();
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                    this.canSave = true;
                }
            },
            error => {
                this.snackbarHelper.openErrorSnackBar();
                this.spinner = false;
                this.canSave = true;
            }
        );

    }

    getAllfindByResearcherProposalId(researcherProposalId: any) {
        this.spinner1 = true;
        this.researcherProposalRscWorkingInOrgService.getAllfindByResearcherProposalId(researcherProposalId).subscribe(
            response => {
                if (response.success) {
                    this.researcherProposalRscWorkingInOrganizations = response.items;
                }
                this.spinner1 = false;
            }
        );
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    ekeckValidation(data): boolean {
        if (!data) {
            return true;
        }

        const regExpStr = "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/";

        if (data.match(regExpStr)) {
            return true;

        } else {
            return false;

        }

        const result = data.match(regExpStr);
        if (!result) {
            return true;
        }
    }


    getAllByResearcherUserId(userId: any) {
        this.spinner2 = true;
        this.researcherProfileRscWorkingInOrgService.getAllByResearcherUserId(userId).subscribe(
            (response) => {
                if (response.success && response.items) {
                    this.researcherList = response.items;

                    this.researcherList.map(m => {
                        m.researcherName = `${m.researcherName} (${m.mobileNo})`
                        return m;
                    });
                } else {
                    this.addNewRow();
                }
                this.spinner2 = false;
            });
    }


    onChangeResearcherName(event, index) {

        let filter = this.researcherProposalRscWorkingInOrganizations.filter(f => f.researcherName === event && (!f.isDeleted || f.isDeleted != 1));

        if (filter.length > 1) {
            this.snackbarHelper.openErrorSnackBarWithMessage(ERROR, `${event} Allready Exist !.`);

            let researchProposalInfo;
            if (this.existingProposalInfo && this.existingProposalInfo.id) {
                researchProposalInfo = this.existingProposalInfo.id;
            }

            if (this.proposalInfo && this.proposalInfo.id) {
                researchProposalInfo = this.proposalInfo.id;
            }

            this.researcherProposalRscWorkingInOrganizations[index] = {
                id: this.researcherProposalRscWorkingInOrganizations[index].id,
                uuid: this.researcherProposalRscWorkingInOrganizations[index].uuid,
                researcherProposalId: researchProposalInfo,
                researcherProfileId: null,
                researcherName: '',
                telephoneNo: '',
                age: '',
                occupation: '',
                isMainResearcher: false,
                mobileNo: '',
                emailAddress: '',
                nidNo: '',
                designation: '',
                educationQualification: '',
                isDeleted: 0,
                researcherTypeName: '',
                personalDigitalInformation: '',
                fileName: ''
            }

            return;
        }

        let f = this.researcherList.find(f => f.researcherName == event);
        this.researcherProposalRscWorkingInOrganizations[index].researcherName = f.researcherName;
        this.researcherProposalRscWorkingInOrganizations[index].telephoneNo = f.telephoneNo;
        this.researcherProposalRscWorkingInOrganizations[index].age = f.age;
        this.researcherProposalRscWorkingInOrganizations[index].occupation = f.occupation;
        this.researcherProposalRscWorkingInOrganizations[index].mobileNo = f.mobileNo;
        this.researcherProposalRscWorkingInOrganizations[index].emailAddress = f.emailAddress;
        this.researcherProposalRscWorkingInOrganizations[index].nidNo = f.nidNo;
        this.researcherProposalRscWorkingInOrganizations[index].designation = f.designation;
        this.researcherProposalRscWorkingInOrganizations[index].educationQualification = f.educationQualification;
    }

    onChangeResearcherTypeName(event, index) {
        let f = this.researcherProposalRscWorkingInOrganizations.filter(f => f.researcherTypeName === 'Team Lead' && f.isDeleted != 1);

        if (f && f.length == 2) {
            setTimeout(() => { this.researcherProposalRscWorkingInOrganizations[index].researcherTypeName = null }, 100);
            this.snackbarHelper.openErrorSnackBarWithMessage(ERROR, 'Allready Team Leader Exist !.');
            return;
        }
        setTimeout(() => { this.researcherProposalRscWorkingInOrganizations[index].researcherTypeName = event; }, 100);
    }
}
