import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { FiscalYearServiceService } from 'app/main/modules/settings/services/fiscal-year-service.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    previousIcon,
    printIcon,
    viewIcon
} from '../../../constants/button.constants';
import { JasperServiceService } from '../../../services/jasper-service.service';
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { ResearcherListService } from '../../../services/researcher-list.service';
import { locale as lngBangla } from '../i18n/bn';
import { locale as lngEnglish } from '../i18n/en';

@Component({
    selector: 'app-researcher-profile',
    templateUrl: './researcher-profile.component.html',
    styleUrls: ['./researcher-profile.component.scss']
})
export class ResearcherProfileComponent implements OnInit {

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    /*----/Button---*/

    id: any;
    tabData: any;

    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;

    spinner5: boolean = false;
    spinner6: boolean = false;
    spinner7: boolean = false;
    spinner8: boolean = false;
    spinner9: boolean = false;

    isFinalSubmit: boolean = false;
    langVal: string;

    researcherData: any = {};
    profileUuId: string;
    fiscalYearsList: any[];
    userList: any[] = [];
    userDetails: any;
    inProfileNotFound: boolean;

    statusData = {
        id: null,
        educationInfoId: null,
        professionalExpId: null,
        publicationInfoId: null,
        relativeInfoId: null,
        researchExpId: null,
        trainingInfoId: null,
        rscWorkingInOrgId: null,
    }

    status: number = 0 | 0;
    status1: boolean = false;
    advertisementEndDate: string;
    advertisementStartDate: string;

    constructor(
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private dialog: MatDialog,
        private _researcherListService: ResearcherListService,
        private fiscalYearService: FiscalYearServiceService,
        private _userListService: UserListServiceService,
        private storageService: StorageService,
        private matSnackBar: SnackbarHelper,
        private jasperService: JasperServiceService,
        private dataCom: DataComService
    ) {
        // Language translations
        this.langVal = localStorage.getItem("currentLang")
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
    }

    ngOnInit(): void {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var storeSessionId = url.searchParams.get("p");
        if(storeSessionId){
            this._router.navigateByUrl('/researcher/profile');
        }

        this.userDetails = this.storageService.getUserData();
        this.getProfileByUserId((profileUuId) => {
            if (profileUuId) {
                this.getProfileData(profileUuId);
                this.getProfileStatusFindByUuid(profileUuId);
            }
        });

        this.getFiscalYearWiseSectorSubSector();
        this.getFiscalYearList();
        this.getUserList();
    }

    print() {
    }

    getProfileData(profileUuId: string) {
        this.spinner = true;
        this._researcherListService.resercherProfileDate(profileUuId).subscribe(
            response => {
                if (response.success) {
                    this.spinner = false;
                    this.researcherData = response.model;
                } else {
                    this.spinner = false;
                }
            },
            error => {
                //console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    getFiscalYearList() {
        this.spinner5 = true;
        this.fiscalYearService.getAllActive().subscribe(res => {
            this.fiscalYearsList = res.items ? res.items : [];
            this.spinner5 = false;
        });
    }

    showFiscalYear(id: number) {
        if (!id) {
            return '';
        }
        let data = this.fiscalYearsList.find(f => f.id == id);
        if (data) {
            return data.fiscalYear;
        }
        return '';
    }

    getUserList() {
        this._userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
            }
        );
    }

    showUserName(userId: number) {
        if (!userId) {
            return '';
        }

        return this.userList.find(f => f.id == userId) ? this.userList.find(f => f.id == userId).name : '';
    }

    getProfileByUserId(callBack) {
        // this.userDetails.id
        this.spinner4 = true;
        this._researchProfileMultiFormService.findByUserId(this.userDetails.id).subscribe(
            response => {
                if (response && response.uuid) {
                    callBack(response.uuid);
                    this.spinner4 = false;
                    this.isFinalSubmit = false;
                    this.inProfileNotFound = false;
                } else {
                    //this.matSnackBar.openErrorSnackBarWithMessage('User profile not found !.', ERROR);
                    callBack(null);
                    this.spinner4 = false;
                    this.isFinalSubmit = true;
                    this.inProfileNotFound = true;
                }
            },
            error => {
                //this.matSnackBar.openErrorSnackBarWithMessage('User profile not found !.', ERROR);
                callBack(null);
                this.spinner4 = false;
                this.inProfileNotFound = true;
            }
        );
    }

    getFiscalYearWiseSectorSubSector() {
        this.spinner2 = true;
        this.jasperService.advertiseDateValidity().subscribe(
            validRes => {
                if (!validRes.success) {
                    //  this.matSnackBar.openWarnSnackBarWithMessage(validRes.message, OK);
                }
                if (validRes.success) {
                    this.status1 = true;
                    this.advertisementEndDate = validRes.advertisementEndDate;
                    this.advertisementStartDate = validRes.advertisementStartDate;
                }
                this.spinner2 = false;
            });
        this.spinner2 = false;
    }

    getProfileStatusFindByUuid(profileId) {
        this.spinner3 = true;
        this._researchProfileMultiFormService.getProfileStatusFindByUuid(profileId).subscribe(
            response => {

                if (response.success) {
                    this.statusData = response.obj;
                    this.calculation();
                }
                else {
                }
                this.spinner3 = false;
            },
            error => {
                this.spinner3 = false;
            }
        );
    }

    calculation() {


        if (!this.userDetails.isInstitutional) {

            if (this.statusData.id) {
                this.status += 20;
            }
            if (this.statusData.educationInfoId) {
                this.status += 20;
            }
            if (this.statusData.publicationInfoId) {
                this.status += 10;
            }
            if (this.statusData.professionalExpId) {
                this.status += 15;
            }
            if (this.statusData.researchExpId) {
                this.status += 15;
            }
            if (this.statusData.trainingInfoId) {
                this.status += 10;
            }
            if (this.statusData.relativeInfoId) {
                this.status += 10;
            }
        }


        if (this.userDetails.isInstitutional) {

            if (this.statusData.id) {
                this.status += 70;
            }
            if (this.statusData.rscWorkingInOrgId) {
                this.status += 30;
            }

        }

        // this.status = 100;
    }

    editProfile() {
        this._router.navigate(['researcher-profile-information']);
    }

    goToResearcherProposalList() {
        this._router.navigate(['researcher/list']);
    }


}
