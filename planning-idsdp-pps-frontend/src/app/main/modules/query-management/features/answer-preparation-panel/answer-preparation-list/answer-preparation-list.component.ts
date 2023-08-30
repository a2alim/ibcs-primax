import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngBangla} from '../answer-preparation-list/i18n/bn';
import {locale as lngEnglish} from '../answer-preparation-list/i18n/en';

export interface UserData {
    id: string;
    name: string;
    progress: string;
    color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
    'Ministry', 'Division', 'Ministry', 'Division', 'Ministry', 'Division', 'Ministry', 'Division', 'Ministry', 'Division',
    'Ministry', 'Division', 'Ministry', 'Division', 'others'
];
const NAMES: string[] = [
    'Star Marks', 'Non Star Marks', 'Star Marks', 'Non Star Marks', 'Star Marks', 'Non Star Marks', 'Star Marks', 'Non Star Marks', 'Star Marks', 'Non Star Marks',
    'Star Marks', 'Non Star Marks', 'Star Marks', 'Non Star Marks', 'Star Marks', 'Non Star Marks', 'Star Marks', 'Non Star Marks', 'Star Marks'
];

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-answer-preparation-list',
    templateUrl: './answer-preparation-list.component.html',
    styleUrls: ['./answer-preparation-list.component.scss']
})
export class AnswerPreparationListComponent implements AfterViewInit {

    form: FormGroup;
    displayedColumns: string[] = ['id', 'name', 'progress', 'color', 'action'];
    dataSource: MatTableDataSource<UserData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        // Create 100 users
        const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(users);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            questionSourceSearch: ['', ''],
            questionTypeSearch: ['', '']
        });
    }



    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
        id: id.toString(),
        name: name,
        progress: Math.round(Math.random() * 100).toString(),
        color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
}

