import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {closeIcon, saveIcon} from '../../../../constants/button.constants';
import {NewMemberService} from "../../../../services/new-member.service";
import {NewMember} from "../../../../models/NewMember";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ERROR, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_UPDATED} from "../../../../../../core/constants/message";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ResearcherPresentation} from "../../../../models/ResearcherPresentation";
import {CommonTypeService} from "../../../../../settings/services/common-type.service";
import {FORM_TYPES_NO} from "../../../../../settings/enum-list.enum";

@Component({
    selector: 'app-new-member-add-modal',
    templateUrl: './new-member-add-modal.component.html',
    styleUrls: ['./new-member-add-modal.component.scss']
})
export class NewMemberAddModalComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner = true;
    presentation: ResearcherPresentation;
    newMember: NewMember;
    seminarType = [];
    saveDisable: boolean = true;
    update: boolean;
    saveIcon = saveIcon;
    closeIcon = closeIcon;
    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    form: FormGroup = new FormGroup({
        evaluatorName: new FormControl(null, [Validators.required]),
        profileSummary: new FormControl(null, [Validators.required]),
        stCommonTypeId: new FormControl(null, [Validators.required]),
    });

    constructor(@Inject(MAT_DIALOG_DATA) data: { presentation: ResearcherPresentation, newMember: NewMember, edit: boolean },
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: NewMemberService,
                private commonTypeService: CommonTypeService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.presentation = data.presentation;
        this.newMember = data.newMember;
        this.update = data.edit;

    }

    ngOnInit(): void {
        this.getRoleInSeminarType();
        if (this.update) {
            this.form.patchValue({
                evaluatorName: this.newMember.evaluatorName,
                profileSummary: this.newMember.profileSummary,
                stCommonTypeId: this.newMember.stCommonTypeId,
            });
            this.saveDisable = false;
        }
    }

    private getRoleInSeminarType() {
        this.spinner = true;
        this.subscribe$.add(
            this.commonTypeService.findAllByActiveData(FORM_TYPES_NO.ROLE_IN_SEMINAR).subscribe(res => {
                if (res) {
                    this.seminarType = res;
                }
                this.spinner = false;
            })
        );
    }


    onSubmit() {
        const data: NewMember = this.form.value;
        data.m2ResearcherPresentationId = this.presentation.id;
        this.saveDisable = true;
        if (this.update) {
            data.uuid = this.newMember.uuid;
            this.onUpdate(data)
        } else {
            this.onSave(data);
        }
    }

    onSave(data: NewMember) {
        this.spinner = true;
        this.service.create(data).subscribe(
            response => {
                if (response.success) {
                    this.newMember = response.obj;
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                    this.closeEventEmitter.emit(true);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            _ => {
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }

    onUpdate(data: NewMember) {
        this.spinner = true;
        this.service.update(data).subscribe(
            response => {
                if (response.success) {
                    this.newMember = response.obj;
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.closeEventEmitter.emit(true);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            _ => {
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }

    onClose(value: boolean) {
        this.dialog.closeAll();
      };
}
