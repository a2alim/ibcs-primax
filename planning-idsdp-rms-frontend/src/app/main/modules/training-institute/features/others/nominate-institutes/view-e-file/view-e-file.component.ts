import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DEFAULT_SIZE, DEFAULT_PAGE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import { addNewIcon, emailIcon, pdfIcon, viewIcon, uploadIcon, downloadIcon } from 'app/main/modules/rpm/constants/button.constants';
import { EvaluatorsGrantAmountLetter } from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import { RmsEvaluatorsGrantAmountLetterService } from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import { ConfigurationService } from 'app/main/modules/settings/services/configuration.service';
import { NominatedInstituteModel } from 'app/main/modules/training-institute/models/nominated-institute.model';
import { ProposalModel } from 'app/main/modules/training-institute/models/proposal.model';
import { NominatedInstituteService } from 'app/main/modules/training-institute/services/nominated-institute.service';
import { ProposalService } from 'app/main/modules/training-institute/services/proposal.service';
import { TrainingInstituteProfileService } from 'app/main/modules/training-institute/services/training-institute-profile.service';
import { ToastrService } from 'ngx-toastr';
import {ENothiService} from "../../../../services/eNothi.service";
import { environment } from 'environments/environment';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
  selector: 'app-view-e-file',
  templateUrl: './view-e-file.component.html',
  styleUrls: ['./view-e-file.component.scss']
})
export class ViewEFileComponent implements OnInit {

  spinner: boolean = false;
  displayedColumns: string[] = ['sl','fiscalYear', 'action'];
  dataSource: MatTableDataSource<any>;
  proposalModels: ProposalModel[] = [];
  fiscalYearId: number;
  total: number;
  size: number = DEFAULT_SIZE;
  page: number = DEFAULT_PAGE;
  proposalTitle: string = "";
  isShortListed: any;
  minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;
  addNewIcon = addNewIcon;
  downloadIcon = downloadIcon;
  emailIcon = emailIcon;
  pdfIcon = pdfIcon;
  viewIcon = viewIcon;
  uploadIcon = uploadIcon;
  userDetails: any;

  fiscalYears: any [] = [];
  trainingInstitutes: any[] = [];
  userType: string = this._authService.getLoggedUserType();
  trainingInstituteId: number;
  selectedTrainingInstitute: String;

  datas: any[];

  saveSuccess = saveSuccess;
  saveFailed = saveFailed;
  updateSuccess = updateSuccess;
  updateFailed = updateFailed;
  deleteSuccess = deleteSuccess;
  deleteFailed = deleteFailed;
  sentSuccess = sentSuccess;
  dataNotFount = dataNotFount;

  constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
              private service: RmsEvaluatorsGrantAmountLetterService,
              private route: Router,
              private _toastService: ToastrService,
              private _proposalService: ProposalService,
              private _eNothiService: ENothiService,
              private _authService: AuthService,
              private _configurationService: ConfigurationService,
              private _nominatedInstituteService: NominatedInstituteService,
              private _trainingInstituteProfileService: TrainingInstituteProfileService) {

      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
      this.userDetails = this._authService.getLoggedUserDetails();

      this.spinner = true;

      this.getFiscalYears();
      this.getAllTrainersInstitutesList();
      // this.getList();

      this.getENothis();
  }

  getInstituteName(createdBy: any) {
      let institute = this.trainingInstitutes.find(ti => ti.id == createdBy)


      if (institute.id == createdBy)
          return institute.name;
      else
          return "XYZ Institute";
  }

  onChangeTrainingInstitutes($event: any) {
      if ($event.value != '')
          this.dataSource = new MatTableDataSource(this.proposalModels.filter(res => +($event.value) === +(res.createdBy)))
      else
          this.dataSource = new MatTableDataSource(this.proposalModels)
  }

  deleteProposal(proposalId: number) {
      this._proposalService.deleteProposal(proposalId).subscribe(
          () => {
              this._toastService.success(deleteSuccess, "Success");
              this.getENothis();
          },
          error => {
              this._toastService.error(deleteFailed, "Error");
              console.log("Error: " + error);
          }
      );
  }

  getListByFiscalYear() {

  }



  onChangePage(event: PageEvent) {

      this.size = +event.pageSize; // get the pageSize
      this.page = +event.pageIndex; // get the current page

      this.getENothis()
  }

  viewDetails(elm: any) {
    console.log(elm);
    this.downloadENothi(elm);
      // this.route.navigate(['nominate-institutes/view/' + uuid + '/' + id]);
  }

  edit(id: number) {
      this.route.navigate(['proposal-list/edit/' + id]);
  }

  download(letter: EvaluatorsGrantAmountLetter) {
      this.service.downloadFile(letter.uploadSignatureFile).subscribe(
          _ => {
          }
      );
  }

  filterByInstitute() {
      const filterValue = this.selectedTrainingInstitute;
      console.log(this.selectedTrainingInstitute)
      this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }


  getFiscalYearName(fiscalYearId: number) {
      let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

      if (fiscalYear)
          return fiscalYear.fiscalYear;
      else
          return "XYZ Fiscal Year";
  }

  onCheckBoxChange(checked: boolean, id) {
      console.log(checked)
      this._nominatedInstituteService.changeShortListStatus(id, checked).subscribe(
          () => {
              this._toastService.success("Status Changed", "Success");
              // this.getList();
              this.getENothis();
          },
          error => {
              this._toastService.error(error.error.message, "Error");
              console.log("Error: " + error);
          }
      );
  }

  public getENothis() {
    this.spinner = true;
      this._eNothiService.getENothis(this.size, this.page, this.fiscalYearId).subscribe(
          res => {
              this.datas = res.data;
              this.total = res.totalItems;
              this.dataSource = new MatTableDataSource<any>(this.datas)
              this.spinner = false;
              console.log(this.datas)
          },
          error => {
              console.log(error)
              this.datas = [];
              this.dataSource = new MatTableDataSource<any>(this.datas)
              this.spinner = false;

          }
      )
  }
  downloadENothi(elm) {
    // window.open( elm.enothi.downloadUrl, "_blank");
    window.open(this.minioFileDownloadEndPointHost + elm.enothi.bucketName + '/'
    + elm.enothi.fileName, "_blank");
}
  private getFiscalYears() {
    this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
        res => {
            this.fiscalYears = res.items;
        },
        error => {
            console.log(error)
        }
    )
}

  public goToENothiView() {
      // changed to undefined to fix bug string when
      // passing as url params
      if (this.isShortListed == "")
          this.isShortListed = undefined;

      this.route.navigate([`nominate-institutes/e-documents/${this.page}/${this.size}/${this.isShortListed}/${this.trainingInstituteId}/${this.fiscalYearId}`]);
  }

  changeENothiStatus(selectValue: string, id: number) {

      // console.log(selectValue, id)

      this._nominatedInstituteService.changeENothiStatus(id, selectValue).subscribe(
          () => {
              this._toastService.success("Status Changed", "Success");
              this.getENothis()
          },
          error => {
              this._toastService.error(error.error.message, "Error");
              console.log(error)
          }
      )
  }

  private getAllTrainersInstitutesList() {
      this._trainingInstituteProfileService.getTrainingInstituteList().subscribe(
          res => {
              this.trainingInstitutes = res.data;
              this.spinner = false
          },
          error => {
              console.log(error)
          }
      )

  }

}

