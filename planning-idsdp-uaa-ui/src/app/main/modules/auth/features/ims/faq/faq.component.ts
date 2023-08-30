import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { FaqModule } from '../../../model/faq-module.model';
import { FaqService } from '../../../services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  @ViewChild('questionModal') questionModal: TemplateRef<any>;
  moduleList: FaqModule[] = [];
  questionList: any[] = [];

  questionName: string;
  moduleId: string = null;
  isSearch: boolean;
  isLoading: boolean;
  imgBaseUrl: string;
  questionDialogRef: any;

  constructor(
    private faqService: FaqService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.imgBaseUrl = environment.ibcs.baseApiEndPoint+'api/';
    this.getActiveModuleList();
  }

  getActiveModuleList(){
    this.isLoading = true;
    this.faqService.getImsModuleList().subscribe(
      res => {
        if(res){
          this.moduleList = res;
        }
        this.isLoading = false;
      },
      err =>{
        console.log('getActiveModuleList : ', err);
        this.isLoading = false;
      }
    );
  }

  getQuestionListBy(){
    this.isSearch = true;
    let reqObj: any = {imsModuleId: this.moduleId, searchText: this.questionName};
    this.faqService.getQuestionList(reqObj).subscribe(
      res => {
        if(res){
          this.questionList = res;
        }
        this.openMarkDialog();
        this.isSearch = false;
      },
      err =>{
        console.log('getQuestionListBy : ', err);
        this.isSearch = false;
      }
    );
  }

  selectModule(moduleId){
    this.moduleId = this.moduleId == moduleId ? null : moduleId;
  }

  openMarkDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.height = 'auto';
    dialogConfig.data = this.questionList;

    this.questionDialogRef = this._dialog.open(this.questionModal, dialogConfig);
    // this.questionDialogRef.componentInstance.closeEventEmitter.subscribe(res => {
    //   if (res) {
    //     this.closeQuestionModal();
    //   }
    // });
  }

  // closeQuestionModal(){
  //   this.questionDialogRef.close(true);
  // }

}
