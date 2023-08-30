import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {Router} from "@angular/router";
import {TrainersService} from "../../../../services/trainers.service";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {EvaluatorsGrantAmountLetter} from "../../../../../rpm/models/EvaluatorsGrantAmountLetter";
import {addNewIcon, emailIcon, pdfIcon, previousIcon, printIcon} from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-trainers-list-download',
    templateUrl: './trainers-list-download.component.html',
    styleUrls: ['./trainers-list-download.component.scss']
})
export class TrainersListDownloadComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'trainersName', 'currentPosition', 'mobileNo', 'sex', 'age', 'active'];
    dataSource: MatTableDataSource<any>;

    addNewIcon = addNewIcon;
    emailIcon = emailIcon;
    pdfIcon = pdfIcon;
    printIcon = printIcon
    previousIcon = previousIcon
    trainingInstitutes: any[] = [];
    trainersList: any[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private route: Router,
                private _trainersService: TrainersService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getTrainersList();
    }

    getTrainersList() {
        this._trainersService.getTrainersList(0, 5000,41).subscribe(res => {
            this.trainersList = res.content;
            this.dataSource = new MatTableDataSource(this.trainersList)

        });

    }

    uploadFile(file: FileList, id: number) {

    }

    download(letter: EvaluatorsGrantAmountLetter) {

    }

    print() {
        window.print();    
    }

    back() {
        this.route.navigate(["/trainers"])
    }
}
