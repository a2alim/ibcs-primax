import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { FuseTranslationLoaderService } from "../../../../../../../core/services/translation-loader.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../../../auth/services/auth.service";
import { SeminarService } from "../../../../../services/seminar.service";
import { locale as lngEnglish } from "../../../i18n/en";
import { locale as lngBangla } from "../../../i18n/bn";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { PredefinedTemplateServiceService } from "../../../../../../settings/services/predefined-template-service.service";
import { TemplateTypeServiceService } from "../../../../../../settings/services/template-type-service.service";
import { MatSelectChange } from "@angular/material/select";
import { data } from "autoprefixer";
import {MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";

@Component({
    selector: 'app-seminar-participant-tab',
    templateUrl: './seminar-participant-tab.component.html',
    styleUrls: ['./seminar-participant-tab.component.scss']
})
export class SeminarParticipantTabComponent implements OnInit {

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/


    preDefineTemplateList: any[] = [];

    templateType: [] = [];

    isUpdatedAction: boolean;

    id: any;
    uuid: any;

    spinner: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;

    seminarId: number;
    preDefineTemplateValue: string;
    seminarParticipatingId: any;
    seminarParticipatingUUId: any;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private toastr: ToastrService,
        private _router: Router,
        private templatetypeservice: TemplateTypeServiceService,
        private _predefinedTemplateServiceService: PredefinedTemplateServiceService,
        private _seminarService: SeminarService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.getPredefinedTemplateList();
    }

    ngOnInit(): void {

        this.id = this._activatedRoute.snapshot.paramMap.get('id');
        this.uuid = this._activatedRoute.snapshot.paramMap.get('uuid');

        if (this.uuid) {
            this.getDataByUuid();
        }
        this.getTemplateType();

        // if (this.uuid != null) {
        //     this.isUpdatedAction = true;
        //     this.getDataByUuid();
        // } else {
        //     this.isUpdatedAction = false;

        // }
        // this.getTemplateType();
    }

    getTemplateType() {
        this.templatetypeservice.getAllActive().subscribe(
            res => {
                if (res) {
                    this.templateType = res.items;
                }

            },
            error => {
                this.toastr.error('Http Error Happened Template Type !.', "", this.config)
            })
    }


    changeTemplateType($event: MatSelectChange) {
        let status = $event.value;

        if (status != null || status != "") {
            this.spinner4 = true;
            this._predefinedTemplateServiceService.getByTemplateTypeId(status).subscribe(
                res => {
                    if (res.success) {
                        this.preDefineTemplateList = res.items;
                    }
                    this.spinner4 = false;
                },
                error => {
                    this.toastr.error('Http Error Happened Predefined template !.', "", this.config);
                    this.spinner4 = false;
                })
        }

    }


    getPredefinedTemplateList() {
        this.spinner2 = true;
        this._predefinedTemplateServiceService.getAll().subscribe(
            res => {
                this.preDefineTemplateList = res.items ? res.items : [];
                this.spinner2 = false;
            },
            error => {
                this.spinner2 = false;
            }
        );

    }

    // saveAndUpdate() {

    //     if (!this.isUpdatedAction) {
    //         const data = {
    //             "seminarId": +(localStorage.getItem("seminarId")),
    //             "participantsList": this.preDefineTemplateValue
    //         }
    //         this._seminarService.saveSeminarPerticipent(data).subscribe(
    //             res => {
    //                 if (res.success) {
    //                     this._router.navigate(['/seminars']);
    //                     this._toastrService.success(res.message, "Success!", this.config);
    //                 }
    //             },
    //             error => {
    //                 this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
    //             }
    //         )
    //     } else {
    //         const data = {
    //             "id": this.seminarParticipatingId,
    //             "uuid": this.seminarParticipatingUUId,
    //             "seminarId": this.id,
    //             "participantsList": this.preDefineTemplateValue
    //         }
    //         this._seminarService.updateSeminarPerticipent(data).subscribe(
    //             res => {
    //                 if (res.success) {
    //                     this._router.navigate(['/seminars'])
    //                     this._toastrService.success(res.message, "Update Success!", this.config);
    //                 }
    //             },
    //             error => {
    //                 this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
    //             }
    //         )
    //     }
    // }

    saveAndUpdate() {

        if (this.seminarParticipatingId) {
            this.onUpdate();
        } else {
            this.onSave();
        }
    }


    onSave() {

        let seminarId = null;

        if (localStorage.getItem("seminarId")) {
            seminarId = +(localStorage.getItem("seminarId"));
        } else {
            seminarId = this.id ? this.id : null;
        }

        if (!seminarId) {
            this._toastrService.error('Seminar not found!', "Error!", this.config);
            return;
        }

        const data = {
            "seminarId": seminarId,
            "participantsList": this.preDefineTemplateValue
        }

        this.spinner5 = true;
        this._seminarService.saveSeminarPerticipent(data).subscribe(
            res => {
                if (res.success) {
                    this.spinner5 = false;
                    this.seminarId = res.obj.m2CreateSeminarId.id;
                    this.seminarParticipatingId = res.obj.id;
                    this.preDefineTemplateValue = res.obj.participantsList;
                    this.seminarParticipatingUUId = res.obj.uuid;
                    this._router.navigate(['/seminars']);
                    this._toastrService.success(res.message, "Success!", this.config);
                } else {
                    this.spinner5 = false;
                    this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
                }
            },
            error => {
                this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
                this.spinner5 = false;
            }
        )
    }

    onUpdate() {

        const data = {
            "id": this.seminarParticipatingId,
            "uuid": this.seminarParticipatingUUId,
            "seminarId": this.seminarId,
            "participantsList": this.preDefineTemplateValue
        }

        this.spinner5 = true;
        this._seminarService.updateSeminarPerticipent(data).subscribe(
            res => {
                if (res.success) {
                    this.spinner5 = false;
                    this.seminarId = res.obj.m2CreateSeminarId.id;
                    this.seminarParticipatingId = res.obj.id;
                    this.preDefineTemplateValue = res.obj.participantsList;
                    this.seminarParticipatingUUId = res.obj.uuid;
                    this._router.navigate(['/seminars']);
                    this._toastrService.success(res.message, "", this.config);
                } else {
                    this.spinner5 = false;
                    this._toastrService.error('Smoothing want to wrong!', "", this.config);
                }
            },
            error => {
                this.spinner5 = false;
                this._toastrService.error('Smoothing want to wrong!', "", this.config);
            }
        )
    }

    selectionchange(event: any) {
        this.preDefineTemplateValue = event.value.header;
    }

    saveAndNext() {
        this.saveAndUpdate();
        this.nextTab();
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
        tag === 'p1' ? this.preDefineTemplateValue = event.value.header : '';
    }

    private getDataByUuid() {
        this.spinner = true;
        this._seminarService.getSeminarById(this.id).subscribe(
            res => {
                this.spinner = false;
                this.seminarId = res.obj?.createSeminarParticipating?.m2CreateSeminarId?.id;
                this.seminarParticipatingId = res.obj?.createSeminarParticipating?.id;
                this.preDefineTemplateValue = res.obj?.createSeminarParticipating?.participantsList;
                this.seminarParticipatingUUId = res.obj?.createSeminarParticipating?.uuid;
            },
            error => {
                this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
                this.spinner = false;
            }
        );
    }
}
