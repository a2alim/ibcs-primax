import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SendToDakComponent} from 'app/main/shared/components/send-to-dak/send-to-dak.component';
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../core/constants/constant";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    objectiveAndCostUuid: any;
    uuid: any;

    displayedColumns: string[] = ['date', 'type', 'action'];
    displayedColumnsGrandInformation: string[] = ['sl', 'title','date','amount', 'action'];
    dataSource: MatTableDataSource<any>;
    dataSourceGrandInformation: MatTableDataSource<any>;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;

    constructor(private dialog: MatDialog,) {
    }

    ngOnInit(): void {
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
    }

    sendDppTappToNothi() {
        //const reportType = (this.projectSummary.isForeignAid) ? 'en' : 'bn';
        const source = null;
        //= this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' ? 'dpp' : 'tapp';
        let srcUserGroup = this.setSourceOriginType();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            source: source,
            sourceId: this.objectiveAndCostUuid,
            pcUuid: this.uuid,
            reportType: null,
            srcUserGroup: srcUserGroup
        };
        const dialogRef = this.dialog.open(SendToDakComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }

    setSourceOriginType() {
        //throw new Error('Method not implemented.');
    }
}
