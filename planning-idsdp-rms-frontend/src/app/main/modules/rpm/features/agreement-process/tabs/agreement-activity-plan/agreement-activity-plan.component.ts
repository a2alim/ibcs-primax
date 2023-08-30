import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { locale as lngEnglish } from "../../i18n/en";
import { locale as lngBangla } from "../../i18n/bn";

import {
  addNewIcon,
  nextIcon,
  previousIcon,
  refreshIcon,
  saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { ResearcherProposalActionPlanService } from 'app/main/modules/rpm/services/researcher-proposal-action-plan.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { ToastrService } from 'ngx-toastr';
import { ResearcherProposalActionPlan } from 'app/main/modules/rpm/models/ResearcherProposalActionPlan';

@Component({
  selector: 'app-agreement-activity-plan',
  templateUrl: './agreement-activity-plan.component.html',
  styleUrls: ['./agreement-activity-plan.component.scss']
})
export class AgreementActivityPlanComponent implements OnInit {
  @Output() nextStep = new EventEmitter<boolean>();
  @Output() backPrevious = new EventEmitter<boolean>();
  @Input() getRMSagreementDate : any;
  @Input() getRMSproposalId : number;

  /*----Button---*/
  refreshIcon = refreshIcon;
  saveIcon = saveIcon;
  previousIcon = previousIcon;
  addNewIcon = addNewIcon;
  nextIcon = nextIcon;
  /*----/Button---*/

  agreementId: any;
  spinner: boolean = false;
  ActionPlanList = [];
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  
  langVal: string;

  constructor(
    private service: ResearcherProposalActionPlanService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private dataComService: DataComService,
    private _toastrService: ToastrService
  ) { 
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    this.langVal = localStorage.getItem("currentLang")
        this.dataComService.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
  }

  ngOnInit(): void {

    const agreementDate = new Date(this.getRMSagreementDate);
    const totalDaysArray = [{"totalDays":5}, {"totalDays":2}, {"totalDays":5}];

    let newDate = agreementDate;
    const obj = [];
    let start = new Date();

    
    this.service.getByResearcherProposalId(this.getRMSproposalId).subscribe(response => {      
            if (response.success) {
              
              let $this = this;
              this.ActionPlanList = response.items
              
              response.items.map((days, index) => {
                if (newDate === agreementDate) {
                  newDate = agreementDate;
                  start = agreementDate;
                } else {                  
                  let adDate = $this.ActionPlanList[index-1]['endDate'];
                  start =  new Date(adDate.getTime() + (1 * 24 * 60 * 60 * 1000));
                  newDate = new Date(newDate.getTime() + (24 * 60 * 60 * 1000));
                }
                newDate = new Date(newDate.getTime() + (days.totalDays * 24 * 60 * 60 * 1000));

               // obj.push({"startdate": start.toISOString().slice(0, 10), "days": days.totalDays, "endDate":newDate.toISOString().slice(0, 10) });

                var st_date = start.toISOString().slice(0, 10).split('-');                
                var end_date = newDate.toISOString().slice(0, 10).split('-');

                $this.ActionPlanList[index]['startDate2'] = (st_date.length == 3) ? st_date[2]+"/"+st_date[1]+"/"+st_date[0] : "00/00/0000";
                $this.ActionPlanList[index]['endDate2'] = (end_date.length == 3) ? end_date[2]+"/"+end_date[1]+"/"+end_date[0] : "00/00/0000";

                $this.ActionPlanList[index]['startDate'] = start
                $this.ActionPlanList[index]['endDate'] = newDate
                
              });              
             console.log("$this.ActionPlanList = ", $this.ActionPlanList);
             // console.log("obj 22 = ", obj);
            }
        })
  }

  nextTab() {
      this.nextStep.emit(true);
  }

  previousTab(): void {
      this.backPrevious.emit(true);
  }
  saveAndNext() {
    this.save();
    this.nextTab();
}

  save(){
    console.log('$this.ActionPlanList = ', this.ActionPlanList);
    const plans: ResearcherProposalActionPlan[] = this.ActionPlanList;
    this.service.saveList(plans).subscribe(res => {
      if (res.success) {
        this._toastrService.success("Save Successfully", "Success!", this.config);
      }
      else{
        console.log('fdsdfdsf');
      }
    })
    
  }

}
