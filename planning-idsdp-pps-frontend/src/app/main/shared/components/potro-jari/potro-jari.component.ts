import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { FileUploadService } from 'app/main/core/services/file-upload.service';
import { ProjectMovementStageModel } from 'app/main/modules/dpp-tapp-management/models/project.movement.model';
import { ProjectMovementService } from 'app/main/modules/dpp-tapp-management/services/project-movement.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import {messages} from "../../../../mock-api/common/messages/data";

@Component({
  selector: 'app-potro-jari',
  templateUrl: './potro-jari.component.html',
  styleUrls: ['./potro-jari.component.scss']
})
export class PotroJariComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) data: {message: string,projectMovementStageModel: ProjectMovementStageModel}, private _fuseTranslationLoaderService: FuseTranslationLoaderService, private fileUploadService: FileUploadService, private projectMovementService: ProjectMovementService, private snackbarHelper: SnackbarHelper) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.projectMovementStageModel = data.projectMovementStageModel;
    this.message = data.message;

  }

  ngOnInit(): void {
    this.populateForm();
  }

  form: FormGroup;
  file:File;
  projectMovementStageModel: ProjectMovementStageModel;
  message:string;
  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  private populateForm() {
    this.form = new FormGroup({
      data: new FormControl('', [Validators.required]),
      // observer: new FormControl('', [Validators.required]),
    });
  }

  uploadFile(files: FileList) {
    this.file = files.item(0);
  }

  submit(){
    this.projectMovementService.forward(this.projectMovementStageModel).subscribe(res=>{
      const projectMovementStage = res.res;
      this.fileUploadService.uploadApprovalProcessFlowAttachment(this.file,projectMovementStage).subscribe(res2=>{
        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(this.message,this.message);
        this.closeEventEmitter.emit(true);
      })

    })

  }


}
