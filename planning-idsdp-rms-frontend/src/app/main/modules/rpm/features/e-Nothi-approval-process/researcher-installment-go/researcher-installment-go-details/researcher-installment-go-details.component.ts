import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { EnothiApprovalModel } from 'app/main/modules/rpm/models/EnothiApprovalModel';
import { ApprovalDataModel } from 'app/main/modules/rpm/models/eNothiModels/ApprovalDataModel';
import { downloadIcon } from 'app/main/modules/training-institute/constants/button.constants';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { addNewIcon, deleteIcon, editIcon, previousIcon, viewIcon } from '../../../../constants/button.constants';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';

@Component({
  selector: 'app-researcher-installment-go-details',
  templateUrl: './researcher-installment-go-details.component.html',
  styleUrls: ['./researcher-installment-go-details.component.scss']
})
export class ResearcherInstallmentGoDetailsComponent implements OnInit {

  /*----Button---*/
  editIcon = editIcon; deleteIcon = deleteIcon;
  addNewIcon = addNewIcon; viewIcon = viewIcon;
  previousIcon = previousIcon; downloadIcon = downloadIcon;
  /*----/Button---*/
  
  langVal: string;
  subscription: Subscription;
  
  enothiApprovalModel : EnothiApprovalModel = new EnothiApprovalModel();
  approvalDataModel = new ApprovalDataModel();
  
  baseUrl  = environment.ibcs.rpmBackend+'api/eNothi-approval/';
  nothiUrl = environment.ibcs.nothiServerUrl;
  downloadUrl= environment.ibcs.minioEndPointHost;
  
  isEnLabel: boolean;
  movementStatusList = [];
  nothiStatus = 'Draft';
  potroJari: boolean = false;
  potroUrl = null;
  isNoteCompletetion: boolean = false;
  CreatedByName:string = '';
  
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  showModal = false;
  
    constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private router: Router,
      private api: ApiService,
      private cookieService: CookieService,
      private toastr: ToastrService,
      private dataCom: DataComService
    ) { 
  
      this.langVal = localStorage.getItem("currentLang")
      this.dataCom.getPassedItemData.subscribe(res => {
          if (res?.lang) {
              this.langVal = res?.lang ? res?.lang : '';
          }
      });
  
       // Language translations
       this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }
  
    async ngOnInit() {
      let data = await sessionStorage.getItem('information');
      this.approvalDataModel =  await JSON.parse(data);
  
      await this.getUserById(this.approvalDataModel.createdBy);
      await this.getFeedbackListFromEnothi(this.approvalDataModel.uuid)
    }
  
    downloadFile(fileInfo){
      window.open(this.downloadUrl + fileInfo, '_blank');
    }
  
    back(){
      this.router.navigate(['e-Nothi/researcher-agreement-list']);
    }
  
    sendToEnothi(){
      this.showModal = true;
    }
  
    getUserById(userId){
      this.api.get(this.baseUrl+'find-user-by-id/'+userId).subscribe(
        res => {
          this.CreatedByName = res?.name ? res?.name : '';
        })
    }
  
    confirm(){
      this.approvalDataModel.doptor_token = localStorage.getItem('doptor_token');
      //this.approvalDataModel.doptor_token = this.cookieService.get('doptor_token');
      
      this.enothiApprovalModel.reportList.push(
        {
          name : this.approvalDataModel.fileName,
          url : this.downloadUrl+this.approvalDataModel.fileDownloadUrl
        });
  
      this.enothiApprovalModel.application_subject = this.approvalDataModel.subject;
      this.enothiApprovalModel.data = this.approvalDataModel.note;
      this.enothiApprovalModel.name = this.approvalDataModel.fileDownloadUrl;
      this.enothiApprovalModel.projectConceptUuid = this.approvalDataModel.uuid;
      this.enothiApprovalModel.sourceModule = "RMS";
      this.enothiApprovalModel.srcUserGroup = "AGENCY";
      this.enothiApprovalModel.name = this.approvalDataModel.fileName;
      this.enothiApprovalModel.url = this.downloadUrl+this.approvalDataModel.fileDownloadUrl
    
  
      this.api.postNothiData(this.nothiUrl+'submit-application?module=rms', this.enothiApprovalModel).subscribe(
        res => {
          if (res.status == 'success') {
           this.toggleModal();
           this.toastr.success("File successfully uploaded in e-Nothi", "", this.config);  
              /*------------------Data will be update----------------*/
              var formData = new FormData();
              
              this.approvalDataModel['dakReceivedNo'] = res?.data?.dak_received_no
              this.approvalDataModel['dakId'] = res?.data?.dak_id
              this.approvalDataModel['currentDeskId'] = res?.data?.current_desk_id
              this.approvalDataModel['isSent'] = true;
  
              formData.append('file','');
              formData.append('body', JSON.stringify(this.approvalDataModel));        
              this.api.update(this.baseUrl + 'edit', formData).subscribe(
                res => {
                  if (res.success > 0) {
                    console.log('success');
                  }
                  else
                  {
                  console.log('error');
                  }         
                }
              )
              /*------------------Data will be update----------------*/
          }
          else
          {
            this.toggleModal();
            this.toastr.success(res.message, "", this.config); 
          }         
        },
        err => {
          this.toggleModal();
          this.toastr.success("res", "", this.config); 
        }
      )
    }
  
    toggleModal(){
      this.showModal = !this.showModal;
    }
  
    getFeedbackListFromEnothi(uuId){
      let url = 
      this.api.get(this.nothiUrl+'feedbacks-by-id/?src-user-group=AGENCY&pc-uuid='+ uuId  +'&fs-uuid=null&dpp-uuid=null&tapp_uuid=null').subscribe(
        res => {
          if (res.message == 'Got Feedback') {
            this.movementStatusList = res.result;
            if (res.result[0].nothi_message != null) {
                this.nothiStatus = res.result[0].nothi_message;
            } else if (res.result[0].decision_note != null) {
                this.nothiStatus = res.result[0].decision_note;
            }
          } 
          else if (res.message == 'No Feedback')
          {
                  this.nothiStatus = this.isEnLabel ? 'Submitted as a Daak to E-Nothi' : 'ই-নথিতে ডাক জমা দেওয়া হয়েছে';
          }
          else if (res.message == 'Daak is not submitted')
          {
                    this.nothiStatus = this.nothiStatus;
          }
          else
          {
              this.nothiStatus = this.isEnLabel ? 'AGENCY' : 'এজেন্সী';
          }
  
          //potro jari
          // if (res?.result[0]?.nothi_action == 4) {
          //   this.potroJari = true;
          //   this.potroUrl = res?.result[0]?.potro_url;
          // }
          //note
          // if (res?.result[0]?.nothi_action == 3) {
          //     this.isNoteCompletetion = true;
          // }
          
        })
    }
  
  }
  