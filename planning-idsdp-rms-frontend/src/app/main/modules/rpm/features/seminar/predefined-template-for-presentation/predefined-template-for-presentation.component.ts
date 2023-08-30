import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { ERROR, OK } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { PresentationReport } from '../../../models/PresentationReport';
import { PresentationReportService } from '../../../services/presentation-report.service';
import { locale as lngBangla } from "./i18n/bn";
import { locale as lngEnglish } from "./i18n/en";

@Component({
  selector: 'app-predefined-template-for-presentation',
  templateUrl: './predefined-template-for-presentation.component.html',
  styleUrls: ['./predefined-template-for-presentation.component.scss']
})
export class PredefinedTemplateForPresentationComponent implements OnInit {

  createSeminarUuid: string;
  spinner = false;
  presentationReport: PresentationReport = new PresentationReport();
  mediumEditorConfig: any = MIN_EDITOR_CONFIG;

  constructor(
    private activateRoute: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _snackbarHelper: SnackbarHelper,
    private _route: Router,
    private _presentationReportService: PresentationReportService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.createSeminarUuid = this.activateRoute.snapshot.paramMap.get('uuid');
    this.findAllByCreateSeminarUuid();
  }


  findAllByCreateSeminarUuid() {
    this._presentationReportService.findAllByCreateSeminarUuid(this.createSeminarUuid).subscribe(
      response => {
        if (response.success && response.obj) {
          console.log('response ==== >>>> ', response.obj);
          this.presentationReport = { ...response.obj };
        } else {
          this.presentationReport = new PresentationReport();
        }
      },
      error => {
        console.log('error === >>>> ', error);
        this._snackbarHelper.openErrorSnackBarWithMessage('HTTP erroe occeared!.', ERROR);
      }
    );
  }


  onSubmit() {
    if (this.presentationReport.id) {
      this.onUpdate();
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.spinner = true;
    this.presentationReport.createSeminarUuid = this.createSeminarUuid;
    this._presentationReportService.create(this.presentationReport).subscribe(
      response => {
        if (response.success && response.obj) {
          this.presentationReport = { ...response.obj };
          this._snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
        } else {
          this._snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
        }
        this.spinner = false;
      },
      error => {
        console.log(error);
        this._snackbarHelper.openErrorSnackBarWithMessage('HTTP error occeared!.', ERROR);
        this.spinner = false;
      }
    );
  }

  onUpdate() {
    this.spinner = true;
    this.presentationReport.createSeminarUuid = this.createSeminarUuid;
    this._presentationReportService.update(this.presentationReport).subscribe(
      response => {
        if (response.success && response.obj) {
          this.presentationReport = { ...response.obj };
          this._snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
        } else {
          this._snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
        }
        this.spinner = false;
      },
      error => {
        console.log(error);
        this._snackbarHelper.openErrorSnackBarWithMessage('HTTP error occeared!.', ERROR);
        this.spinner = false;
      }
    );
  }

}
