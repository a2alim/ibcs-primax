import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { GlobalValidationServiceService } from "../../../../../core/services/global-validation-service.service";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { addNewIcon, deleteIcon, editIcon, previousIcon, refreshIcon, viewIcon } from '../../../constants/button.constants';
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";

@Component({
  selector: 'app-create-acknowledgment-letter',
  templateUrl: './create-acknowledgment-letter.component.html',
  styleUrls: ['./create-acknowledgment-letter.component.scss']
})
export class CreateAcknowledgmentLetterComponent implements OnInit {

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;

    frmGroup: FormGroup;
    goLetterId: any;
    chequeId: any;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
  constructor(
      private router: Router,
      private dateAdapter: DateAdapter<Date>,
      private activatedRoute: ActivatedRoute,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private globalVal: GlobalValidationServiceService,
      private formBuilder: FormBuilder,
  ) {
      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
      this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
      this.activatedRoute.params.subscribe(params => {
          this.goLetterId = params['goLetterId'];
          this.chequeId = params['chequeId'];
      });
  }

  ngOnInit(): void {
      this.frmGroup = this.formBuilder.group({
          uuid: [''],
          id: [''],
          receiverName: ['', [this.globalVal.trimValidator('Subject')]],
          receiverMobile: ['', [this.globalVal.trimValidator('Mobile')]],
          receivedDate: [new Date()],
          templateType: ['', [this.globalVal.trimValidator('Template Type')]],
          predefineTemplate: ['', [this.globalVal.trimValidator('Predefine Template')]],
          letterContent: ['', [this.globalVal.trimValidator('Letter Content')]],
      });
  }

  // For submit form data
    onSubmit(){

    }

    back(){
        this.router.navigate([`go-letter-list/${this.goLetterId}/bank-cheque-list`]);
    }

}
