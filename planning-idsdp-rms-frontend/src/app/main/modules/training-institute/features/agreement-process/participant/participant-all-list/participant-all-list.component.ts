import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon, downloadIcon, pdfIcon, previousIcon, printIcon} from 'app/main/modules/rpm/constants/button.constants';
import {EvaluatorsGrantAmountLetter} from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import {RmsEvaluatorsGrantAmountLetterService} from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import {ParticipantService} from 'app/main/modules/training-institute/services/participant.service';
import {ToastrService} from "ngx-toastr";
import {ParticipantModel} from "../../../../models/participant.model";
import {ProposalService} from "../../../../services/proposal.service";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-participant-all-list',
    templateUrl: './participant-all-list.component.html',
    styleUrls: ['./participant-all-list.component.scss']
})
export class ParticipantAllListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'participantName', 'courseTitle', 'sex', 'mobileNo', 'email'];
    dataSource: MatTableDataSource<ParticipantModel>;
    fiscalYearsList: any[];
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;

    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;

    trainingInstituteList: { id: number, name: string }[] = [
        {id: 1, name: "Institute 1"},
        {id: 2, name: "Institute 2"},
        {id: 3, name: "Institute 3"},
        {id: 4, name: "Institute 4"},
    ];
    participants: ParticipantModel[] = []
    courses: { id: number, name: string }[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private route: Router,
                private _toastService: ToastrService,
                private _participantService: ParticipantService,
                private _proposalService: ProposalService
    ) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        // current 2000 because of no get all api
        this.getParticipantList(2000, 0);
        this._proposalService.getProposals(2000, 0).subscribe(res => {
            console.log(res)
            res.data.forEach(course => {
                this.courses.push({id: course.id, name: course.trainingName})
            })

        })
    }

    getParticipantList(size: number, page: number) {
        this._participantService.getParticipantList(size, page).subscribe(
            res => {
                this.total = res.totalItems;
                this.dataSource = new MatTableDataSource<ParticipantModel>(res.data);
                this.participants = res.data
                console.log(res);
            },
            error => {
                console.log("Error: " + error);
            }
        )
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onChangePage(event: PageEvent) {

        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getParticipantList(this.size, this.page);
    }

    delete(id) {
        this._participantService.deleteParticipant(id).subscribe(
            res => {
                this._toastService.success(deleteSuccess, "Success");
                this.getParticipantList(this.size, this.page);
            },
            error => {
                this._toastService.error(deleteFailed, "Error");
                console.log("Error: " + error);
            }
        );
    }

    uploadFile(file: FileList, id: number) {

    }

    onChangeFiscalYear() {
        //   this.fiscalYearId ? this.getListByFiscalYear() : this.getList();
    }

    viewDetails(uuid: string) {
        this.route.navigate(['participant-list/' + uuid + '/' + 'view']);
    }

    edit(id: string) {
        this.route.navigate(['participant-list/add/' + id]);
    }

    download(letter: EvaluatorsGrantAmountLetter) {
        this.service.downloadFile(letter.uploadSignatureFile).subscribe(
            _ => {
            }
        );
    }

    getCourseTitle(courseTitle: any) {
        let selectedCourse = this.courses.find(course => course.id == courseTitle);

        if (selectedCourse)
            return selectedCourse.name;
        else
            return "XYZ Course";
    }

    print() {
  window.print();
    }

    back() {
        this.route.navigate(["/participant-list"])
    }
}


