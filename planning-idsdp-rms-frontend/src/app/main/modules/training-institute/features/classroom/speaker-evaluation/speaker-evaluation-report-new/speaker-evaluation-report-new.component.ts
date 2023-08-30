import { Component, OnInit } from '@angular/core';
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { MatTableDataSource } from '@angular/material/table';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { SpeakerEvaluationService } from 'app/main/modules/training-institute/services/speaker-evaluation.service';
import { PageEvent } from '@angular/material/paginator';
import { CommonTypeService } from 'app/main/modules/settings/services/common-type.service';

@Component({
  selector: 'app-speaker-evaluation-report-new',
  templateUrl: './speaker-evaluation-report-new.component.html',
  styleUrls: ['./speaker-evaluation-report-new.component.scss']
})
export class SpeakerEvaluationReportNewComponent implements OnInit {


  displayedColumns: string[] = ['sl', 'sessionTopic', 'courseTitle', 'sessionTitle', 'speakerName', 'qus', 'good', 'very_good', 'excellent'];

  spinner: Boolean;
  spinner2: Boolean;
  questionList: any[] = [];

  dataSource: any = [];
  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;

  sendDataForGrid: {
    stCommonTypeId: number,
    proposalId: number,
    trainerId: number,
    sessionId: number,

    pageableRequestBodyDTO: {
      page: number,
      size: number
    }

  } = {
      stCommonTypeId: null,
      proposalId: null,
      trainerId: null,
      sessionId: null,
      pageableRequestBodyDTO: {
        page: this.page,
        size: this.pageSize
      }
    };

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _speakerEvaluationService: SpeakerEvaluationService,
    private _commonTypeService: CommonTypeService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.onInit();
  }


  onInit() {
    this.getGridList();
    this.getQuestions();
  }

  getGridList() {
    this.spinner = true;
    this._speakerEvaluationService.gridList(this.sendDataForGrid).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content ? res.content : []);
        this.totalElements = res.totalElements;
        this.spinner = false;
      },
      error => {
        this.spinner = false;
      }
    );
  }


  onPageChange(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page 
    this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
    this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
    this.onInit();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getQuestions() {
    this.spinner2 = true;
    this._commonTypeService.findAllByActiveData(12).subscribe(
      res => {
        this.questionList = res;
        this.spinner2 = false;
      },
      error => {
        console.log(error);
        this.spinner2 = false;
      }
    )
  }

  getQuesName(id: number) {
    if (!id) {
      return 'NOT FOUND !.';
    }
    let f = this.questionList.find(f => f.id == id);
    if (f) {
      return f.typeName;
    }
    return 'NOT FOUND !.';
  }

}
