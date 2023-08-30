import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess, deleteSuccess, deleteFailed, dataNotFount} from 'app/main/modules/rpm/constants/button.constants';
import {ResearchProfileMultiFormService} from 'app/main/modules/rpm/services/research-profile-multi-form.service';
import {UserListServiceService} from 'app/main/modules/settings/services/user-list-service.service';
import {ToastrService} from 'ngx-toastr';
import {locale as lngEnglish} from "../../../i18n/en";
import {locale as lngBangla} from "../../../i18n/bn";
import {AcademicBackgroundModel, ParticipantModel} from 'app/main/modules/training-institute/models/participant.model';
import {ParticipantService} from 'app/main/modules/training-institute/services/participant.service';
import {MatTableDataSource} from '@angular/material/table';
import {FileUploadService} from "../../../../../../../../shared/services/file-upload.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {FileUploadModel} from "../../../../../../../../shared/model/file-upload.model";
import {editBtn} from "../../../../../../../settings/constants/button.constants";
import {DEFAULT_SIZE} from "../../../../../../../../core/constants/constant";
import {PageEvent} from "@angular/material/paginator";
import {deleteIcon} from "../../../../../../constants/button.constants";
import {GlobalValidationServiceService} from "../../../../../../../../core/services/global-validation-service.service";
import {UtilsService} from "../../../../../../services/utils.service";

@Component({
    selector: 'app-academic-info',
    templateUrl: './academic-info.component.html',
    styleUrls: ['./academic-info.component.scss']
})
export class AcademicInfoComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    @Input() newParticipantModel: ParticipantModel;
    @Input() isEditable: boolean = false;
    @Input() participantId: number;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    editBtn=editBtn
    deleteBtn=deleteIcon
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    indexforEdit:any


    academicModels: AcademicBackgroundModel[] = [];
    academicModel: AcademicBackgroundModel = new AcademicBackgroundModel();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;

    /*----/Button---*/

    isUpdatedAction: boolean;
    userList: any[] = [];
    imageName:any;

    boardList: { id: number, name: string }[] = [
        {id: 1, name: "Dinajpur"},
        {id: 2, name: "Dhaka"},
        {id: 3, name: "Rajshahi"},
        {id: 4, name: "Commila"},
        {id: 5, name: "Jessore"}
    ];
    resultList: { id: number, name: string }[] = [
        {id: 1, name: "First Division/Class"},
        {id: 2, name: "Second Division/Class"},
        {id: 3, name: "Third Division/Class"},
        {id: 4, name: "Grade"},
    ];

    academicForm : FormGroup;
    dataSource: any;
    displayedColumns: string[] = ['position','subject', 'examination', 'result', 'passingYear', 'instituteName', 'board', 'action'];

    uuid: string;
    formTitle=''

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _toastrService: ToastrService,
                private _formBuilder: FormBuilder,
                private _participantService: ParticipantService,
                private route: Router,
                private dialog: MatDialog,
                private _fileUploadService: FileUploadService,
                private globalVal: GlobalValidationServiceService,
                private utils:UtilsService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }
    @ViewChild('inputForm') inputForm: NgForm;

    certificateImagehold:any;

    ngOnInit(): void {

        this.formTitle = 'Add';

        console.log(this.isEditable)


        if (this.isEditable) {
            this._participantService.getParticipantById(this.participantId).toPromise().then(
                res => {
                    this.academicModels = res.academicBackgroundModels;
                    this.dataSource = new MatTableDataSource(this.academicModels);

                },
                error => {
                    console.log(error)
                }
            )

        }

        this.academicForm = this._formBuilder.group({
            "id": [],
            "subject": ['',this.globalVal.trimValidator('subject')],
            "examinationName": ['',this.globalVal.trimValidator('examinationName')],
            "resultId": ['',this.globalVal.trimValidator('result')],
            "passingYear":['',this.globalVal.trimValidator('passing Year')],
            "instituteName": ['',this.globalVal.trimValidator('institute Name')],
            "board":['',this.globalVal.trimValidator('board')],
            'certificateImage': ['']

        });
    }

    addAcademicInfo() {
        let tmp = new AcademicBackgroundModel();
        let formD = Object.assign(tmp, this.academicForm.value);
        console.log(formD);

        console.log(this.academicModels)
        formD.certificateImage=this.certificateImagehold;

        this.academicModels.push(formD);
        console.log(this.academicModels)
        this.newParticipantModel.academicBackgroundModels = this.academicModels;

        this.academicModel = new AcademicBackgroundModel();
        this.dataSource = new MatTableDataSource(this.academicModels);
       // this.academicForm.reset();
        this.saveForAddMore();
        this.formReset();
    }

    deleteAcademicInfo(index) {
        console.log(index)
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.academicModels.splice(index, 1);
                this.newParticipantModel.academicBackgroundModels=this.academicModels
                this.dataSource = new MatTableDataSource(this.academicModels);
                this.deleteAndSave();
            }
            dialogRef.close(true);
        });
    }

    uploadFile(files: FileList, tag: string) {
        if (tag === 'certificate_image') {
            this.imageName=null;
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                    this.certificateImagehold = data;
            })
        }
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

    saveAndNext() {
        if(this.academicForm.valid){
            this.save(true)
        }

    }


    save(isNext: boolean) {
        console.log(this.newParticipantModel.id)
        this._participantService.editParticipant(this.newParticipantModel, this.newParticipantModel.id).subscribe(
            res => {
                console.log(res);
                this._toastrService.success(updateSuccess, "Success");
                if (isNext)
                    this.nextTab()
                else
                    this.route.navigate(["/participant-list"]);
            },
            error => {
                console.log(error);
                this._toastrService.error(updateFailed, "Error");

            }
        )
    }


    addAndNext(){
        if(this.academicForm.valid && this.formTitle==='Add'){
            let tmp = new AcademicBackgroundModel();
            let formD = Object.assign(tmp, this.academicForm.value);
            console.log(formD);

            console.log(this.academicModels)

            this.academicModels.push(formD);
            console.log(this.academicModels)
            this.newParticipantModel.academicBackgroundModels = this.academicModels;

            this.academicModel = new AcademicBackgroundModel();
            this.dataSource = new MatTableDataSource(this.academicModels);
            // this.academicForm.reset();
            this.saveForAddMore();
            this.formReset();
            this.nextTab();
        }else{
            console.log(this.newParticipantModel.id)
            this._participantService.editParticipant(this.newParticipantModel, this.newParticipantModel.id).subscribe(
                res => {
                    this._toastrService.success(updateSuccess, "Success");
                    this.nextTab();
                },
                error => {
                    console.log(error);
                    this._toastrService.error(updateFailed, "Error");

                }
            )

        }

    }

    deleteAndSave() {
        console.log(this.newParticipantModel.id)
        this._participantService.editParticipant(this.newParticipantModel, this.newParticipantModel.id).subscribe(
            res => {
                this._toastrService.success(deleteSuccess, "Success");
            },
            error => {
                console.log(error);
                this._toastrService.error(deleteFailed, "Error");

            }
        )
    }




    saveForAddMore() {
        console.log(this.newParticipantModel.id)
        this._participantService.editParticipant(this.newParticipantModel, this.newParticipantModel.id).subscribe(
            res => {
                this._toastrService.success(saveSuccess, "Success");
            },
            error => {
                console.log(error);
                this._toastrService.error(saveFailed, "Error");

            }
        )
    }


    updateAndSave() {
        console.log(this.newParticipantModel.id)
        this._participantService.editParticipant(this.newParticipantModel, this.newParticipantModel.id).subscribe(
            res => {
                this._toastrService.success(updateSuccess, "Success");
            },
            error => {
                console.log(error);
                this._toastrService.error(updateFailed, "Error");

            }
        )
    }

    editRow(data,index) {
       this.indexforEdit=index
        this.formTitle = "Edit";
        this.certificateImagehold=data.certificateImage;
        this.academicForm.patchValue(data);
        console.log( '>>>',data)
        //this.imageName=data.certificateImage.fileName;
        this.imageName=  this.utils.imageNameSpliter(data.certificateImage.fileName,"-",0)
    }

    onChangePage($event: PageEvent) {

    }

    formReset() {
            this.formTitle = 'Add';
            this.academicForm.reset();
            this.inputForm.resetForm();
            this.imageName=null;
           // this.certificateImagehold=null;
       // this.academicForm.patchValue({ cer: 'true' });

    }

    onSubmit() {
        if (this.academicForm.valid && this.formTitle==='Add') {
            this.addAcademicInfo();
        }else{
            let tmp = new AcademicBackgroundModel();
            let formD = Object.assign(tmp, this.academicForm.value);
            if(this.certificateImagehold!=null || this.certificateImagehold!=''){
                formD.certificateImage=this.certificateImagehold;
            }
            this.academicModels[this.indexforEdit]=formD;
            console.log('payload',this.academicModels)
            this.newParticipantModel.academicBackgroundModels[this.indexforEdit] = formD;

            this.academicModel = new AcademicBackgroundModel();
            this.dataSource = new MatTableDataSource(this.academicModels);
            this.updateAndSave()
            this.formReset();


        }

    }
}

