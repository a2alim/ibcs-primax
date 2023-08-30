import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {ParticipantService} from 'app/main/modules/training-institute/services/participant.service';
import {MatTableDataSource} from "@angular/material/table";
import {ParticipantModel} from "../../../../models/participant.model";

import {locale as lngEnglish} from "../../../agreement-process/participant/participant-all-view/i18n/en";
import {locale as lngBangla} from "../../../agreement-process/participant/participant-all-view/i18n/bn";

@Component({
    selector: 'app-participant-all-view',
    templateUrl: './participant-all-view.component.html',
    styleUrls: ['./participant-all-view.component.scss']
})
export class ParticipantAllViewComponent implements OnInit {


    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    displayedColumns: string[] = ['sl', 'participantName', 'dateOfBirth', 'gender', 'educationAttachment', 'nameOfOrganization',
        'designation', 'yearsOfExperience', 'presentAddress', 'email', 'howDidYouKnow'];
    dataSource: MatTableDataSource<ParticipantModel>;

    spinner: boolean = false;
    private participants: ParticipantModel[];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private _participantService: ParticipantService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getParticipants();
    }

    back() {
        this._router.navigate(['/participant-list']);
    }

    download() {

    }

    private getParticipants() {
        this._participantService.getParticipantList(5000, 0).subscribe(
            res => {
                this.participants = res.data;
                this.dataSource = new MatTableDataSource<ParticipantModel>(this.participants)

                console.log(this.participants)
            },
            error => {

            }
        )
    }

    convertDate(dateOfBirth: any) {
        let date = new Date(dateOfBirth);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return day + '-' + month + '-' + year;
    }
}
