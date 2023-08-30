import { Component, OnInit } from '@angular/core';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    previousIcon,
    printIcon,
    viewIcon
} from '../../constants/button.constants';
import {FuseTranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {Router} from "@angular/router";
import {DataComService} from "../../../../core/services/data-com/data-com.service";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {JasperServiceService} from "../../../rpm/services/jasper-service.service";
import {AuthService} from "../../../auth/services/auth.service";
import {TrainingInstituteProfileService} from "../../services/training-institute-profile.service";
import {MatTableDataSource} from "@angular/material/table";
import {ProposalModel} from "../../models/proposal.model";
import {ProposalService} from "../../services/proposal.service";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../core/constants/constant";
import {ConfigurationService} from "../../../settings/services/configuration.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    status1: boolean = false;
    advertisementEndDate: string;
    advertisementStartDate: string;
    langVal: string;
    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    /*----/Button---*/
    spinner2: boolean=false;
    inProfileNotFound: boolean=false;
    spinner: boolean=false;
    profileModel: any;
    isProfileCompleted: boolean=false;
    loggedUserId: number;
    displayedColumns: string[] = ['sl', 'fiscalYear', 'proposedTrainerName', 'applicantInstituteName', 'trainingDuration', 'programDate', 'isSubmitted', 'action'];
    dataSource: MatTableDataSource<any>;
    proposalModels: ProposalModel[] = [];
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    proposalTitle: string = "";
    fiscalYears: any[] = [];
    proposalModelsList: any[];

  constructor( private _fuseTranslationLoaderService: FuseTranslationLoaderService,
               private _router: Router,
               private dataCom: DataComService,
               private jasperService: JasperServiceService,
               private _authService: AuthService,
               private _trainingInstituteProfileService: TrainingInstituteProfileService,
               private _proposalService: ProposalService,
               private _configurationService: ConfigurationService) {
      // Language translations
      this.langVal = localStorage.getItem("currentLang")
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

      this.dataCom.getPassedItemData.subscribe(res => {
          if (res?.lang) {
              this.langVal = res?.lang ? res?.lang : '';
          }
      });
      this.loggedUserId = this._authService.getLoggedUserId();
  }

  ngOnInit(): void {
      this.getFiscalYearWiseSectorSubSector();
      if(this.loggedUserId){
          this.getProfileById(res=>{
              if (res){
                 this.getList(res2=>{
                     if(res2){
                         console.log("...",this.proposalModelsList)
                     }
                 });
              }else{
                  console.log('profile not found')
              }
          })
      }

  }

    getFiscalYearWiseSectorSubSector() {
        this.spinner2 = true;
        this.jasperService.advertiseDateValidity().subscribe(
            validRes => {
                if (!validRes.success) {
                }
                if (validRes.success) {
                    this.status1 = true;
                    this.advertisementEndDate = validRes.advertisementEndDate;
                    this.advertisementStartDate = validRes.advertisementStartDate;
                }
                this.spinner2 = false;
            });
        this.spinner2 = false;
    }

    /*get Profile Information*/
    userType: Boolean;
    getProfileById(callback) {
        //personalInfo.userId
        this.spinner = true;
        this._trainingInstituteProfileService.getProfileViewById(this.loggedUserId).subscribe(data => {
            if(data){
                this.inProfileNotFound = false;
                this.profileModel = data;
                this.spinner = false;
                callback(true);
            }else{
                this.inProfileNotFound = true;
            }
        }, error => {
            this.inProfileNotFound = true;
            this.spinner = false;
            callback(false);
        })
    }

    getList(callback) {
        this.spinner = true;
        this._proposalService.getProposals(10000, this.page).subscribe(
            res => {
                this.proposalModels = []
                res.data.forEach(result => {
                    result.isSubmittedString = result.isSubmitted ? "Yes" : "Not Submitted";
                    this.proposalModels.push(result);
                })

                this.dataSource = new MatTableDataSource<ProposalModel>(this.proposalModels);
                this.total = res.totalItems;
                this._configurationService.getAllFiscalYearByFinalCopy().toPromise().then(
                    res => {
                        this.fiscalYears = res.items;
                        let data: any[] = this.proposalModels;
                        data.map(pp => {
                            pp.instituteName = pp.trainingInstituteProfileModel.trainingInstituteName
                            pp.fiscalYear = this.getFiscalYearName(pp.fiscalYearId)
                        });
                        this.proposalModelsList=data;
                        this.dataSource = new MatTableDataSource<any>(data);
                        callback(true)
                    },

                    error => {
                        console.log(error)
                    }
                );
                this.spinner = false;

            },
            error => {
                callback(false)
                console.log(error)
                this.spinner = false;
            }
        );
        callback(false)
    }


    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);
        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }






    goToResearcherProposalList() {
        this._router.navigate(['/proposal-list'])

    }

    viewProfile() {
    this._router.navigate(['/ti-profile-information'])
    }

    print() {

    }

    editProfile() {
        this._router.navigate(['/profile/'+this.loggedUserId + '/edit/tabs']);
    }

    onChangePage($event: PageEvent) {

    }

    viewDetails(uuid: any, id) {

    }

    edit(element) {

    }

    openDialog(id) {

    }

    applyFilter($event: KeyboardEvent) {

    }
}
