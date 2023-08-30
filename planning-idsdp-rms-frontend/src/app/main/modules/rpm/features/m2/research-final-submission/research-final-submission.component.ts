import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ToastrService } from 'ngx-toastr';
import { addNewIcon, deleteIcon, editIcon, previousIcon, refreshIcon, saveIcon, viewIcon } from '../../../constants/button.constants';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ResearchFinalSubmissionService } from '../../../services/research-final-submission.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import {MIN_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";

@Component({
  selector: 'app-research-final-submission',
  templateUrl: './research-final-submission.component.html',
  styleUrls: ['./research-final-submission.component.scss']
})
export class ResearchFinalSubmissionComponent implements OnInit {

  @ViewChild('rchFinalSubmissionForm') rchFinalSubmissionForm: NgForm;
  /*----Button---*/
  refreshIcon = refreshIcon;
  saveIcon = saveIcon;
  editIcon = editIcon;
  deleteIcon = deleteIcon;
  addNewIcon = addNewIcon;
  previousIcon = previousIcon;
  viewIcon = viewIcon;
  /*----/Button---*/

  spinner: boolean = false;
  finalSubmissionForm: FormGroup;
  proposalList: any = [];
  userInfo: any = {};
  m1ResearcherProfilePersonalInfoId: number;
  m1ResearcherProposalId: number;
  proposalUuid: string;
  id: number;
  uuid: string;
  status: string;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
  constructor(
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private toaster: ToastrService,
    private storageService: StorageService,
    private activateRoute: ActivatedRoute,
    private _router: Router,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private researchFinalSubmissionService: ResearchFinalSubmissionService,
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
  }

  ngOnInit(): void {
    this.createForm();

    this.m1ResearcherProfilePersonalInfoId = Number(this.activateRoute.snapshot.paramMap.get('m1ResearcherProfilePersonalInfoId'));
    this.m1ResearcherProposalId = Number(this.activateRoute.snapshot.paramMap.get('m1ResearcherProposalId'));
    this.proposalUuid = this.activateRoute.snapshot.paramMap.get('proposalUuid');
    this.userInfo = this.storageService.getUserData();
    this.findByResearcherProposalId();
  }

  createForm(){
    this.finalSubmissionForm = this.formBuilder.group({
      id: [],
      uuid: [],
      m1ResearcherProfilePersonalInfoId: [Validators.required],
      m1ResearcherProposalId: [Validators.required],
      m1ResearcherTitle:[''],
      submissionDate: [Validators.required],
      objectSummary: [Validators.required],
      introduction: [Validators.required],
      background: [Validators.required],
      methodFollowedInTheResearch: [Validators.required],
      findings: [],
      discussion: [],
      policy: [],
      generalRecommendation: [],
      hashTag: [],
      hashTagBn:[],
      conclusion: [Validators.required],
      status: [],
      isFinalSubmit:false,
    });
  }

  findByResearcherProposalId() {
    if (!this.m1ResearcherProposalId) {
      this.toaster.warning('Researcher Proposal ID Not Found!');
      return;
    }
    this.researchFinalSubmissionService.findByResearcherProposalId(this.m1ResearcherProposalId).subscribe(
      response => {
        if (response && response.obj) {
          this.id = response.obj.id;
          this.uuid = response.obj.uuid;
          this.status = response.obj.status;
          this.finalSubmissionForm.patchValue(response.obj);
        } else {
          this.finalSubmissionForm.patchValue({
            m1ResearcherProposalId: this.m1ResearcherProposalId,
            m1ResearcherProfilePersonalInfoId: this.m1ResearcherProfilePersonalInfoId
          });
        }
      },
      error => {
        console.log('error', error);
      }
    );

    this.researchFinalSubmissionService.getProposalInfoByUuid(this.proposalUuid).subscribe(
      response => {
        if (response && response.obj) {
          this.finalSubmissionForm.patchValue({
            m1ResearcherTitle: response.obj.researchTitle
          });
        }
      })
  }


  saveOrUpdate(data){

    if(data.objectSummary.split(' ').length < 1000){
      this.toaster.warning('Object summary Can\'t be less than 1000 words');
      this.finalSubmissionForm.get('objectSummary').setErrors(Validators.required);
      return;
    }

    this.researchFinalSubmissionService.onSaveOrUpdate(data).subscribe(
      response =>{
        if (response && response.success) {
          this.toaster.success(response.message);
          this.resetFormValue();
          this._router.navigate(['view-final-report-of-research-submission/'+this.m1ResearcherProfilePersonalInfoId+"/"+this.m1ResearcherProposalId+"/"+this.proposalUuid]);
        }else{
          this.toaster.warning(response.message);
        }
      },
      error =>{
        console.log('save or update error =>', error);
      }
    );
  }

  resetFormValue() {
    this.finalSubmissionForm.reset();
    this.rchFinalSubmissionForm.resetForm();
    setTimeout(() => {
      this.finalSubmissionForm.patchValue({
        id: this.id,
        uuid: this.uuid,
        status: this.status,
        m1ResearcherProposalId: this.m1ResearcherProposalId,
        m1ResearcherProfilePersonalInfoId: this.m1ResearcherProfilePersonalInfoId
      });
    }, 500);
  }


  onClickPrevious() {
    this._router.navigate(['/researcher/list']);
  }

  onClickView() {
    if(!this.id){
      this.toaster.warning("Please Save First, Final Submission Of Research");
      return;
    }
    this._router.navigate(['view-final-report-of-research-submission/'+ this.m1ResearcherProfilePersonalInfoId +"/"+this.m1ResearcherProposalId+"/"+this.proposalUuid]);
  }

}
