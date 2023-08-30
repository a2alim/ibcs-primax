import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FuseTranslationLoaderService} from "../../../core/services/translation-loader.service";
import {SnackbarHelper} from "../../../core/helper/snackbar.helper";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ProjectMovementService } from 'app/main/modules/dpp-tapp-management/services/project-movement.service';
import { UserGroupService } from 'app/main/modules/configuration-management/services/user-group.service';
import {ProjectMovementStageModel} from "../../../modules/dpp-tapp-management/models/project.movement.model";

@Component({
    selector: 'app-desk-user-movement',
    templateUrl: './desk-user-movement.component.html',
    styleUrls: ['./desk-user-movement.component.scss']
})
export class DeskUserMovementComponent implements OnInit {

    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    form: FormGroup;
    // data: { userGroupType: 'Agency' | 'Ministry' | 'Planning_Commission', dppTappMasterId: number, currentStage: string };
    userGroupType: 'Agency' | 'Ministry' | 'Planning_Commission' | 'Ecnec_Head' | 'Ecnec_Officer';
    projectMovementStageModel: ProjectMovementStageModel;
    message: string;
    users: any[];
    currentUserId: number;

    constructor(@Inject(MAT_DIALOG_DATA) data:  { userGroupType: 'Agency' | 'Ministry' | 'Planning_Commission' | 'Ecnec_Head' | 'Ecnec_Officer', message: string, projectMovementStageModel: ProjectMovementStageModel, userId: number },
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectMovementService: ProjectMovementService,
                private userGroupService: UserGroupService,
                private snackbarHelper: SnackbarHelper,
                private matDialog: MatDialog) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userGroupType = data.userGroupType;
        this.message = data.message;
        this.projectMovementStageModel = data.projectMovementStageModel;
        this.currentUserId = data.userId;
    }

    ngOnInit(): void {
        this.populateForm();
        this.getUserGroupDetail();
    }

    private populateForm() {
        this.form = new FormGroup({
            userId: new FormControl('', [Validators.required]),
        });
    }

    getUserGroupDetail(){
        this.userGroupService.getUserListByDesk(this.userGroupType).subscribe(res=>{
            this.users = res;
            if(this.currentUserId){
                let index = this.users.findIndex(user => user.userId ==this.currentUserId);
                if(0<=index){
                    this.users.splice(index, 1);    
                }
            }
        });
    }

    submit() {
        this.projectMovementStageModel.userId = this.form.value.userId;
        this.projectMovementService.forward(this.projectMovementStageModel).subscribe(res => {
            //this.snackbarHelper.openSuccessSnackBarWithMessage(this.message, 'OK');
            this.closeEventEmitter.emit(true);
        });

    }
}
