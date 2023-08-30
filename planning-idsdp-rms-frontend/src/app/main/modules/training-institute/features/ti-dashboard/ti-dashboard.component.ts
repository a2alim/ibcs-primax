import {Component, OnInit} from '@angular/core';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    previousIcon,
    printIcon,
    viewIcon
} from '../../constants/button.constants';
import {JasperServiceService} from "../../../rpm/services/jasper-service.service";
import {locale as lngEnglish} from "../ti-dashboard/i18n/en";
import {locale as lngBangla} from "../ti-dashboard/i18n/bn";
import {FuseTranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {DataComService} from "../../../../core/services/data-com/data-com.service";
import {ConfigurationService} from "../../../settings/services/configuration.service";
import {AuthService} from "../../../auth/services/auth.service";
import {MatTableDataSource} from "@angular/material/table";
import {ProposalModel} from "../../models/proposal.model";
import {TrainingInstituteProfileService} from "../../services/training-institute-profile.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProposalService} from "../../services/proposal.service";
import {TrainersService} from "../../services/trainers.service";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../core/constants/constant";
import {environment} from "../../../../../../environments/environment";
import {PageEvent} from "@angular/material/paginator";

@Component({
    selector: 'app-ti-dashboard',
    templateUrl: './ti-dashboard.component.html',
    styleUrls: ['./ti-dashboard.component.scss']
})
export class TiDashboardComponent implements OnInit {
    langVal: string;
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    status1: boolean = false;
    spinner2: boolean = false;
    private advertisementEndDate: any;
    private advertisementStartDate: any;
    private fiscalYears: any;
    trainingInstitutes: any[] = [];
    spinner: boolean = false


    displayedColumns: string[] = ['sl', 'fiscalYear', 'proposedTrainerName', 'applicantInstituteName', 'trainingDuration', 'programDate',
        'isSubmitted'];
    dataSource: MatTableDataSource<any>;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    id: any
    tabData: any
    profileUuId: String;
    fiscalYearsList: any[];
    userList: any[] = [];
    minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;
    profileModel: any = {};
    proposalList: any[] = [];

    proposalModels: ProposalModel[] = [];
    fiscalYearId: number;
    userType: string = this._authService.getLoggedUserType();
    isProfileCompleted: boolean = false;

    constructor(
        private activateRoute: ActivatedRoute,
        private jasperService: JasperServiceService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dataCom: DataComService,
        private _configurationService: ConfigurationService,
        private _authService: AuthService,
        private _trainingInstituteProfileService: TrainingInstituteProfileService,
        private _proposalService: ProposalService,
        private _trainersService: TrainersService,
        private _router: Router,
    ) {
        // Language translations
        this.langVal = localStorage.getItem("currentLang")
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
    }

    ngOnInit(): void {
        console.log('langVal = ', this.langVal);
        this.getFiscalYearWiseSectorSubSector();

        this.getFiscalYears();
        this.getAllTrainersInstitutesList();
        this.profileUuId = this.activateRoute.snapshot.paramMap.get('uuid');
        if (this.profileUuId.includes("$")) {
            const splitIdArray = this.profileUuId.split("$");
            this.profileUuId = splitIdArray[1];
        }
        if (this.profileUuId) {
            this.getProfileById();
            this.getProposalById();
        }

    }

    onChangePage(event: PageEvent) {

        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.fiscalYearId ? this.getListByFiscalYear() : this.getProposalById();
    }

    getListByFiscalYear() {

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


    private getAllTrainersInstitutesList() {
        this._authService.getAllUser().toPromise().then(
            result => {
                result.forEach(ti => {
                    // if (ti.userType === 'Rms_Training_Institute') {
                    this.trainingInstitutes.push(ti);
                    // }
                })

                this.getProposalById();
                this.spinner = false
            },
            error => {
                console.log(error)
            }
        )
    }


    getProposalById() {
        this._proposalService.getProposals(this.size, this.page).subscribe(
            res => {
                this.proposalModels = []
                res.data.forEach(result => {
                    this.proposalModels.push(result);
                })

                this.dataSource = new MatTableDataSource<ProposalModel>(this.proposalModels);
                this.total = res.totalItems;

                let data: any[] = this.proposalModels;
                data.map(pp => {
                    pp.instituteName = this.getInstituteName(pp.createdBy)
                })
                this.dataSource = new MatTableDataSource<any>(data)

                console.log(this.proposalModels)

            },
            error => {
                console.log(error)
            }
        );
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }

    getInstituteName(createdBy: any) {
        let institute = this.trainingInstitutes.find(ti => ti.id == createdBy)
        if (institute.id == createdBy)
            return institute.name;
        else
            return "Not Found";
    }


    getProfileById() {
        //personalInfo.userId
        this.spinner = true;
        this._trainingInstituteProfileService.getProfileViewById(this.profileUuId).subscribe(data => {
            this.isProfileCompleted = true;
            this.profileModel = data;
            this.spinner = false;
        }, error => {
            this.isProfileCompleted = false;
            this.spinner = false;
        })
        console.log(this.profileModel.profileImageUrl === undefined)
    }

//
    editProfile() {
       this._router.navigate(['/profile/' + '739bc694-b2dd-43b5-ab2c-925aac9075bf$'+this.profileUuId+'/profile']);

    }

    goToResearcherProposalList() {
        this._router.navigate(['/proposal-list']);

    }

    getFiscalYearWiseSectorSubSector() {
        this.spinner2 = true;
        this.jasperService.advertiseDateValidity().subscribe(
            validRes => {
                if (!validRes.success) {
                    //  this.matSnackBar.openWarnSnackBarWithMessage(validRes.message, OK);
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


    print() {

    }
}
