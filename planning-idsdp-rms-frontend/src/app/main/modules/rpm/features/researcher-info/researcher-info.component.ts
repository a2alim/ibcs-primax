import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ResearcherProposal } from '../../models/ResearcherProposal';
import { JasperServiceService } from '../../services/jasper-service.service';
import { ResearcherProposalService } from '../../services/researcher-proposal.service';
import { pdfIcon } from '../../constants/button.constants';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ERROR } from 'app/main/core/constants/message';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';

@Component({
  selector: 'app-researcher-info',
  templateUrl: './researcher-info.component.html',
  styleUrls: ['./researcher-info.component.scss']
})
export class ResearcherInfoComponent implements OnInit {

  spinner: boolean = false;
  spinner1: boolean = false;
  spinner2: boolean = false;

  spinner3: boolean = false;
  spinner4: boolean = false;
  spinner5: boolean = false;
  spinner6: boolean = false;

  pdfIcon = pdfIcon;

  researchInformation: ResearcherProposal = new ResearcherProposal();
  //587b12a9-84c7-41fc-b0d6-1fe8b2da1bec f269d034-c0fa-4cad-8268-b59df646c795
  researcherProposalUuid: string;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private researcherProposalService: ResearcherProposalService,
    private route: ActivatedRoute,
    private router: Router,
    private jasperService: JasperServiceService,
    private snackbarHelper: SnackbarHelper
  ) {
     this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.researcherProposalUuid = params['uuid'];
      if (this.researcherProposalUuid) {
        this.getResearchInformation();
      }
    });
  }


  getResearchInformation() {
    this.spinner = true;
    this.researcherProposalService.getResearchInformation(this.researcherProposalUuid).subscribe(
      response => {
        console.log('response ===>>>> ', response);
        if (response.success && response.obj) {
          this.researchInformation = response.obj;
        }
        this.spinner = false;
      },
      error => {
        console.log('error ===>>>> ', error);
        this.spinner = false;
      }
    );
  }

  // ======================= ****************** =========================

  goToAgreementInformation() {

    if (!this.researchInformation.agreementWithResearcherResponseDto) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Agreement not created yeat!.', ERROR);
      return;
    }

    this.router.navigate([`agreement-process/${this.researchInformation.agreementWithResearcherResponseDto.uuid}/view`]);
  }

  goToProfileInformation() {

    if (!this.researchInformation.researcherProfilePersonalInfoDto) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Profile not created yeat!.', ERROR);
      return;
    }

    this.router.navigate([`researcher-profile-information/${this.researchInformation.researcherProfilePersonalInfoDto.uuid}/view`]);
  }

  goToProposalInformation() {

    if (!this.researchInformation) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Research Information not created yeat!.', ERROR);
      return;
    }

    this.router.navigate([`researcher-proposal-details/view/${this.researchInformation.uuid}`]);
  }

  goToProfileMarks() {

    if (!this.researchInformation) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Profile Marks not created yeat!.', ERROR);
      return;
    }

    this.router.navigate(['researcher-profile-institution-research-marks/afefcbba-0918-46a5-bbd9-f1d4b278c7b2']);
  }

  goToProposalMarks() {

    if (!this.researchInformation) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Proposal Marks not created yeat!.', ERROR);
      return;
    }

    this.router.navigate([`researcher-proposal-marks/${this.researchInformation.uuid}`]);
  }

  //================= ****************** ======================

  goToFeedback() {

    if (!this.researchInformation) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Researcher proposal not found !.', ERROR);
      return;
    }

    this.router.navigate([`feedback-list/${this.researchInformation.uuid}`]);
  }





  // download Agreement
  downloadAgreement() {
    let lang = localStorage.getItem("currentLang");
    this.genAgreementPdf(lang);
  }

  //for pdf gen
  genAgreementPdf(lang) {

    if (!this.researchInformation.agreementWithResearcherResponseDto) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Agreement not created yeat!.', ERROR);
      return;
    }

    this.spinner2 = true;
    this.jasperService.generateAgreementPdf(this.researchInformation.agreementWithResearcherResponseDto.uuid, lang).subscribe((response) => {
      this.spinner2 = false;
      let file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, error => {
      this.spinner2 = false;
    });
  }
  // ======================== ##################### ======================


  // download Profile
  downloadProfile() {
    let lang = localStorage.getItem("currentLang");
    this.genProfilePdf(lang);
  }

  genProfilePdf(lang) {

    if (!this.researchInformation.researcherProfilePersonalInfoDto) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Profile not created yeat!.', ERROR);
      return;
    }

    this.spinner3 = true;
    this.jasperService.generateProfilePdf(this.researchInformation.researcherProfilePersonalInfoDto.uuid, lang).subscribe((response) => {
      this.spinner3 = false;
      let file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, error => {
      this.spinner3 = false;
    });
  }
  // ======================== ##################### ======================

  // download Proposal
  downloadProposal() {
    let lang = localStorage.getItem("currentLang");
    this.genProposalPdf(lang);
  }

  genProposalPdf(lang) {

    if (!this.researchInformation) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Researcher proposal not found !.', ERROR);
      return;
    }

    this.spinner4 = true;
    this.jasperService.proposalPdf(this.researchInformation.uuid, lang).subscribe((response) => {
      this.spinner4 = false;
      let file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, error => {
      this.spinner4 = false;
    });
  }
  // ======================== ##################### ======================


  // download Proposal
  downloadFeedback() {

    if (!this.researchInformation) {
      this.snackbarHelper.openErrorSnackBarWithMessage('Researcher proposal not found !.', ERROR);
      return;
    }

    this.spinner5 = true;
    let lang = localStorage.getItem("currentLang");
    this.jasperService.generateProposalFeedbackPdf(this.researchInformation.uuid, lang).subscribe((response) => {
      this.spinner5 = false;
      let file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, error => {
      this.spinner5 = false;
    });
  }
  // ======================== ##################### ======================


  calculateSubTotal() {
    if (!this.researchInformation.agreementInstallmentResponseDtoList) {
      return 0;
    }
    return this.researchInformation.agreementInstallmentResponseDtoList.map(m => m.tkAmount).reduce((a1, a2) => a1 + a2, 0);
  }

  calculateTotalGrantAmount() {
    return 0;
  }

  calculateReceivableAmount() {
    if (!this.researchInformation.agreementInstallmentResponseDtoList) {
      return 0;
    }

    if (!this.researchInformation.agreementWithResearcherResponseDto) {
      return 0;
    }
    return this.researchInformation.agreementWithResearcherResponseDto.totalGrantAmount - this.researchInformation.agreementInstallmentResponseDtoList.map(m => m.tkAmount).reduce((a1, a2) => a1 + a2, 0);
  }





}
