import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { FaqModule } from '../../../model/faq-module.model';
import { FaqService } from '../../../services/faq.service';

@Component({
  selector: 'app-guide-line',
  templateUrl: './guide-line.component.html',
  styleUrls: ['./guide-line.component.scss']
})
export class GuideLineComponent implements OnInit {

  @ViewChild('guidelineModal') guidelineModal: TemplateRef<any>;
  isLoading: boolean;
  isShow: boolean;
  fileBaseUrl: string;
  moduleList: FaqModule[] = [];
  guidelineList: any[] = [];
  guideline: any = {};
  moduleId: string;

  constructor(
    private faqService: FaqService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.fileBaseUrl = environment.ibcs.baseApiEndPoint+'api/';
    this.getActiveModuleList();
    this.getGuidelineList(null);
  }

  getActiveModuleList(){
    this.isLoading = true;
    this.faqService.getDevModuleList().subscribe(
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

  getGuidelineList(moduleId){
    this.isLoading = true;
    this.faqService.getGuidelineList({imsModuleId:moduleId}).subscribe(
      res => {
        if(res){
          this.guidelineList = res;
        }
        this.isLoading = false;
      },
      err =>{
        console.log('getGuidelineList : ', err);
        this.isLoading = false;
      }
    );
  }

  selectModule(moduleId){
    this.moduleId = this.moduleId == moduleId ? null : moduleId;
    this.guidelineList = [];
    this.getGuidelineList(this.moduleId);
  }

  viewAttachment(fileUrl){
    window.open(this.fileBaseUrl+fileUrl);
  }

  openDetailsDialog(guideline) {
    this.guideline = guideline;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.height = 'auto';
    dialogConfig.data = this.guideline;

    let modalRef = this._dialog.open(this.guidelineModal, dialogConfig);
    // this.questionDialogRef.componentInstance.closeEventEmitter.subscribe(res => {
    //   if (res) {
    //     this.closeQuestionModal();
    //   }
    // });
  }

}
