import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';
import { locale as lngEnglish } from '../../i18n/en';
import { locale as lngBangla } from '../../i18n/bn';
import { RelativeFormModel } from '../../../../models/RelativeFormModel';
import { ResearchProfileMultiFormService } from '../../../../services/research-profile-multi-form.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-relative-info',
    templateUrl: './relative-info.component.html',
    styleUrls: ['./relative-info.component.scss'],
})
export class RelativeInfoComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    frmGroup: FormGroup;
    relativeFormModelList: RelativeFormModel[] = new Array();
    isPhonNumberDuplicate: boolean;
    subject = new BehaviorSubject(false);

    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    id: number;
    uuid: any;
    declaration: boolean;
    spinner: boolean;
    spinner1: boolean;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    validMobile = "^((\\+91-?)|0)?[0-9]{10}$";

    /*----/Button---*/
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private router: Router,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private matDialog: MatDialog,
        private _location: Location
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.uuid = this._activatedRoute.snapshot.paramMap.get('id');
        this.id = +this._activatedRoute.snapshot.paramMap.get('uid');

        if (this.uuid != null) {
            this.isUpdatedAction = true;
            this.getDataByUuid(this.uuid);
            // this.getProfileDataByUuid(this.uuid);
        } else {
            this.isUpdatedAction = false;
            this.addNewRelativeForm();
        }
        this.subject.subscribe(
            r => {
                if (r) {
                    this._toastrService.warning(
                        'Phon number already used !.',
                        'Warning',
                        this.config);
                }
            }
        );
    }

    getDataByUuid(uuid: string) {

        if (!this.uuid && localStorage.getItem("profilePersonalInfoUuid") == null) {
            setTimeout(() => { this.addNewRelativeForm() }, 100);
            return;
        }

        this.spinner1 = true;
        let finalUuid = uuid ? uuid : localStorage.getItem("profilePersonalInfoUuid");

        this._researchProfileMultiFormService.profileView(finalUuid).subscribe(
            (data) => {
                this.declaration = data.personalInfo.declaration;
                if (data.relativeInfos.length > 0) {
                    this.relativeFormModelList = data.relativeInfos;
                } else {
                    this.relativeFormModelList = [];
                    setTimeout(() => { this.addNewRelativeForm(); }, 100);
                }
                this.spinner1 = false;
            },
            (error) => {
                console.log('Successfully not saved');
                this.spinner1 = false;
            }
        );
    }

    save() {

        if (!this.declaration) {
            this._toastrService.error(
                'Declaration is required', '', this.config
            );
            return;
        }

        if (localStorage.getItem("profilePersonalInfoId") != null) {
            this.id = +(localStorage.getItem("profilePersonalInfoId"));
            this.isUpdatedAction = true;
        }

        if (!this.id) {
            const pathSegments = this._location.path().split('/');
            this.uuid = pathSegments[2];
            this.id = +pathSegments[4];
        }

        if (!this.id) {
            this._toastrService.error('Personal information save first');
            return;
        }

        if (!this.isUpdatedAction) {
            this._researchProfileMultiFormService
                .saveData(this.relativeFormModelList, null, 'RelativeInfo')
                .subscribe(
                    (data) => {
                        if (data.success) {
                            this._toastrService.success(data.message, '', this.config);

                            this.updateDeclaration(localStorage.getItem('profilePersonalInfoUuid'), this.declaration)
                        } else {
                            this._toastrService.error(
                                data.message,
                                '',
                                this.config
                            );
                        }
                    },
                    (error) => {
                        this._toastrService.error(
                            'Save unsuccessful',
                            '',
                            this.config
                        );
                    }
                );
        } else {
            this._researchProfileMultiFormService
                .updateDataByTabName(
                    this.id,
                    this.relativeFormModelList,
                    null,
                    'RelativeInfo'
                )
                .subscribe(
                    (data) => {
                        if (data.success) {
                            this.updateDeclaration(this.uuid, this.declaration)
                            this._toastrService.success(
                                data.message,
                                '',
                                this.config
                            );
                            this.backToList();
                        } else {
                            console.log('Successfully not saved');
                            this._toastrService.error(
                                'Save unsuccessful',
                                '',
                                this.config
                            );
                        }
                    },
                    (_) => {
                        console.log('Successfully not saved');
                        this._toastrService.error(
                            'Save unsuccessful',
                            '',
                            this.config
                        );
                    }
                );
        }
    }

    saveAndNext() {
        this.save();
        this.nextTab();
    }

    backToList() {
        this.router.navigate(['/researcher-profile-information']);
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

    addNewRelativeForm() {
        this.relativeFormModelList.push({
            id: null,
            uuid: null,
            profilePersonalInfoId: null,
            name: '',
            email: '',
            phoneNo: '',
            presentAddress: '',
            permanentAddress: '',
            nid: '',
            isEditable: false,
            isDeleted: 0
        });
    }



    deleteNewRelativeForm(index: number) {
        if (this.relativeFormModelList[index].uuid) {
           // this.relativeFormModelList[index].isDeleted = 1;
            this.openDialog(index);
        } else {
            this.relativeFormModelList.splice(index, 1);
        }

        // setTimeout(() => {
        //     let f = this.relativeFormModelList.filter(f => f.isDeleted != 1);
        //     if (f.length == 0) {
        //         this.addNewRelativeForm();
        //     }
        // }, 100);
    }

    private updateDeclaration(profilePersonalInfoId: any, declaration: any) {
        const data = {
            "id": profilePersonalInfoId,
            "declaration": declaration
        }
        this._researchProfileMultiFormService
            .updateDeclaration(data)
            .subscribe(
                (data) => {
                    if (data.success) {
                        localStorage.removeItem("profilePersonalInfoId");
                        localStorage.removeItem("profilePersonalInfoUuid");
                        this.backToList();
                        this._toastrService.success(
                            data.message,
                            '',
                            this.config
                        );
                    } else {
                        this._toastrService.error(
                            data.message,
                            '',
                            this.config
                        );
                    }
                },
                (error) => {
                    this._toastrService.error(
                        'Save unsuccessful',
                        '',
                        this.config
                    );
                }
            );
    }

    getProfileDataByUuid(uuid: string) {
        this._researchProfileMultiFormService.profileView(uuid).subscribe(data => {
            this.declaration = data.personalInfo.declaration;
        }, error => {
            console.log('Successfully not saved');
        })
    }

    saveAndView(){
        let uuid = this._activatedRoute.snapshot.paramMap.get('id');
        let uId = +this._activatedRoute.snapshot.paramMap.get('uid');
        if (!uuid && !uId) {
            const pathSegments = this._location.path().split('/');
            uuid = pathSegments[2];
            uId = +pathSegments[4];
        }
        this.router.navigate(['/researcher-profile-information/'+uuid+'/'+uId+'/false/view']);
    }

    onSave(saveAndNext=0) {

        // this.relativeFormModelList = this.relativeFormModelList.filter(f => f.name != "");

        // if (this.relativeFormModelList.length == 0) {
        //     setTimeout(() => { this.addNewRelativeForm() }, 100);
        //     return;
        // }

        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        if (!this.declaration) {
            this._toastrService.error(
                'Declaration is required'
            );
            return;
        }

        if (localStorage.getItem("profilePersonalInfoId") != null) {
            this.id = +(localStorage.getItem("profilePersonalInfoId"));
            this.isUpdatedAction = true;
        }

        if (!this.id) {
            this._toastrService.error(
                'Profile is not found !.'
            );
            return;
        }

        this.relativeFormModelList = this.relativeFormModelList.map(m => {
            m.profilePersonalInfoId = this.id;
            m.isDeleted = m.isDeleted ? 1 : 0;
            return m;
        });
        this.spinner = true;

        this._researchProfileMultiFormService.saveDataNew(this.relativeFormModelList, null, 'RelativeInfo').subscribe(
            (data) => {
                if (data.success) {
                    this._toastrService.success(
                        data.message,
                        '',
                        this.config);
                    this.spinner = false;

                    if(saveAndNext == 1){
                        this.saveAndView();
                    }

                    this.getDataByUuid(this.uuid);
                } else {
                    this.spinner = false;
                    this._toastrService.error(
                        data.message,
                        '',
                        this.config
                    );
                }
            },
            (error) => {
                this.spinner = false;
                this._toastrService.error(
                    'Save unsuccessful',
                    '',
                    this.config
                );
            }
        );


    }


    checkRequirdField(): Boolean {
        let isValied = true;
        this.relativeFormModelList.forEach(f => {
            if (!f.name || !f.phoneNo || !f.permanentAddress || !f.nid) {
                return isValied = false;
            }
        });
        return isValied;
    }

    checkUniquePhonNumber(phonNumber, index) {
        let result = this.relativeFormModelList.filter(f => f.isDeleted != 1).filter(f => f.phoneNo == phonNumber);
        if (result.length == 2) {
            this.isPhonNumberDuplicate = true;
        } else {
            this.isPhonNumberDuplicate = false;
        }
        this.subject.next(this.isPhonNumberDuplicate);
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
                this.relativeFormModelList[i].isDeleted = 1;
                this.onSave();
            }
            dialogRef.close(true);
        });
    }


}
