import { Component, OnDestroy, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ResearcherProposal } from 'app/main/modules/rpm/models/ResearcherProposal';
import { LinkupProposalWithEvaluatorsSharedService } from 'app/main/modules/rpm/services/linkup-proposal-with-evaluators-shared.service';
import { Subject } from 'rxjs/internal/Subject';
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { addNewIcon, downloadIcon, editIcon, noteIcon, previousIcon, printIcon } from 'app/main/modules/training-institute/constants/button.constants';
import { ExpertEvaluatorService } from 'app/main/modules/settings/services/expert-evaluator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linkup-proposal-with-evaluators-view-details',
  templateUrl: './linkup-proposal-with-evaluators-view-details.component.html',
  styleUrls: ['./linkup-proposal-with-evaluators-view-details.component.scss']
})
export class LinkupProposalWithEvaluatorsViewDetailsComponent implements OnInit, OnDestroy {


  subject$: any;
  researcherProposalList: ResearcherProposal[] = [];
  evaluatorList: any[] = [];

  /*----Button---*/
  previousIcon = previousIcon;
  downloadIcon = downloadIcon;
  printIcon = printIcon;
  noteIcon = noteIcon;
  editIcon = editIcon;
  addNewIcon = addNewIcon;
  /*----/Button---*/

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _linkupProposalWithEvaluatorsSharedService: LinkupProposalWithEvaluatorsSharedService,
    private _expertEvaluatorService: ExpertEvaluatorService,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }


  ngOnInit(): void {
    this.getData();
    this.getExpertEvaluatorList();
  }


  getData() {
    this.subject$ = this._linkupProposalWithEvaluatorsSharedService.observable$.subscribe(
      res => {
        this.researcherProposalList = res.researcherProposalList;
        console.log('data from service === >>>> ', this.researcherProposalList);
      }
    );
  }


  ngOnDestroy(): void {
    this.subject$.unsubscribe();
  }

  goPrevious() {
    this.router.navigate(['linkup-proposal-with-evaluators']);
  }

  print(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
    document.body.innerHTML = originalContents;
  }

  download() {

  }

  getExpertEvaluatorList() {
    this._expertEvaluatorService.getAll().subscribe(
      response => {
        console.log('response ==== >>>> ', response);
        this.evaluatorList = response.items ? response.items : [];
      }
    );
  }


  getEvaluatorDetails(evaluatorId) {

    if (!evaluatorId) {
      return '';
    }

    let data = this.evaluatorList.find(f => f.id === evaluatorId);
    console.log('data ==== >>>> ', data);
    if (data) {
      return data;
    }

    return '';
  }

}
