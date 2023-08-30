import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ToastrService } from 'ngx-toastr';
import { refreshIcon, saveIcon } from '../../../constants/button.constants';
import { FinalEvaluationReportService } from '../../../services/final-evaluation-report.service';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { FinalEvaluationReportModel } from '../../../models/final-evaluation-report.model';
import {MIN_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";

@Component({
  selector: 'app-final-evaluation-report-form',
  templateUrl: './final-evaluation-report-form.component.html',
  styleUrls: ['./final-evaluation-report-form.component.scss']
})
export class FinalEvaluationReportFormComponent implements OnInit {

  /*----Button Icon Text---*/
  saveIcon = saveIcon;
  refreshIcon = refreshIcon;
  /*----/Button Icon Text---*/

  spinner: boolean = false;

  @ViewChild('finalEvlRep') finalEvlRep: NgForm;
  formGroup: FormGroup;

  finalEvaluationReportModel: FinalEvaluationReportModel = new FinalEvaluationReportModel();
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private finalEvaluationReportService: FinalEvaluationReportService,
    private fuseTranslationLoaderService: FuseTranslationLoaderService,
    private activateRoute: ActivatedRoute,
  ) {
    // Language translations
    this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.finalEvaluationReportModel.uuid = this.activateRoute.snapshot.paramMap.get('uuid');
    this.finalEvaluationReportModel.m1ResearcherProposalInfoId = Number(this.activateRoute.snapshot.paramMap.get('m1ResearcherProposalInfoId'));
  }

  ngOnInit(): void {
    this.createForm();
    if (this.finalEvaluationReportModel.uuid) {
      this.findByUuid(this.finalEvaluationReportModel.uuid);
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      id: [''],
      uuid: [''],
      m1ResearcherProposalInfoId: [this.finalEvaluationReportModel.m1ResearcherProposalInfoId],
      researchObjectives: ['', [Validators.required]],
      describeProblem: ['', [Validators.required]],
      note: ['', [Validators.required]],
      isResearchRulesAreFollowed: [''],
      isEditable: [''],
      isActive: [true],
    });
  }

  findByUuid(uuId) {
    this.spinner = true;
    this.finalEvaluationReportService.getByUuid(uuId).subscribe(
      res => {
        if (res.success) {
          this.formGroup.patchValue(res.obj);
          this.finalEvaluationReportModel = res.obj;
        }
        this.spinner = false;
      },
      err => {
        this.spinner = false;
        console.log('find by uuid err', err);
      }
    )
  }


  submitForm() {

    if (this.formGroup.invalid) {
      this.toastr.warning('Please Fill Required Field !');
      return;
    }

    this.spinner = true;
    this.finalEvaluationReportModel = this.formGroup.value;

    this.finalEvaluationReportService.createOrUpdate(this.finalEvaluationReportModel).subscribe(
      res => {
        if (res.success) {
          this.toastr.success(res.message);
          this.finalEvaluationReportModel = new FinalEvaluationReportModel();
          this.resetFormValue();
          this.goToListPage();
        } else {
          this.toastr.warning(res.message);
        }
        this.spinner = false;
      },
      err => {
        this.spinner = false;
        console.log('create err', err);
        this.toastr.error("Error Occured!");
      }
    )
  }

  resetFormValue() {
    this.formGroup.reset();
    this.finalEvlRep.resetForm();
    setTimeout(() => {
      this.formGroup.patchValue({
        m1ResearcherProposalInfoId: this.finalEvaluationReportModel.m1ResearcherProposalInfoId,
        isActive: true,
        id: this.finalEvaluationReportModel.id,
        uuid: this.finalEvaluationReportModel.uuid,
      });
    }, 500);
  }

  goToListPage(): void {
    this.router.navigate(['final-evaluation-report']);
  }

}
