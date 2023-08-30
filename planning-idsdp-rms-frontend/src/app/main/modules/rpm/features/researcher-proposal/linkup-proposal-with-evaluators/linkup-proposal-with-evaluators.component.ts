import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ExpertEvaluator } from 'app/main/modules/settings/models/expert-evaluator.model';
import { ExpertEvaluatorService } from 'app/main/modules/settings/services/expert-evaluator.service';
import { ResearcherProposal } from '../../../models/ResearcherProposal';
import { LinkupProposalWithEvaluatorsService } from '../../../services/linkup-proposal-with-evaluators.service';
import { ResearcherProposalService } from '../../../services/researcher-proposal.service';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { downloadIcon, editIcon, emailIcon, pdfIcon, saveIcon, searchIcon, visibilityIcon } from '../../../constants/button.constants';
import { LinkupProposalWithEvaluatorsModel } from '../../../models/LinkupProposalWithEvaluatorsModel';
import { SendEmailModalComponent } from './send-email-modal/send-email-modal.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FiscalYearServiceService } from 'app/main/modules/settings/services/fiscal-year-service.service';
import { ResearchCategoryTypeService } from 'app/main/modules/settings/services/research-category-type.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ERROR, OK } from 'app/main/core/constants/message';
import { LinkupProposalWithEvaluatorsSharedService } from '../../../services/linkup-proposal-with-evaluators-shared.service';
import { Router } from '@angular/router';
import { JasperServiceService } from "../../../services/jasper-service.service";
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { SendEmailModalNewComponent } from './send-email-modal-new/send-email-modal-new.component';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import {SectorTypeService} from "../../../../settings/services/sector-type.service";
import { environment,reportBackend } from 'environments/environment';
import * as bl2Js from 'bl2-js-report';
@Component({
  selector: 'app-linkup-proposal-with-evaluators',
  templateUrl: './linkup-proposal-with-evaluators.component.html',
  styleUrls: ['./linkup-proposal-with-evaluators.component.scss']
})
export class LinkupProposalWithEvaluatorsComponent implements OnInit {

  spinner: boolean = false;
  spinner1: boolean = false;
  spinner2: boolean = false;
  spinner3: boolean = false;
  spinner4: boolean = false;
  spinner5: boolean = false;
  spinner6: boolean = false;
  spinner7: boolean = false;

  researcherProposalList: ResearcherProposal[] = [];
  fiscalYearList: any[] = [];
  researchCategoryTypeList: any[] = [];

  selectedFiscalYear: any = {};
  selectedResearchCategoryType: any = {};
    selectedResearchSectorType: any = {};
  sendData: { stFiscalYearId: number, stResearchCatTypeId: number, stSectorTypeId: number } = { stFiscalYearId: null, stResearchCatTypeId: null, stSectorTypeId: null };

  stFiscalYearId: number;
  stResearchCatTypeId: number;
  stSectorTypeId: number;

  evaluatorList: ExpertEvaluator[] = [];
  evaluatorForProfileMarksList: ExpertEvaluator[] = [];
  evaluatorForResearcherList: ExpertEvaluator[] = [];
  evaluatorForResearch: ExpertEvaluator[] = [];


  linkupProposalWithEvaluatorsModel: LinkupProposalWithEvaluatorsModel = new LinkupProposalWithEvaluatorsModel();
  linkupProposalWithEvaluatorsList: LinkupProposalWithEvaluatorsModel[] = [];

  saveIcon = saveIcon;
  visibilityIcon = visibilityIcon;
  emailIcon = emailIcon;
  editIcon = editIcon;
  searchIcon = searchIcon; downloadIcon = downloadIcon; pdfIcon = pdfIcon;
  loginUserInfo: any;
  scrollStrategy: ScrollStrategy;

  dataPDF:any ={};
    sectors = [];

    constructor(
    private readonly sso: ScrollStrategyOptions,
    private _linkupProposalWithEvaluatorsService: LinkupProposalWithEvaluatorsService,
    private _linkupProposalWithEvaluatorsSharedService: LinkupProposalWithEvaluatorsSharedService,
    private _researcherProposalService: ResearcherProposalService,
    private _expertEvaluatorService: ExpertEvaluatorService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _fiscalYearService: FiscalYearServiceService,
    private _researchCategoryTypeService: ResearchCategoryTypeService,
    private _dialog: MatDialog,
    private _snackbarHelper: SnackbarHelper,
    private router: Router,
    private jasperService: JasperServiceService,
    private storageService: StorageService,
    private sectorTypeService: SectorTypeService,

  ) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.scrollStrategy = this.sso.noop(); // or close()/block()/reposition()
  }

  ngOnInit(): void {
    this.loginUserInfo = this.storageService.getUserData();
    this.getEvaluatorList((res1) => {
      this.onInit();
    });
    this.getFiscalYearList();
    this.getResearchCategoryTypeList();
  }

  onInit() {
    this.getListFindByStFiscalYearId((res2) => {
        if (res2) {
            this.getLinkupProposalWithEvaluatorsList();
        }
    });
      this.getSectorTypes();
  }

    private getSectorTypes() {
        this.sectorTypeService.getAll().subscribe(res => {
            this.sectors = res.items
        });
    }

  getListFindByStFiscalYearId(callBack) {
    this.spinner = true;
    this._researcherProposalService.getListFindByStFiscalYearId(this.sendData).subscribe(
      response => {
        this.researcherProposalList = [];

        if (response.success && response.items) {
          this.researcherProposalList = response.items;
            console.log(response.items);
          this.researcherProposalList.forEach((item => {
            const list = this.evaluatorList.filter(f => f.id === item.stResearchCatTypeId);
            if (list) {
              // item.evaluatorList.push(...list);
            } else {
              //item.evaluatorList = [];
            }
          }));
        }
        this.spinner = false;
        callBack(true);
      },
      error => {
        console.log('error  ==== >>>>> ', error);
        this.spinner = false;
        callBack(false);
      }
    );
  }

  getEvaluatorList(callBack) {
    this.spinner1 = true;
    this._expertEvaluatorService.getAll().subscribe(
      response => {
        this.evaluatorList = response.items ? response.items : [];
        // this.evaluatorForProfileMarksList = this.evaluatorList.filter(f => f.evaluatortype == 1);
        // this.evaluatorForResearcherList = this.evaluatorList.filter(f => f.evaluatortype == 2);
        this.evaluatorForProfileMarksList = this.evaluatorList;
        this.evaluatorForResearcherList = this.evaluatorList;
        this.evaluatorForResearch = this.evaluatorList;
        callBack(true);
        this.spinner1 = false;
      },
      error => {
        console.log('error === >>>> ', error);
        this.spinner1 = false;
      }
    );
    this.spinner1 = false;
    callBack(false);
  }

  onSaveOrUpdate(data: any, index: number) {
    if (data && data.linkupProposalWithEvaluatorsId) {
      this.onUpdate(data);
    } else {
      this.onSave(data);
    }
  }

  onSave(data: any) {

    if (!data.stProfileOfExpertEvaluatorsId && !data.stProfileOfExpertEvaluatorsIdForProMarks) {
      this._snackbarHelper.openErrorSnackBarWithMessage('Select evaluator first!.', ERROR);
      return;
    }

    this.spinner2 = true;
    this.linkupProposalWithEvaluatorsModel = new LinkupProposalWithEvaluatorsModel();
    this.linkupProposalWithEvaluatorsModel.researcherProposalId = data.id;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsIdForProMarks = data.stProfileOfExpertEvaluatorsIdForProMarks;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsIdForResearch = data.stProfileOfExpertEvaluatorsIdForResearch;
    this.linkupProposalWithEvaluatorsModel.isEditable = 0;
    this.linkupProposalWithEvaluatorsModel.mailStatus = 0;
    this.linkupProposalWithEvaluatorsModel.reviewStatus = 0;
    this.linkupProposalWithEvaluatorsModel.mailStatusForProMarks = 0;
    this.linkupProposalWithEvaluatorsModel.reviewStatusForProMarks = 0;
    this.linkupProposalWithEvaluatorsModel.mailStatusForResearch = 0;
    this.linkupProposalWithEvaluatorsModel.reviewStatusForResearch = 0;

    this._linkupProposalWithEvaluatorsService.create(this.linkupProposalWithEvaluatorsModel).subscribe(
      response => {
        if (response.success) {
          this.onInit();
          this.spinner2 = false;
          this._snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
        } else {
          this._snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
          this.spinner2 = false;
        }
      },
      error => {
        console.log('error ==== >>>> ', error);
        this._snackbarHelper.openErrorSnackBarWithMessage('HTTP error occured!.', ERROR);
        this.spinner2 = false;
      }
    );
  }

  onUpdate(data: any) {

    if (!data.stProfileOfExpertEvaluatorsId && !data.stProfileOfExpertEvaluatorsIdForProMarks) {
      this._snackbarHelper.openErrorSnackBarWithMessage('Select evaluator first!.', ERROR);
      return;
    }

    this.spinner3 = true;
    this.linkupProposalWithEvaluatorsModel = new LinkupProposalWithEvaluatorsModel();
    this.linkupProposalWithEvaluatorsModel.id = data.linkupProposalWithEvaluatorsId;
    this.linkupProposalWithEvaluatorsModel.uuid = data.linkupProposalWithEvaluatorsUiId;
    this.linkupProposalWithEvaluatorsModel.researcherProposalId = data.id;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsIdForProMarks = data.stProfileOfExpertEvaluatorsIdForProMarks;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsIdForResearch = data.stProfileOfExpertEvaluatorsIdForResearch;
    this.linkupProposalWithEvaluatorsModel.subject = data.subject;
    this.linkupProposalWithEvaluatorsModel.subjectForProMarks = data.subjectForProMarks;
    this.linkupProposalWithEvaluatorsModel.subjectForResearch = data.subjectForResearch;
    this.linkupProposalWithEvaluatorsModel.mailBodyContent = data.mailBodyContent;
    this.linkupProposalWithEvaluatorsModel.mailBodyContentForProMarks = data.mailBodyContentForProMarks;
    this.linkupProposalWithEvaluatorsModel.mailBodyContentForResearch = data.mailBodyContentForResearch;
    this.linkupProposalWithEvaluatorsModel.isEditable = 0;
    this.linkupProposalWithEvaluatorsModel.mailStatus = data.mailStatus;
    this.linkupProposalWithEvaluatorsModel.mailStatusForProMarks = data.mailStatusForProMarks;
    this.linkupProposalWithEvaluatorsModel.mailStatusForResearch = data.mailStatusForResearch;
    this.linkupProposalWithEvaluatorsModel.reviewStatus = data.reviewStatus;
    this.linkupProposalWithEvaluatorsModel.reviewStatusForProMarks = data.reviewStatusForProMarks;
    this.linkupProposalWithEvaluatorsModel.reviewStatusForResearch = data.reviewStatusForResearch;

    this._linkupProposalWithEvaluatorsService.update(this.linkupProposalWithEvaluatorsModel).subscribe(
      response => {
        if (response.success) {
          this.onInit();
          this.spinner3 = false;
          this._snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
        } else {
          this._snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
          this.spinner3 = false;
        }
      },
      error => {
        console.log('error ==== >>>> ', error);
        this._snackbarHelper.openErrorSnackBarWithMessage('HTTP error occured!.', ERROR);
        this.spinner3 = false;
      }
    );

  }

  getLinkupProposalWithEvaluatorsList() {
    this.spinner4 = true;
    this._linkupProposalWithEvaluatorsService.getAll().subscribe(
      response => {
        this.linkupProposalWithEvaluatorsList = response.items ? response.items : [];
        this.spinner4 = false;
        this.margeData();
      },
      error => {
        this.spinner4 = false;
      }
    );
  }

  margeData() {
    this.researcherProposalList = this.researcherProposalList.map(rp => {
      const findData = this.linkupProposalWithEvaluatorsList.find(lPwE => lPwE.researcherProposalId == rp.id);

      if (findData) {
        rp.linkupProposalWithEvaluatorsId = findData.id;
        rp.linkupProposalWithEvaluatorsUiId = findData.uuid;
        rp.stProfileOfExpertEvaluatorsId = findData.stProfileOfExpertEvaluatorsId;
        rp.stProfileOfExpertEvaluatorsIdForProMarks = findData.stProfileOfExpertEvaluatorsIdForProMarks;
        rp.stProfileOfExpertEvaluatorsIdForResearch = findData.stProfileOfExpertEvaluatorsIdForResearch;
        rp.subject = findData.subject;
        rp.subjectForProMarks = findData.subjectForProMarks;
        rp.subjectForResearch = findData.subjectForResearch;
        rp.mailBodyContent = findData.mailBodyContent;
        rp.mailBodyContentForProMarks = findData.mailBodyContentForProMarks;
        rp.mailBodyContentForResearch = findData.mailBodyContentForResearch;
        rp.isEditable = 0;
        rp.mailStatus = findData.mailStatus;
        rp.reviewStatus = findData.reviewStatus;
        rp.reviewStatusTemp = findData.reviewStatus;
        rp.mailStatusForProMarks = findData.mailStatusForProMarks;
        rp.reviewStatusForProMarks = findData.reviewStatusForProMarks;
        rp.reviewStatusForProMarksTemp = findData.reviewStatusForProMarks;
        rp.mailStatusForResearch = findData.mailStatusForResearch;
        rp.reviewStatusForResearch = findData.reviewStatusForResearch;
        rp.reviewStatusForResearchTemp = findData.reviewStatusForResearchTemp;

      } else {
        rp.linkupProposalWithEvaluatorsId = null;
        rp.stProfileOfExpertEvaluatorsId = null;
        rp.stProfileOfExpertEvaluatorsIdForProMarks = null;
        rp.stProfileOfExpertEvaluatorsIdForResearch = null;
      }
      return rp;
    });
    if (this.loginUserInfo.userType == 'Rms_Evaluator') {
      this.researcherProposalList = this.researcherProposalList.filter(f => { if (f.stProfileOfExpertEvaluatorsId || f.stProfileOfExpertEvaluatorsIdForProMarks || f.stProfileOfExpertEvaluatorsIdForResearch) return f });
      let evaluatorDtl = this.evaluatorList.find(f => f.userId == this.loginUserInfo.id);
      this.researcherProposalList = this.researcherProposalList.filter(f => {
        if ((f.stProfileOfExpertEvaluatorsId && (f.stProfileOfExpertEvaluatorsId == evaluatorDtl.id)) || (f.stProfileOfExpertEvaluatorsIdForProMarks && (f.stProfileOfExpertEvaluatorsIdForProMarks == evaluatorDtl.id)) || (f.stProfileOfExpertEvaluatorsIdForResearch && (f.stProfileOfExpertEvaluatorsIdForResearch == evaluatorDtl.id))) {

          if (f.stProfileOfExpertEvaluatorsId && (f.stProfileOfExpertEvaluatorsId == evaluatorDtl.id)) {
            f.evaluatorsUserId = evaluatorDtl.userId;
          }
          if (f.stProfileOfExpertEvaluatorsIdForProMarks && (f.stProfileOfExpertEvaluatorsIdForProMarks == evaluatorDtl.id)) {
            f.evaluatorsForProMarksUserId = evaluatorDtl.userId;
          }
          if (f.stProfileOfExpertEvaluatorsIdForResearch && (f.stProfileOfExpertEvaluatorsIdForResearch == evaluatorDtl.id)) {
            f.evaluatorsForResearchUserId = evaluatorDtl.userId;
          }

          return f;
        }
      });
    }
  }

  goToSendEmail(data: ResearcherProposal, index, viewFlag, emailFor) {

    if (!data.linkupProposalWithEvaluatorsId) {
      this._snackbarHelper.openErrorSnackBarWithMessage('Link Up With Evaluator After Send Email !.', ERROR);
      return;
    }

    if (!data.stProfileOfExpertEvaluatorsId && (emailFor == 'Evaluator')) {
      this._snackbarHelper.openErrorSnackBarWithMessage('Link Up With Evaluator After Send Email !.', ERROR);
      return;
    }

    if (!data.stProfileOfExpertEvaluatorsIdForProMarks && (emailFor == 'EvaluatorForProMarks')) {
      this._snackbarHelper.openErrorSnackBarWithMessage('Link Up With Evaluator After Send Email !.', ERROR);
      return;
    }

    if (!data.stProfileOfExpertEvaluatorsIdForResearch && (emailFor == 'EvaluatorForResearch')) {
      this._snackbarHelper.openErrorSnackBarWithMessage('Link Up With Evaluator After Send Email !.', ERROR);
      return;
    }

    this.linkupProposalWithEvaluatorsModel = new LinkupProposalWithEvaluatorsModel();
    this.linkupProposalWithEvaluatorsModel.id = data.linkupProposalWithEvaluatorsId;
    this.linkupProposalWithEvaluatorsModel.uuid = data.linkupProposalWithEvaluatorsUiId;
    this.linkupProposalWithEvaluatorsModel.researcherProposalId = data.id;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsIdForProMarks = data.stProfileOfExpertEvaluatorsIdForProMarks;
    this.linkupProposalWithEvaluatorsModel.stProfileOfExpertEvaluatorsIdForResearch = data.stProfileOfExpertEvaluatorsIdForResearch;

    this.linkupProposalWithEvaluatorsModel.subject = data.subject;
    this.linkupProposalWithEvaluatorsModel.subjectForProMarks = data.subjectForProMarks;
    this.linkupProposalWithEvaluatorsModel.subjectForResearch = data.subjectForResearch;

    this.linkupProposalWithEvaluatorsModel.mailBodyContent = data.mailBodyContent;
    this.linkupProposalWithEvaluatorsModel.mailBodyContentForProMarks = data.mailBodyContentForProMarks;
    this.linkupProposalWithEvaluatorsModel.mailBodyContentForResearch = data.mailBodyContentForResearch;

    this.linkupProposalWithEvaluatorsModel.isEditable = 0;
    this.linkupProposalWithEvaluatorsModel.mailStatus = data.mailStatus;
    this.linkupProposalWithEvaluatorsModel.mailStatusForProMarks = data.mailStatusForProMarks;
    this.linkupProposalWithEvaluatorsModel.mailStatusForResearch = data.mailStatusForResearch;

    this.linkupProposalWithEvaluatorsModel.reviewStatus = data.reviewStatus;
    this.linkupProposalWithEvaluatorsModel.reviewStatusForProMarks = data.reviewStatusForProMarks;
    this.linkupProposalWithEvaluatorsModel.reviewStatusForResearch = data.reviewStatusForResearch;

    this.linkupProposalWithEvaluatorsModel.viewFlag = viewFlag;
    this.linkupProposalWithEvaluatorsModel.emailFor = emailFor;


    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '70%';
    dialogConfig.height = 'auto';
    dialogConfig.data = { ...this.linkupProposalWithEvaluatorsModel };
    dialogConfig.scrollStrategy = this.scrollStrategy;

    const dialogRef = this._dialog.open(SendEmailModalNewComponent, dialogConfig);
    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        dialogRef.close(true);
        this.onInit();
      }
    });
  }

  getFiscalYearList() {
    this.spinner5 = true;
    this._fiscalYearService.getAllActive().subscribe(
      response => {
        this.fiscalYearList = response.items ? response.items : [];
        this.spinner5 = false;
      },
      error => {
        this.spinner5 = false;
      }
    );
  }

  getResearchCategoryTypeList() {
    this.spinner6 = true;
    this._researchCategoryTypeService.getAllActiveList().subscribe(
      response => {
        this.researchCategoryTypeList = response.items ? response.items : [];
        this.spinner6 = false;
      }
    );
  }

  onSelectFiscalYear(data: any) {
    if (data) {
      this.stFiscalYearId = data;
    }
    this.sendData.stFiscalYearId = this.stFiscalYearId ? this.stFiscalYearId : null;
    this.onInit();
  }

  onSelectResearchCategoryType(data: any) {
    if (data) {
      this.stResearchCatTypeId = data;
    }
    this.sendData.stResearchCatTypeId = this.stResearchCatTypeId ? this.stResearchCatTypeId : null;
    this.onInit();
  }

    onSelectResearchField(data: any) {
        if (data) {
            this.stSectorTypeId = data;
        }
        this.sendData.stSectorTypeId = this.stSectorTypeId ? this.stSectorTypeId : null;
        this.onInit();
    }


  onClickkViewDetails() {
    this._linkupProposalWithEvaluatorsSharedService.setData('researcherProposalList', this.researcherProposalList);
    this.router.navigate(['linkup-proposal-with-evaluators-view-details']);
  }

  download() {
    const selectedFiscalYear1 = this.selectedFiscalYear;
    const selectedResearchCategoryType1 = this.selectedResearchCategoryType;
    const selectedResearchSectorType1 = this.selectedResearchSectorType;
    let lang = localStorage.getItem("currentLang");
    this.genPdf(this.sendData, lang);
  }

  genPdf(data, lang) {
    this.spinner6 = true;
    this.jasperService.generateLinkupWithEvaluatorPdf(data, lang).subscribe((response) => {
      this.spinner6 = false;
      let file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, error => {
      this.spinner6 = false;
    });
  }

  downloadPdf($fileName = '') {
    this.dataPDF['fileName'] = $fileName;
    this.dataPDF['templateName'] = 'rms-reports/linkupProposalWithEvaluator';
    this.dataPDF['lng'] = localStorage.getItem("currentLang");
    this.dataPDF['sendData'] = JSON.stringify(this.sendData);
    this.dataPDF['researcherProposalList'] = JSON.stringify(this.researcherProposalList);

    //Optional
    this.dataPDF['view'] = 0; // 0 = false or 1 = true
    this.dataPDF['print_r'] = 0; // 0 = false or 1 = true
    let actionUrl = `${reportBackend}/pdf-generate-post`;
    bl2Js(this.dataPDF, actionUrl);
}

    showResearcherProposal(uuid: string) {
        this.router.navigate(['researcher-proposal-details/view/' + uuid]);
    }

}
