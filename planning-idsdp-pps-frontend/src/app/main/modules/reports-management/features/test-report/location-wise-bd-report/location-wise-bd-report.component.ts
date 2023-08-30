import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { ReportDataService } from '../../../services/report-data.service';
import { IDppLocationWiseCostBreakdown } from 'app/main/modules/dpp-tapp-management/models/dpp-location-wise-cost-breakdown.model';
import { DivisionModel } from 'app/main/modules/configuration-management/models/division.model';
import { DppLocationWiseCostBreakdownService } from 'app/main/modules/dpp-tapp-management/services/dpp-location-wise-cost-breakdown.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DppProjectSummeryHelperService } from 'app/main/modules/dpp-tapp-management/services/dpp-project-summery-helper.service';
import { DppLocationService } from 'app/main/modules/dpp-tapp-management/services/dpp-location.service';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { MatDialog } from '@angular/material/dialog';
import { UnsubscribeAdapterComponent } from 'app/main/core/helper/unsubscribeAdapter';
import { UpazillaModel } from 'app/main/modules/configuration-management/models/upazilla.model';
import { ERROR } from 'app/main/core/constants/message';

@Component({
  selector: 'app-location-wise-bd-report',
  templateUrl: './location-wise-bd-report.component.html',
  styleUrls: ['./location-wise-bd-report.component.scss']
})
export class LocationWiseBdReportComponent extends UnsubscribeAdapterComponent implements OnInit {
  @ViewChild('pdfTable', { static: false }) el: ElementRef;
  fileName = 'ExcelSheet.xlsx';
  reportData: any = {};


  conceptUuid: string=`28722394-b00f-469b-95fe-62ea20592f6d`;
  conceptId: number;
  objectiveCostId: number;
  locationWiseCost: IDppLocationWiseCostBreakdown[] = [];
  locations: { id: number, uuid: string, dppMasterId: number, divisions: DivisionModel[] };
  upazilas: { sl: number, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, upazila: UpazillaModel }[] = [];
  show = false;
  saveDisable = false;


  constructor(
    private _reportService: ReportService,
    private _reportDataService: ReportDataService,
    private service: DppLocationWiseCostBreakdownService,
    private fuseTranslationLoaderService: FuseTranslationLoaderService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private helperService: DppProjectSummeryHelperService,
    private locationService: DppLocationService,
    private projectSummaryService: ProjectSummaryService,
    private snackbarHelper: SnackbarHelper,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
   // this.getReportData();
    this.getProjectConceptByUuid();
  }

  exportAsXLSX(): void {
    /* table id is passed over here */
    let element = document.getElementById('pdfTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  exportAsPdf(): void {
    this._reportService.exportAsPdfFile(document.getElementById('pdfTable'), 'PDPP_REPORT')
    //   let pdf=new jsPDF('l','pt','a4');
    //   pdf.html(this.el.nativeElement,{
    //     callback:(doc)=>{
    // doc.save("report1.pdf");
    //     }
    //   });
  }


  getReportData() {
    this._reportDataService.getReportData().subscribe(
      res => {
        this.reportData = res ? res : {};
      },
      err => {
      }
    );
  }


  // =========== get from project location ===========

  /**
     * get Project Concept data by project uuid
     * @private
     */
  private getProjectConceptByUuid() {
    this.subscribe$.add(
      this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
        this.conceptId = res.id;
        this.getByLocationWiseCostProjectConceptMasterId();
      })
    );
  }

  /**
   * get location wise cost by project concept master id
   * @private
   */
  private getByLocationWiseCostProjectConceptMasterId() {
    this.subscribe$.add(
      this.service.getByProjectConceptMasterId(this.conceptId).subscribe(res => {
        this.locationWiseCost = res;
        this.getLocationByObjectCostId();
      })
    );
  }

  private getLocationByObjectCostId() {
    this.subscribe$.add(
      this.locationService.getLocationByObjectiveCostIdUsingProjectSummary(this.conceptId).subscribe(res => {
        if (res) {
          this.locations = res;
          this.arrangeData(res);
        } else {
          this.saveDisable = true;
          this.show = true;
          this.snackbarHelper.openWarnSnackBarWithMessage("Location Is not created by this project summary", ERROR);
        }
      }, _ => {
        this.saveDisable = true;
        this.show = true;
      })
    );
  }

  private arrangeData(res) {
    let di = 0;
    res.divisions.forEach(d => {
      let zi = 0;
      let upazilaUnderDivision = d.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0)
      d.zillaList.forEach(z => {
        let ui = 0;
        z.upaZillaList.forEach(u => {
          const lwc: IDppLocationWiseCostBreakdown = this.locationWiseCost.find(f => f.upazilaId === u.id);
          this.upazilas.push(
            {
              location: {
                uuid: lwc ? lwc.uuid : null,
                id: lwc ? lwc.id : null,
                dppMasterId: res.dppMasterId,
                divisionId: u.zilla.division.id,
                zillaId: u.zilla.id,
                upazilaId: u.id,
                projectConceptMasterId: this.conceptId,
                projectConceptMasterUuid: this.conceptUuid,
                comment: lwc ? lwc.comment : '',
                estimatedCost: lwc ? lwc.estimatedCost : 0,
                quantity: lwc ? lwc.quantity : '0',
              },
              sl: di + 1,
              dSpan: ((zi === 0 && ui === 0) ? upazilaUnderDivision : 0),
              zSpan: ((ui === 0) ? (d.zillaList[zi].upaZillaList.length) : 0),
              upazila: u

            }
          );
          ui += 1;
          //this.saveDisable = this.upazilas.some(m => m.location.estimatedCost <= 0) && this.upazilas.some(m => m.location.quantity <= 0);
        });
        zi += 1;
      });
      di += 1;
    });
    this.show = true;
  }

}

