import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { downloadIcon, previousIcon, printIcon } from 'app/main/modules/settings/constants/button.constants';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { noteIcon } from 'app/main/modules/training-institute/constants/button.constants';
import { ToastrService } from 'ngx-toastr';
import { JasperServiceService } from '../../../services/jasper-service.service';
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { SeminarService } from '../../../services/seminar.service';
import { locale as lngBangla } from "../../researcher-profile-information/i18n/bn";
import { locale as lngEnglish } from "../../researcher-profile-information/i18n/en";
import {reportBackend} from 'environments/environment';
import * as bl2Js from 'bl2-js-report';

@Component({
  selector: 'app-seminar-view-details',
  templateUrl: './seminar-view-details.component.html',
  styleUrls: ['./seminar-view-details.component.scss']
})
export class SeminarViewDetailsComponent implements OnInit {


  previousIcon = previousIcon;
  downloadIcon = downloadIcon;
  printIcon = printIcon;
  noteIcon = noteIcon;
  loginUserInfo: any;
  id: any
  uuid: any
  seminarModelForCreate: any
  seminarDetails: any
  spinner: boolean = false;
  userList: any[] = [];
  name: string;
  spinner1: boolean = false;
  spinner2: boolean = false;
  spinner3: boolean = false;
  spinner4: boolean = false;
  spinner5: boolean = false;
  spinner6: boolean = false;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  langVal: string;

  timeScheduleLeadList: any[] = new Array();
  timeScheduleResearcherList: any[] = new Array();
  timeScheduleOthersList: any[] = new Array();
  data: any = {};

  constructor(
    private _researchProfileMultiFormService: ResearchProfileMultiFormService,
    private activateRoute: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private userListService: UserListServiceService,
    private router: Router,
    private _toastrService: ToastrService,
    private _seminarService: SeminarService,
    private storageService: StorageService,
    private jasperService: JasperServiceService,
    private dataCom: DataComService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.paramMap.get('id')
    this.uuid = this.activateRoute.snapshot.paramMap.get('uuid')
    let userData = this.storageService.getUserData();
    this.getViewPageData(this.uuid);
    this.seminarDetailsFindBySeminarId();

    this.langVal = localStorage.getItem('currentLang');
        this.dataCom.getPassedItemData.subscribe((res) => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
  }


  getViewPageData(uuid: number) {
    this._seminarService.getSeminarById(this.id).subscribe(
      res => {
        this.seminarModelForCreate = res.obj;
        if (this.seminarModelForCreate && this.seminarModelForCreate.createSeminarTimeScheduleOptional) {
          this.timeScheduleLeadList = this.seminarModelForCreate.createSeminarTimeScheduleOptional.filter(f => f.positionInSeminar == 'Lead');
          this.timeScheduleResearcherList = this.seminarModelForCreate.createSeminarTimeScheduleOptional.filter(f => f.positionInSeminar == 'Researcher');
          this.timeScheduleOthersList = this.seminarModelForCreate.createSeminarTimeScheduleOptional.filter(f => f.positionInSeminar == 'Others');

          console.log('timeScheduleResearcherList ===== >>>>> ', this.timeScheduleResearcherList);
        }
      }, error => {
        this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
      }
    )

  }

  back() {
    this.router.navigate(['/seminars']).then(r => console.log(r));
  }
  download(info){

  }
  download2($downloadFileName, $templateName) {

    this.data['fileName'] = $downloadFileName;
    this.data['templateName'] = 'rms-reports/seminar/' +$templateName;
    this.data['lng'] = localStorage.getItem("currentLang");

    this.data["seminarDetails"] = JSON.stringify(this.seminarDetails);

    console.log(this.data);
    //Optional
    this.data['view'] = 0; // 0 = false or 1 = true
    this.data['print_r'] = 0; // 0 = false or 1 = true
    let actionUrl = `${reportBackend}/pdf-generate-post`;
    bl2Js(this.data, actionUrl);


    // let lang = localStorage.getItem("currentLang");
    // this.spinner2 = true;
    // this.jasperService.generateSeminarPdf(this.id, lang, viewNumber).subscribe((response) => {
    //   this.spinner2 = false;
    //   let file = new Blob([response], { type: 'application/pdf' });
    //   var fileURL = URL.createObjectURL(file);
    //   window.open(fileURL);
    // }, error => {
    //   this.spinner2 = false;
    // });
  }

  print() {

  }


  seminarDetailsFindBySeminarId() {
    this.spinner3 = true;
    this._seminarService.seminarDetailsFindBySeminarId(this.id).subscribe(
      responre => {
        this.seminarDetails = responre.obj;
        this.spinner3 = false;
      },
      error => {
        this.spinner3 = false;
      }
    );
  }


  getYear(data: any) {
    if (!data) {
      return;
    }   
    return new Date(data).getFullYear();
  }

}
