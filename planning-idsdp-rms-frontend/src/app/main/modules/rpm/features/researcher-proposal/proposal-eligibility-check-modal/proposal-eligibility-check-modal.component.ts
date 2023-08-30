import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ResearchProfileMultiFormService } from "../../../services/research-profile-multi-form.service";
import { UnsubscribeAdapterComponent } from "../../../../../core/helper/unsubscribeAdapter";
import { Router } from "@angular/router";
import { ResearchCategoryTypeService } from "../../../../settings/services/research-category-type.service";
import { ResearcherCategoryType } from "../../../enums/enum-list.enum";
import { ProposalEligibility } from "../../../models/ProposalEligibility";
import { addNewIcon, closeIcon } from '../../../constants/button.constants';
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ERROR } from 'app/main/core/constants/message';
import { DateAdapter } from '@angular/material/core';
import { ResearcherProposalSharedService } from '../../../services/researcher-proposal-shared.service';

@Component({
    selector: 'app-proposal-eligibility-check-modal',
    templateUrl: './proposal-eligibility-check-modal.component.html',
    styleUrls: ['./proposal-eligibility-check-modal.component.scss']
})
export class ProposalEligibilityCheckModalComponent extends UnsubscribeAdapterComponent implements OnInit {


    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    profileUuid: string;
    profile: any;
    eligibility: ProposalEligibility = {} as ProposalEligibility;
    selectedCategory: string;
    categoryType = ResearcherCategoryType;
    researchExperienceList: number[] = [];
    marks: number[] = [];
    categoryList = [];
    education = [];
    spinner = true;
    createProposal = false;
    closeIcon = closeIcon;
    addNewIcon = addNewIcon;

    checked: boolean = true;
    openMessage: Boolean = false;
    isInstitutional: Boolean = false;
    loginUserInfo: any;
    maxDate = new Date();

    constructor(@Inject(MAT_DIALOG_DATA) data: any,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private researchProfileMultiFormService: ResearchProfileMultiFormService,
        private researchCategoryTypeService: ResearchCategoryTypeService,
        private snackbarHelper: SnackbarHelper,
        private router: Router,
        private dateAdapter: DateAdapter<Date>,
        private researcherProposalSharedService: ResearcherProposalSharedService
    ) {
        super();
        this.profileUuid = data.uuid;
        this.isInstitutional = data.isInstitutional;
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
    }

    ngOnInit(): void {
        this.maxDate = new Date();
        if (this.isInstitutional) {
            this.selectedCategory = 'Institutional';
        }

        this.getResearchCategoryTypeList();
        this.getProfile();
    }

    private setResearchYearAndMarks() {
        let year = 8;
        while (year < 101) {
            this.researchExperienceList.push(year);
            year += 1;
        }
        let mark = 1;
        while (mark < 21) {
            this.marks.push(mark);
            mark += 1;
        }
    }

    private getProfile() {
        this.spinner = true;
        this.subscribe$.add(
            this.researchProfileMultiFormService.getEducationInfoByProfileUuid(this.profileUuid).subscribe(res => {

                if (res.success && res.obj) {
                    this.education = res.obj.educationInfoList;
                    this.profile = res.obj;
                    this.eligibility.age = res.obj.age;
                    this.eligibility.empType = res.obj.employeeType;
                    this.eligibility.mphil = res.obj.mphil;
                    this.eligibility.phd = res.obj.phd;
                    this.eligibility.masters = res.obj.masters;
                    this.eligibility.researcherExperience = res.obj.totalResearch;
                    this.eligibility.isGraduate = res.obj.educationInfoList.some(f => f.certificationName === 'Graduate');
                    this.eligibility.isPhd = res.obj.educationInfoList.some(f => f.certificationName === 'PhD');
                    this.eligibility.isMphil = res.obj.educationInfoList.some(f => f.certificationName === 'MPhil');
                }
                this.spinner = false;
            })
        );
    }

    getResearchCategoryTypeList() {
        this.spinner = true;
        this.researchCategoryTypeService.getAllActiveList().subscribe(
            res => {
                if (res.success) {
                    this.categoryList = res.items ? res.items : [];
                    if (!this.isInstitutional) {
                        this.categoryList = this.categoryList.filter(f => f.categoryName != 'Institutional');
                    }
                }
                this.spinner = false;
            }
        );
    }

    onChangeCategory() {
        this.createProposal = false;
        this.eligibility = new ProposalEligibility();
        this.eligibility.age = this.profile.age;
        this.eligibility.empType = this.profile.employeeType;
        this.eligibility.mphil = this.profile.mphil;
        this.eligibility.phd = this.profile.phd;
        this.eligibility.masters = this.profile.masters;
        this.eligibility.researcherExperience = this.profile.totalResearch;
        this.eligibility.isGraduate = this.education.some(f => f.certificationName === 'Graduate');
        this.eligibility.isPhd = this.education.some(f => f.certificationName === 'PhD');
        this.eligibility.isMphil = this.education.some(f => f.certificationName === 'MPhil');
        this.validityCheck();
        // this.getYearNew();
    }

    validityCheck() {
        if (this.selectedCategory === this.categoryType.FELLOWSHIP) {
            this.createProposal = !!((this.eligibility.researcherExperience > 7) || this.eligibility.isMphil || this.eligibility.isPhd);
        } else if (this.selectedCategory === this.categoryType.INSTITUTIONAL) {
            // this.createProposal = !!(this.eligibility.mphil && this.eligibility.phd && this.eligibility.masters);
            this.createProposal = !!(this.eligibility.phd && this.eligibility.masters);
        } else if (this.selectedCategory === this.categoryType.MPHIL) {
            this.createProposal = !!(this.eligibility.mPhilRegNo && this.getYearNew());
        } else if (this.selectedCategory === this.categoryType.PHD) {
            this.createProposal = !!(this.eligibility.phdRegNo && this.getYearNew());
        } else if (this.selectedCategory === this.categoryType.PROMOTIONAL) {
            if (this.eligibility.age && this.eligibility.empType === 1 && this.eligibility.isGraduate) {
                this.createProposal = true;
            } else this.createProposal = (this.eligibility.age < 40 && (this.eligibility.empType === 0 || this.eligibility.empType === 2) && this.eligibility.isGraduate);
        }
    }

    private getYear(): number {
        const diffDays = (startDate, endDate) => Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
        const totalDays: number = diffDays(new Date(this.eligibility.regYear), new Date());
        return Math.floor(totalDays / 365);
    }

    private getYearNew(): Boolean {

        let reduse = ((new Date().getMonth() + 1) <= 6) ? 3 : 2;

        let fistFiscalYear = { 'strDate': new Date(`${new Date().getFullYear() - reduse}-07-01`), 'endDate': new Date(`${new Date().getFullYear() - (reduse - 1)}-06-30`) }
        let secendFiscalYear = { 'strDate': new Date(`${new Date().getFullYear() - (reduse - 1)}-07-01`), 'endDate': new Date(`${new Date().getFullYear()}-06-30`) }

        let result1 = this.dateCheck(fistFiscalYear.strDate, fistFiscalYear.endDate, new Date(this.eligibility.regYear));
        let result2 = this.dateCheck(secendFiscalYear.strDate, secendFiscalYear.endDate, new Date(this.eligibility.regYear));

        if (result1 || result2) {
            return true;
        }

        return false;
    }

    dateCheck(from, to, check) {
        var fDate, lDate, cDate;
        fDate = Date.parse(from);
        lDate = Date.parse(to);
        cDate = Date.parse(check);

        if ((cDate <= lDate && cDate >= fDate)) {
            return true;
        }

        return false;
    }

    addNewProposal() {
        const result = this.categoryList.find(s => s.categoryName === this.selectedCategory);
        if (!result) {
            return;
        }
        this.researcherProposalSharedService.setData('categoryId', result.id);
        //this.router.navigate(['researcher-proposal-informationn/' + this.profileUuid + "/" + result.id]);
        this.router.navigate(['researcher-proposal-informationn/' + this.profileUuid]);
        this.close();
    }

    close() {
        this.closeEventEmitter.emit(true);
    }


    eligibilityChecker() {
        if (!this.selectedCategory) {
            this.snackbarHelper.openErrorSnackBarWithMessage('Please select a category first !.', ERROR);
            return;
        }
        this.openMessage = this.openMessage ? false : true;
    }
}

