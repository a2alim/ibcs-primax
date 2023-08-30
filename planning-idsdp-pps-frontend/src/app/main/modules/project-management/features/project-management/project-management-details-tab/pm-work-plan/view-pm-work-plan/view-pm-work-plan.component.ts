import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PmWorkPlanModel } from 'app/main/modules/project-management/models/pm-work-olan.model';
import { PmWorkPlanService } from 'app/main/modules/project-management/service/pm-work-plan.service';
import { stringify } from 'crypto-js/enc-base64';
import * as moment from 'moment';

@Component({
  selector: 'app-view-pm-work-plan',
  templateUrl: './view-pm-work-plan.component.html',
  styleUrls: ['./view-pm-work-plan.component.scss']
})
export class ViewPmWorkPlanComponent implements OnInit {

  dppTappMasterUuid: number;
  dateCommencement: Date;
  dateCompletion: Date;
  pmWorkPlanList: PmWorkPlanModel[] = [];
  fiscalYearList: any[] = []

  constructor(
    private route: ActivatedRoute,
    private pmWorkPlanService: PmWorkPlanService,
  ) { }

  ngOnInit(): void {
    this.dppTappMasterUuid = this.route.snapshot.params['dppTappMasterId'];
    this.dateCommencement = this.route.snapshot.params['dateCommencement'];
    this.dateCompletion = this.route.snapshot.params['dateCompletion'];
    this.getWorkPlanByDppTappUuid(this.dppTappMasterUuid);
    this.getFiscalYearList();
  }

  calFiscalYear() {

    let startYear = moment(this.dateCommencement).year();
    var startMonth = moment(this.dateCommencement).month();

    let endYear = moment(this.dateCompletion).year();
    var endMonth = moment(this.dateCompletion).month();

    let projectDuration = endYear - startYear;
    if (projectDuration) {
      for (let i = 1; projectDuration >= i; i++) {
        if (i == projectDuration) {
          this.fiscalYearList.push({ fiscalYearTitle: 'Fiscal Year-' + i, fiscalYear: endYear - 1 + "-" + endYear });
        } else {
          this.fiscalYearList.push({ fiscalYearTitle: 'Fiscal Year-' + i, fiscalYear: startYear + "-" + (startYear + i) });
        }
      }
    } else {
      this.fiscalYearList.push({ fiscalYearTitle: 'Fiscal Year-1', fiscalYear: endMonth <= 6 ? startYear - 1 + " - " + startYear : startYear + " - " + startYear + 1 });
    }

    this.pmWorkPlanList.forEach(workPlan => {
      workPlan.qtr1 = (7 <= startMonth) && (startMonth <= 9) ? true : false;
      workPlan.qtr2 = (10 <= startMonth) && (startMonth <= 12) ? true : false;
      workPlan.qtr3 = (1 <= startMonth) && (startMonth <= 3) ? true : false;
      workPlan.qtr4 = (4 <= startMonth) && (startMonth <= 6) ? true : false;
    })

  }

  getWorkPlanByDppTappUuid(dppTappMasterUuid) {
    this.pmWorkPlanService.getWorkPlanByDppTappUuid(dppTappMasterUuid).subscribe(
      res => {
        if (res.status && res.res) {
          this.pmWorkPlanList = res.res;
        }
      },
      err => {
      }
    )
  }



  getFiscalYearList() {

    const a = new Date(this.dateCommencement);
    const b = new Date(this.dateCompletion);

    let fYear = a.getFullYear();
    let lYear = b.getFullYear();

    if (a.getMonth() < 6) {
      fYear = a.getFullYear() - 1;
    }
    if (b.getMonth() > 5) {
      lYear = b.getFullYear() + 1;
    }

    let total = lYear - fYear;
    let startingYear = fYear;

    while (total > 0) {
      let nextYear = (startingYear + 1);
      this.fiscalYearList.push({ fiscalYear: (startingYear + "-" + nextYear) });
      startingYear += 1;
      total -= 1;
    }

    this.fiscalYearList.forEach(fYear => {

      fYear.quarterList = [];
      let str = `${fYear.fiscalYear}`;
      let yearList = str.split("-");

      let firstQuarter = { 'strDate': new Date(`${yearList[0]}-07-01`), 'endDate': new Date(`${yearList[0]}-09-30`) }
      let secondQuarter = { 'strDate': new Date(`${yearList[0]}-10-01`), 'endDate': new Date(`${yearList[0]}-12-31`) }
      let thirdQuarter = { 'strDate': new Date(`${yearList[1]}-01-01`), 'endDate': new Date(`${yearList[1]}-03-31`) }
      let fourthQuarter = { 'strDate': new Date(`${yearList[1]}-04-01`), 'endDate': new Date(`${yearList[1]}-06-30`) }

      fYear.quarterList.push(firstQuarter);
      fYear.quarterList.push(secondQuarter);
      fYear.quarterList.push(thirdQuarter);
      fYear.quarterList.push(fourthQuarter);

    });

  }

  cleckTest(pIndex: number, cIndex, workPlan: any) {
    let quarterData = this.fiscalYearList[pIndex].quarterList[cIndex];

    let result1 = this.dateCheck(quarterData.strDate, quarterData.endDate, workPlan.startDate);
    let result2 = this.dateCheck(quarterData.strDate, quarterData.endDate, workPlan.endDate);
    let result3 = this.dateCheck(workPlan.startDate, workPlan.endDate, quarterData.strDate);
    let result4 = this.dateCheck(workPlan.startDate, workPlan.endDate, quarterData.endDate);

    if (result1 || result2 || result3 || result4) {
      switch (workPlan.status) {
        case 'Progress':
          return 'status-progress'
          break;
        case 'Done':
          return 'status-done'
          break;
        case 'Not Done':
          return 'status-notdone'
          break;
        default: 'default'
      }

    } else {
      return 'default';
    }
  }

  dateCheck(from, to, check) {
    var fDate, lDate, cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if ((cDate <= lDate && cDate >= fDate)) {
      return true;
    }

    return false;
  }


}
