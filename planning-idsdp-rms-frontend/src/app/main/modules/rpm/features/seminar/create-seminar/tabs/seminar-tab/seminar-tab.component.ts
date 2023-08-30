import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { DateAdapter } from '@angular/material/core';
import { MatSelectChange } from "@angular/material/select";
import { ActivatedRoute } from "@angular/router";
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { MemberInSeminarModel } from 'app/main/modules/rpm/models/MemberInSeminarModel';
import { MemberInSeminarService } from 'app/main/modules/rpm/services/member-in-seminar.service';
import { SectorTypeService } from 'app/main/modules/settings/services/sector-type.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../../../../../../environments/environment";
import { ApiService } from "../../../../../../../core/services/api/api.service";
import { FuseTranslationLoaderService } from "../../../../../../../core/services/translation-loader.service";
import { AuthService } from "../../../../../../auth/services/auth.service";
import { FiscalYearServiceService } from "../../../../../../settings/services/fiscal-year-service.service";
import { PredefinedTemplateServiceService } from "../../../../../../settings/services/predefined-template-service.service";
import { TemplateTypeServiceService } from "../../../../../../settings/services/template-type-service.service";
import { SeminarModelForCreate } from "../../../../../models/SeminarModelForCreate";
import { SeminarService } from "../../../../../services/seminar.service";
import { locale as lngBangla } from "../../../i18n/bn";
import { locale as lngEnglish } from "../../../i18n/en";

@Component({
    selector: 'app-seminar-tab',
    templateUrl: './seminar-tab.component.html',
    styleUrls: ['./seminar-tab.component.scss']
})
export class SeminarTabComponent implements OnInit {

    fileToUpload: { id: number, file: File }[] = [];
    @ViewChild('myForm') mytemplateForm: FormBuilder;

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    seminarModelForCreate: SeminarModelForCreate = new SeminarModelForCreate();

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    profileImageName: string = null;
    signImageName: string = null;

    fiscalYearList: any[] = [];
    preDefineTemplateList: any[] = [];
    templateType: [] = [];

    presentationTypeList: [] = [];
    presentationStatusList: [] = [];
    programNatureList: [] = [];
    userList: any[] = [];
    sectorList:any[] = [];

    id: any;
    uuid: any;

    spinner: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;


    spinner7: boolean = false;
    spinner8: boolean = false;
    spinner9: boolean = false;
    spinner10: boolean = false;

    configCk: any = {
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
    };

    canExpand: boolean = true;
    memberInSeminarModel: MemberInSeminarModel = new MemberInSeminarModel();
    memberInSeminarList: MemberInSeminarModel[] = [];
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private toastr: ToastrService,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private templatetypeservice: TemplateTypeServiceService,
        private _predefinedTemplateServiceService: PredefinedTemplateServiceService,
        private _fiscalYearService: FiscalYearServiceService,        
        private api: ApiService,
        private _seminarService: SeminarService,
        private dateAdapter: DateAdapter<Date>,
        private userListService: UserListServiceService,
        private memberInSeminarService: MemberInSeminarService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy

        // this.getFiscalYearList();
        // this.getCommonTypeListData();
        this.loadPredefinedData();
    }

    ngOnInit(): void {
        this.id = this._activatedRoute.snapshot.paramMap.get('id');
        this.uuid = this._activatedRoute.snapshot.paramMap.get('uuid');

        if (this.uuid) {
            this.getDataByUuid();
            this.memberInSeminarService.getAllBySeminarId(this.id).subscribe(
                response => {
                    this.memberInSeminarList = response.items ? response.items : [];
                }
            );
        } else {
            this.seminarModelForCreate.seminarNo = Math.floor((Math.random() * 1000000) + 1);
        }
        this.getTemplateType();
        this.getUserList();

        // if (this.uuid != null) {
        //     this.isUpdatedAction = true;
        //     this.getDataByUuid();
        // } else {
        //     this.isUpdatedAction = false;
        //     this.seminarModelForCreate.seminarNo = Math.floor((Math.random() * 1000000) + 1);
        // }
        // this.getTemplateType();
    }

    // getCommonTypeListData() {
    //     this.spinner3 = true;
    //     const baseUrl = environment.ibcs.rmsConfigurationBackend + 'api/common-type/';
    //     const getUrl = baseUrl + 'get-list';
    //     this.api.get(getUrl).subscribe(
    //         res => {
    //             if (res.success && res.items) {

    //                 this.presentationTypeList = res.items.filter(f => f.typeNo == 4);
    //                 this.presentationStatusList = res.items.filter(f => f.typeNo == 6);
    //                 this.programNatureList = res.items.filter(f => f.typeNo == 5);

    //             }
    //             this.spinner3 = false;
    //         },
    //         error => {
    //             this.spinner3 = false;
    //         }
    //     );
    // }

    getTemplateType() {
        this.spinner4 = true;
        this.templatetypeservice.getAllActive().subscribe(
            res => {
                if (res) {
                    this.templateType = res.items;
                }
                this.spinner4 = false;
            },
            error => {
                this.spinner4 = false;
                this.toastr.error('Http Error Happened Template Type !.', "", this.config)
            });
    }

    changeTemplateType($event: MatSelectChange) {

        let status = $event.value;
        if (status != null || status != "") {
            this.spinner5 = true;
            this._predefinedTemplateServiceService.getByTemplateTypeId(status).subscribe(
                res => {
                    if (res.success) {
                        this.preDefineTemplateList = res.items;
                    }
                    this.spinner5 = false;
                },
                error => {
                    this.toastr.error('Http Error Happened Predefined template !.', "", this.config);
                    this.spinner5 = false;
                });
        }
    }

    handleFileInput(files: FileList, index: number) {
        if (index === 0) {
            this.profileImageName = ''
        } else if (index === 1) {
            this.signImageName = ''
        }
        //this.personalInfoFormModel.profileImage = files.item(0);
        //this.fileToUpload = files.item(0);
        this.fileToUpload.push({ id: index, file: files.item(0) });
        // {id:this.in}
    }

    // XXgetFiscalYearList() {

    loadPredefinedData() {
        this.spinner6 = true;
        this._fiscalYearService.getAllActive().subscribe(
            res => {                
                let fiscalYearList = this.fiscalYearList = res.items ? res.items : [];                
                this.spinner6 = false;
            },
            error => {
                this.spinner6 = false;
            }
        );
                        
        const baseUrl = environment.ibcs.rmsConfigurationBackend + 'api/common-type/';
        const getUrl = baseUrl + 'get-list';
        this.api.get(getUrl).subscribe(
            res => {
                if (res.success && res.items) {
                    this.presentationTypeList = res.items.filter(f => f.typeNo == 4);
                    this.presentationStatusList = res.items.filter(f => f.typeNo == 6);
                    this.programNatureList = res.items.filter(f => f.typeNo == 5);

                }
                this.spinner6 = false;
            },
            error => {
                this.spinner6 = false;
            }
        );
    }

    // saveAndUpdate() {
    //     if (!this.isUpdatedAction) {
    //         this._seminarService.saveSeminar(this.seminarModelForCreate).subscribe(
    //             res => {
    //                 if (res.success) {
    //                     localStorage.setItem('seminarId', res.obj.id);
    //                     console.log(res.obj.id)
    //                     this._toastrService.success(res.message, "Success!", this.config);
    //                 } else {
    //                     this._toastrService.error(res.message, "Save failed!", this.config);
    //                 }
    //             },
    //             error => {
    //                 this._toastrService.error('Smoothing want to wrong!', "", this.config);
    //             }
    //         )
    //     } else {
    //         console.log(this.seminarModelForCreate)

    //         this._seminarService.updateSeminar(this.seminarModelForCreate).subscribe(
    //             res => {
    //                 if (res.success) {
    //                     this._toastrService.success(res.message, "Success!", this.config);
    //                 }
    //             },
    //             error => {
    //                 this._toastrService.error('Smoothing want to wrong!', "", this.config);
    //             }
    //         )
    //         // TODO: UPDATE HERE
    //     }
    // }


    saveAndUpdate() {

        if (!this.seminarModelForCreate.subject || !this.seminarModelForCreate.stFiscalYearId || !this.seminarModelForCreate.letterType || !this.seminarModelForCreate.roomName) {
            return;
        }

        if (this.seminarModelForCreate.id) {
            this.onUpdate();
        } else {
            this.onSave();
        }
    }



    onSave() {
        this.spinner2 = true;
        this._seminarService.saveSeminar(this.seminarModelForCreate).subscribe(
            res => {
                if (res.success) {
                    this.seminarModelForCreate = { ...res.obj };
                    localStorage.setItem('seminarId', res.obj.id);
                    this._toastrService.success(res.message, "Success!", this.config);
                    this.spinner2 = false;
                    this.onSaveAndUpdateMember();
                } else {
                    this._toastrService.error(res.message, "Save failed!", this.config);
                    this.spinner2 = false;
                }
            },
            error => {
                this._toastrService.error('Smoothing want to wrong!', "", this.config);
                this.spinner2 = false;
            }
        )
    }

    onUpdate() {
        this.spinner2 = true;
        this._seminarService.updateSeminar(this.seminarModelForCreate).subscribe(
            res => {
                if (res.success) {
                    this.seminarModelForCreate = { ...res.obj };
                    localStorage.setItem('seminarId', res.obj.id);
                    this._toastrService.success(res.message, "Success!", this.config);
                    this.spinner2 = false;
                    this.onSaveAndUpdateMember();
                } else {
                    this._toastrService.error(res.message, "Save failed!", this.config);
                    this.spinner2 = false;
                }
            },
            error => {
                this._toastrService.error('Smoothing want to wrong!', "", this.config);
                this.spinner2 = false;
            }
        )
    }

    saveAndNext() {
        this.saveAndUpdate();
        this.nextTab();
    }

    private getLoggedUserDetailsId() {
        // this._authService.getLoggedUserDetailsById().subscribe(data => {
        //     this.personalInfoFormModel.userId = data.name;
        //     this.personalInfoFormModel.mobileNo = data.mobileNumber;
        //     this.personalInfoFormModel.emailAddress = data.emailId;
        // })
    }

    /* For Tab  */
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

    selectionchangeForSemener(event: any, tag: any) {
        console.log(event.value)
        tag === 'p1' ?
            this.seminarModelForCreate.paragraphOne = event.value.header :
            this.seminarModelForCreate.paragraphTwo = event.value.header;
    }

    private getDataByUuid() {
        this.spinner = true;
        this._seminarService.getSeminarById(this.id).subscribe(
            res => {
                this.seminarModelForCreate = res.obj.createSeminarOptional;
                this.spinner = false;
            },
            error => {
                this._toastrService.error('Smoothing want to wrong!', "", this.config);
                this.spinner = false;
            }
        );
    }


    expand(expand: boolean): void {
        this.canExpand = expand;
    }


    getUserList() {
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
                sessionStorage.setItem('userList', JSON.stringify(this.userList));
            }
        );
    }

    onChangeUser(event) {
        let user = this.userList.find(f => f.id === event.value);
        this.memberInSeminarModel.name = user.name;
        this.memberInSeminarModel.emailId = user.emailId;
        this.memberInSeminarModel.mobileNumber = user.mobileNumber;
        this.memberInSeminarModel.designation = user.designation;
    }


    addNewMember() {
        if (!this.memberInSeminarModel.name || !this.memberInSeminarModel.emailId || !this.memberInSeminarModel.mobileNumber) {
            return;
        }

        this.memberInSeminarList.push(this.memberInSeminarModel);
        this.memberInSeminarModel = new MemberInSeminarModel();
    }


    onSaveAndUpdateMember() {

        if (!localStorage.getItem('seminarId')) {
            return;
        }

        if (!this.memberInSeminarList) {
            return;
        }

        this.memberInSeminarList = this.memberInSeminarList.map(m => {
            m.createSeminarId = Number(localStorage.getItem('seminarId'));
            return m;
        });

        this.spinner7 = true;
        this.memberInSeminarService.onSaveOrUpdateList(this.memberInSeminarList).subscribe(
            response => {
                if (response.success) {
                    this.findMemberBySeminarId();
                }
                this.spinner7 = false;
            },
            error => {
                this.spinner7 = false;
            }
        );
    }

    findMemberBySeminarId() {
        if (Number(localStorage.getItem('seminarId'))) {
            this.spinner8 = true;
            this.memberInSeminarService.getAllBySeminarId(Number(localStorage.getItem('seminarId'))).subscribe(
                response => {
                    this.memberInSeminarList = response.items ? response.items : [];
                    this.spinner8 = false;
                },
                error => {
                    this.spinner8 = false;
                }
            );
        }
    }


    onDelete(data: any, i: any) {
        if (data.id) {
            this.memberInSeminarList[i].isDeleted = 1;
        } else {
            this.memberInSeminarList.splice(i, 1);
        }
    }
}
