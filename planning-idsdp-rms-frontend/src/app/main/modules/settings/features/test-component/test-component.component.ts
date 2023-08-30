import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PageEvent} from "@angular/material/paginator";
import {ProfileMarksSetup} from "../../models/ProfileMarksSetup";
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../core/constants/constant";
import {TestModel} from "../../models/TestModel";


@Component({
    selector: 'app-test-component',
    templateUrl: './test-component.component.html',
    styleUrls: ['./test-component.component.scss']
})

export class TestComponentComponent implements OnInit {

    dataSet: TestModel[] = new Array<TestModel>();

    frmGroup: FormGroup;
    headerTitle: string = 'Test Component Header';
    headerSubTitle: string = 'Home > Test Component';

    //TODO: replace your data count in totalElements
    totalElements: number = DEFAULT_SIZE;

    //TODO: replace your expected number of element in one page
    pageSize: number = DEFAULT_PAGE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];

    //TODO: This is Mat Table Datasource
    dataSource = new MatTableDataSource(this.dataSet);


    constructor(private formBuilder: FormBuilder) {

        //TODO: This Dataset will be come from database though service
        this.dataSet = [
            {id: 12, position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
            {id: 12, position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
            {id: 12, position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
            {id: 12, position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
            {id: 12, position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
            {id: 12, position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
            {id: 12, position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
            {id: 12, position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
            {id: 12, position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
            {id: 12, position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
        ];

        this.totalElements = this.dataSet.length;
        this.dataSource = new MatTableDataSource(this.dataSet);
    }

    ngOnInit(): void {
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }


    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue)
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.totalElements = +event.pageSize; // get the pageSize
        this.pageSize = +event.pageIndex; // get the current page

    }


    editRow(id) {
        //TODO: Add edit logic for edit data
        console.log('Edit Data By ' + id)
    }

    openDeleteDialog(message: string, id) {
        //TODO: Add logic for soft delete
        console.log('Delete Data By ' + id)
    }
}
