import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ShowMarks } from '../../../model/show-marks';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";

@Component({
  selector: 'app-show-mark-modal',
  templateUrl: './show-mark-modal.component.html',
  styleUrls: ['./show-mark-modal.component.scss']
})
export class ShowMarkModalComponent implements OnInit {

  graduateDivisionList = [
    { propertyName: 'firstDivision', labelName: '1st Division' },
    { propertyName: 'secDivision', labelName: '2nd Division' },
    { propertyName: 'thirdDivision', labelName: '3rd Division' }
  ];

  postGraduateDivisionList = [
    { propertyName: 'postGraduateResultMarksFirst', labelName: '1st Division' },
    { propertyName: 'postGraduateResultMarksSec', labelName: '2nd Division' },
    { propertyName: 'postGraduateResultMarksThird', labelName: '3rd Division' }
  ];

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  showMarks: ShowMarks = new ShowMarks();

  constructor(@Inject(MAT_DIALOG_DATA) data: ShowMarks,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private dialog: MatDialog
  ) {
    this.showMarks = data;
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    console.log('showMarks ==== >>>> ', this.showMarks);
  }

  calculateTotalMark() {
    return this.showMarks.graduateResultMark +
      this.showMarks.isGovEmployeeMark +
      this.showMarks.postGraduateResultMark +
      this.showMarks.isThesisGroupMark +
      this.showMarks.researchExperienceMark +
      this.showMarks.journalPublicationLocQtyMark +
      this.showMarks.journalPublicationIntQtyMark +
      this.showMarks.mPhilMark +
      this.showMarks.PHDMark +
      this.showMarks.ageMark
  }

  onClose(value: boolean) {
    this.dialog.closeAll();
  };

  showGraduateData(getVal) {
    if (!getVal) {
      return '';
    }
    return this.graduateDivisionList.find(f => f.propertyName == getVal).labelName;
  }

  showPostGraduateData(getVal) {
    if (!getVal) {
      return '';
    }
    return this.postGraduateDivisionList.find(f => f.propertyName == getVal).labelName;
  }

}
