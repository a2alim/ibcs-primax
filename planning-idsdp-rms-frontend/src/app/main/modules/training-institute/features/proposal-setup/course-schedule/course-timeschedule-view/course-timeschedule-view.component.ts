import {Component, OnInit} from '@angular/core';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {FiscalYearServiceService} from 'app/main/modules/settings/services/fiscal-year-service.service';
import {locale as lngEnglish} from "../../../proposal-setup/course-schedule/i18n/en";
import {locale as lngBangla} from "../../../proposal-setup/course-schedule/i18n/bn";
import {CourseService} from "../../../../services/course.service";
import {TrainersService} from "../../../../services/trainers.service";
import {JasperServiceService} from "../../../../../rpm/services/jasper-service.service";
import moment from "moment";

@Component({
    selector: 'app-course-timeschedule-view',
    templateUrl: './course-timeschedule-view.component.html',
    styleUrls: ['./course-timeschedule-view.component.scss']
})
export class CourseTimescheduleViewComponent implements OnInit {


    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    id: any
    tabData: any
    spinner: boolean = false;
    courseScheduleData: any[] = []
    courseResponse: any;
    courseScheduleId: String;
    fiscalYearsList: any[];
    userList: any[] = [];
    totalBudgetAmount: number = 0;
    trainers: any[] = []
    spinner2:boolean=false;


    constructor(
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private jasperService: JasperServiceService,
        private _courseService: CourseService,
        private fiscalYearService: FiscalYearServiceService,
        private _trainerService: TrainersService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getTrainers();
        this.courseScheduleId = this.activateRoute.snapshot.paramMap.get('id');
        if (this.courseScheduleId) {
            // this.getAllCourseScheduleBy();
            this._courseService.getCourseById(Number(this.courseScheduleId)).subscribe(
                res => {
                    console.log(res)
                    this.courseResponse = res;
                    this.courseScheduleData = this.courseResponse.courseScheduleModels
                },
                error => {
                    console.log(error)
                }
            )
        }

    }

    getTrainers() {
        this._trainerService.getTrainersList(0, 2000,41).subscribe(
            res => {
                this.trainers = res.content;
                console.log(this.trainers)
            },
            error => {
                console.log(error)
            }
        )
    }

    backToCourseSchedule() {
        this._router.navigate(['/course-schedules']);
    }


    back() {
        this._router.navigate(['/course-schedules']);
    }

    download() {
        let lang = localStorage.getItem("currentLang");
        this.genPdf(lang);
    }

    genPdf(lang) {
        this.spinner2=true;
        this.jasperService.generateCourseSchedulelPdf( this.courseScheduleId,lang).subscribe((response)=>{
            this.spinner2=false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        },error => {
            this.spinner2=false;
        })

    }

    print() {
        let printContents = document.getElementById('printPage').innerHTML;
        let originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
    }

    getAllCourseScheduleBy() {
        this.spinner = true;
        this._courseService.getAllCourseScheduleBy(this.courseScheduleId).subscribe(
            response => {
                    this.spinner = false;
                    this.courseScheduleData = response;
                    console.log('this.courseData ==== >>>> ', this.courseScheduleData);
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    editProfile() {
        // this._router.navigate(['researcher-profile-information/' + this.courseScheduleData.researcherProfilePersonalInfoMaster.uuid + '/edit/' + this.courseScheduleData.researcherProfilePersonalInfoMaster.id])
    }


    private getFiscalYearList() {
        this.spinner = true;
        this.fiscalYearService.getAllActive().subscribe(res => {
            this.fiscalYearsList = res.items ? res.items : [];
            this.spinner = false;
        });
    }

    showFiscalYear(id: number) {
        if (!id) {
            return '';
        }
        return this.fiscalYearsList.find(f => f.id == id).fiscalYear;
    }


    showUserName(userId: number) {
        if (!userId) {
            return '';
        }
        return this.userList.find(f => f.userId == userId).name ? this.userList.find(f => f.userId == userId).name : '';
    }


    addNewProposal() {
        // this._router.navigate(['researcher-proposal-informationn/' + this.courseScheduleData.researcherProfilePersonalInfoMaster.uuid])
    }


    getTrainerNameById(speaker: number) {
        let trainer = this.trainers.find(tr => tr.id === speaker);

        if (trainer)
            return trainer.name;
        else
            return "Demo Trainer"
    }

    convertDate(date: string) {
        return moment(date).format('DD-MM-YYYY');
    }
}
