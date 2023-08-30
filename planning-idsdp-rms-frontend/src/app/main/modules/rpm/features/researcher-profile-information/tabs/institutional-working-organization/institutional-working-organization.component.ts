import {
    Component,
    EventEmitter, OnInit,
    Output,
    QueryList, ViewChildren
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { UnsubscribeAdapterComponent } from 'app/main/core/helper/unsubscribeAdapter';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { ResearcherProposalRscWorkingInOrganization } from 'app/main/modules/rpm/models/ResearcherProposalRscWorkingInOrganization';
import { ResearcherProfileRscWorkingInOrgService } from 'app/main/modules/rpm/services/researcher-profile-rsc-working-in-org.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from 'ngx-toastr';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';
import {Location} from "@angular/common";

@Component({
    selector: 'app-institutional-working-organization',
    templateUrl: './institutional-working-organization.component.html',
    styleUrls: ['./institutional-working-organization.component.scss'],
})
export class InstitutionalWorkingOrganizationComponent extends UnsubscribeAdapterComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();


    @ViewChildren('phoneMobileNo') phonNoList!: QueryList<any>;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    existingProposalInfoId: number;
    spinner: boolean = true;
    researcherProfileRscWorkingInOrganizations: ResearcherProposalRscWorkingInOrganization[] = [];
    canSave: boolean = true;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    profileId: number;
    profileUuid: string;

    // for upload document ========
    documentTypeList: any[] = [];
    updatedFileList: any[] = [];
    fileList: File[] = new Array();

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private researcherProfileRscWorkingInOrgService: ResearcherProfileRscWorkingInOrgService,
        private snackbarHelper: SnackbarHelper,
        private _activatedRoute: ActivatedRoute,
        private _route: Router,
        private matDialog: MatDialog,
        private _toastrService: ToastrService,
        private _location: Location
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.profileId = Number(
            this._activatedRoute.snapshot.paramMap.get('uid')
        );
        console.log('profileId' + this.profileId)
        this.profileUuid = this._activatedRoute.snapshot.paramMap.get('id');
        console.log('profileUuid' + this.profileUuid)
        this.getAllByResearcherProfileId(this.profileId);
        this.spinner = false;
    }

    // add new button
    addNewRow() {
        this.researcherProfileRscWorkingInOrganizations.push({
            id: null,
            uuid: null,
            researcherProposalId: null,
            researcherProfileId: this.profileId,
            researcherName: '',
            age: '',
            occupation: '',
            telephoneNo: '',
            mobileNo: '',
            emailAddress: '',
            nidNo: '',
            designation: '',
            educationQualification: '',
            isDeleted: 0,
            isMainResearcher: false,
            researcherTypeName: '',
            personalDigitalInformation: '',
            fileName: ''
        });
    }

    checkFieldValidation() {
        let isValied = true;
        this.researcherProfileRscWorkingInOrganizations.forEach(f => {
            if (!(f.researcherName || f.designation) || !f.age || !f.occupation || !f.mobileNo || !f.emailAddress || !f.nidNo || !f.educationQualification) {
                return isValied = false;
            }
        });
        return isValied;
    }

    onSubmit(isView: boolean) {
        if (!this.profileId) {
            const pathSegments = this._location.path().split('/');
            this.profileUuid = pathSegments[2];
            this.profileId = +pathSegments[4];
            this.researcherProfileRscWorkingInOrganizations[0].researcherProfileId = this.profileId ? this.profileId : null;
        }
        if (!this.profileId) {
            this._toastrService.error('Institute information save first');
            return
        }

        if (this.checkRequirdField()) {
            this.onSaveAndUpdate(isView);
        }
        else {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return 0;
        }
    }

    deleteNewRelativeForm(data: any, i: any) {
        if (data.id) {
            // this.researcherProfileRscWorkingInOrganizations[i].isDeleted = 1;
            this.openDialog(i);
        } else {
            this.researcherProfileRscWorkingInOrganizations.splice(i, 1);
        }
    }

    onSaveAndUpdate(isView: boolean) {

        let lastIndex = 0;

        if (this.researcherProfileRscWorkingInOrganizations.length > 0) {
            lastIndex = this.researcherProfileRscWorkingInOrganizations.length - 1;
        }


        if (!this.researcherProfileRscWorkingInOrganizations[lastIndex].researcherName || !this.researcherProfileRscWorkingInOrganizations[lastIndex].designation || !this.researcherProfileRscWorkingInOrganizations[lastIndex].age || !this.researcherProfileRscWorkingInOrganizations[lastIndex].occupation || !this.researcherProfileRscWorkingInOrganizations[lastIndex].mobileNo || !this.researcherProfileRscWorkingInOrganizations[lastIndex].emailAddress || !this.researcherProfileRscWorkingInOrganizations[lastIndex].nidNo || !this.researcherProfileRscWorkingInOrganizations[lastIndex].educationQualification) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        this.canSave = false;
        this.spinner = true;
        this.researcherProfileRscWorkingInOrgService
            .onSaveOrUpdateList(
                this.researcherProfileRscWorkingInOrganizations.map((m) => ({
                    ...m,
                    researcherProposalId: this.existingProposalInfoId,
                })),
                this.fileList, this.updatedFileList
            )
            .subscribe(
                (response) => {
                    if (response.success) {
                        this.researcherProfileRscWorkingInOrganizations = response.items ? response.items : [];
                        this.spinner = false;
                        this.canSave = true;
                        this.snackbarHelper.openSuccessSnackBar();
                        if (isView) {
                            this.navigateToView(this.profileUuid);
                        }
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                        this.spinner = false;
                        this.canSave = true;
                    }
                },
                (error) => {
                    console.log('error ==== >>>> ', error);
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                    this.canSave = true;
                }
            );
    }

    getAllByResearcherProfileId(researcherProfileId: any) {
        this.spinner = true;
        this.researcherProfileRscWorkingInOrgService
            .getAllByResearcherProfileId(researcherProfileId)
            .subscribe((response) => {
                if (response.success && response.items) {
                    this.researcherProfileRscWorkingInOrganizations = response.items;
                } else {
                    this.addNewRow();
                }
                this.spinner = false;
            });
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

    navigateToView(uuid: string) {
        this._route.navigate(['researcher-profile-information/' + uuid + '/true/view']);
    }

    checkValidation(data): boolean {
        if (!data) {
            return true;
        }
        const regExpStr = '/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/';
        if (data.match(regExpStr)) {
            return true;
        } else {
            return false;
        }
    }

    handleFileInput(file: FileList, index: number, id: number) {
        this.fileList.push(file.item(0));
        this.researcherProfileRscWorkingInOrganizations[index].fileName = file.item(0) ? file.item(0).name : '';
        this.updatedFileList[index] = id ? id : 1000 + index;
    }


    private openDialog(i) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.researcherProfileRscWorkingInOrganizations[i].isDeleted = 1;
                this.onSaveAndUpdate(false);
            }
            dialogRef.close(true);
        });
    }


    // let text = this.researcherProfileRscWorkingInOrganizations[lastIndex].mobileNo;
    // console.log('text ----- >>>>> ', text);
    // let pattern = /^((\\+91-?)|0)?[0-9]{10}$/;
    // let result = pattern.test(text);
    // console.log('result ---- >>>> ', result);


    checkRequirdField(): Boolean {
        let isValied = true;
        this.researcherProfileRscWorkingInOrganizations.forEach(f => {
            if (!(f.researcherName) ||
            !(f.designation) ||
            !(f.age) ||
            !(f.occupation) ||
            !(f.mobileNo) ||
            !(f.emailAddress) ||
            !(f.nidNo) ||
            !(f.personalDigitalInformation) ||
            !(f.fileName) ||
            !(f.educationQualification)) {
                return isValied = false;
            }
            // let text = f.mobileNo;
            // let pattern = /^((\\+91-?)|0)?[0-9]{10}$/;
            // let result = pattern.test(text);
            // if (!result && !f.isDeleted) {
            //     return isValied = false;
            // }
        });
        return isValied;
    }


}
