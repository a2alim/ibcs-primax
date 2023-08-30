import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { JasperServiceService } from 'app/main/modules/rpm/services/jasper-service.service';
import { environment, reportBackend } from "../../../../../../../environments/environment";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "../../../../../core/constants/constant";
import { StorageService } from "../../../../../core/services/storage/storage.service";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { AuthService } from "../../../../auth/services/auth.service";
import { ConfigurationService } from "../../../../settings/services/configuration.service";
import { RmsUserTypes } from "../../../enums/enum-list.enum";
import { ProposalModel } from "../../../models/proposal.model";
import { ProposalService } from "../../../services/proposal.service";
import { TrainersService } from "../../../services/trainers.service";
import { TrainingInstituteProfileService } from "../../../services/training-institute-profile.service";
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-training-ins-profile',
    templateUrl: './training-ins-profile.component.html',
    styleUrls: ['./training-ins-profile.component.scss']
})
export class TrainingInsProfileComponent implements OnInit {


    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/
    displayedColumns: string[] = ['sl', 'fiscalYear', 'proposedTrainerName', 'applicantInstituteName', 'trainingDuration', 'programDate',
        'isSubmitted'];

    displayedColumns2: string[] = ['position', 'name', 'institute', 'designation', 'mobileNo', 'gender', 'email', 'lastAcademicDeg'];
    dataSource: MatTableDataSource<any>;
    dataSource2: any;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    id: any
    tabData: any
    spinner: boolean = false;
    profileUuId: String;
    fiscalYearsList: any[];
    userList: any[] = [];
    minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;
    minioEndPointHost: string = environment.ibcs.minioEndPointHost;
    profileModel: any = {};
    proposalList: any[] = [];
    fiscalYears: any[] = [];
    trainingInstitutes: any[] = [];
    proposalModels: ProposalModel[] = [];
    fiscalYearId: number;
    userType: string = this._authService.getLoggedUserType();
    isProfileCompleted: boolean = false;
    totalElements: number;
    fromProfile: boolean = false;
    fromLogin: boolean = false;

    data: any = {};

    spinner2: boolean = false;
    trainersList = [];




    constructor(
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _trainingInstituteProfileService: TrainingInstituteProfileService,
        private _router: Router,
        private _proposalService: ProposalService,
        private _authService: AuthService,
        private _configurationService: ConfigurationService,
        private _trainersService: TrainersService,
        private trianresService: TrainersService,
        private storageService: StorageService,
        private jasperService: JasperServiceService

    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        const userData = this.storageService.getUserData();
        this.getFiscalYears();
        this.getAllTrainersInstitutesList();
        this.profileUuId = this.activateRoute.snapshot.paramMap.get('uuid?p=sessionId');       
        if (this.profileUuId === null) {
            this.fromProfile = true;
            this.profileUuId = userData.id;
        } else {
            if (this.profileUuId.includes("$")) {
                this.fromLogin = true
                const splitIdArray = this.profileUuId.split("$");
                this.profileUuId = splitIdArray[1];
                this._router.navigate(['/ti-dashboard'])
            }
        }

        if (this.profileUuId) {
            this.getProfileById(res => {
                if (res) {
                    if (this.isProfileCompleted && this.fromLogin && this.userType != RmsUserTypes.RMS_DESK_OFFICER) {
                        this._router.navigate(['/ti-dashboard'])
                        return;
                    }
                    this.spinner = true
                    this.trianresService.profileId = this.profileModel.id;
                    localStorage.setItem('ProfileIdForM3', this.profileModel.id);
                    this.getListData(this.profileModel.id);
                }
            });
            // this.getProposalById();
        }

    }

    getListData(profileid) {
        this.trianresService.getListData(profileid, this.page, this.size).subscribe(res => {
            this.trainersList = res.page.content;
            this.dataSource2 = new MatTableDataSource(res.page ? res.page.content : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
        });
        this.spinner = false
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

    backToTrainersList() {
        this._router.navigate(['/trainers']);
    }

    // onChangePage(event: PageEvent) {
    //
    //     this.size = +event.pageSize; // get the pageSize
    //     this.page = +event.pageIndex; // get the current page
    //     this.fiscalYearId ? this.getListByFiscalYear() : this.getProposalById();
    // }

    onChangePage(event: PageEvent) {

        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData(localStorage.getItem('ProfileIdForM3'))
    }


    getListByFiscalYear() {

    }

    private getAllTrainersInstitutesList() {
        this._authService.getAllUser().toPromise().then(
            result => {
                result.forEach(ti => {
                    // if (ti.userType === 'Rms_Training_Institute') {
                    this.trainingInstitutes.push(ti);
                    // }
                })

                // this.getProposalById();
                this.spinner = false
            },
            error => {
                console.log(error)
            }
        )
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
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

    getInstituteName(createdBy: any) {
        let institute = this.trainingInstitutes.find(ti => ti.id == createdBy)
        if (institute?.id == createdBy)
            return institute?.name;
        else
            return "Not Found";
    }


    //for report generate with download
    download($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/instituteProfile';
        this.data['lng'] = localStorage.getItem("currentLang");

        // sending data to laravel project with json encode
        this.data['profileModel'] = JSON.stringify(this.profileModel);

        this.data['imageUrl'] = this.minioEndPointHost + this.profileModel.profileImage.downloadUrl;
        this.data['signImageUrl'] = this.minioEndPointHost + this.profileModel.signImage.downloadUrl;

        this.data['trainersList'] = JSON.stringify(this.trainersList);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    genPdf(lang) {
        this.spinner2 = true;
        this.jasperService.generateTraninersViewlPdf(this.profileUuId, lang).subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })

    }




    print() {
        let printContents = document.getElementById('printPage').innerHTML;
        let originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
    }


    editProfile() {
    }


    getProfileById(callback) {
        //personalInfo.userId
        this.spinner = true;
        this._trainingInstituteProfileService.getProfileViewById(this.profileUuId).subscribe(data => {
            this.isProfileCompleted = true;
            this.profileModel = data;
            this.spinner = false;
            callback(true);
        }, error => {
            this.isProfileCompleted = false;
            this.spinner = false;
            callback(false);
        })
        console.log(this.profileModel.profileImageUrl === undefined)


    }

    downloadNid() {

        window.open(this.minioFileDownloadEndPointHost + this.profileModel?.signImage?.bucketName + '/' + this.profileModel?.signImage?.fileName, "_blank");
    }

    // updateProfile() {
    //     this._router.navigate(['/profile/'+this.profileUuId+'/edit']);
    // }

    updateProfile() {
        this._router.navigate(['/profile/' + this.profileUuId + '/edit/tabs']);
    }


    profileList() {
        this._router.navigate(['/ti-profile-list']);
    }
}

