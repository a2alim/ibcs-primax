import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { locale as lngEnglish } from "../rms-dashboard/i18n/en";
import { locale as lngBangla } from "../rms-dashboard/i18n/bn";
import { FuseTranslationLoaderService } from "../../../../core/services/translation-loader.service";
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent } from "ng-apexcharts";
import { RmsDashboardService } from "../../services/rms-dashboard.service";
import { ConfigurationService } from "../../../settings/services/configuration.service";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from '@angular/router';
import {CookieService} from "ngx-cookie-service";
import { ApiService } from 'app/main/core/services/api/api.service';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: number;
}

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};

@Component({
    selector: 'app-rms-dashboard',
    templateUrl: './rms-dashboard.component.html',
    styleUrls: ['./rms-dashboard.component.scss']
})
export class RmsDashboardComponent implements OnInit {

    
    displayedColumns = ['position', 'name', 'weight', 'symbol'];
    dataTable: PeriodicElement[] = new Array();
    dataSource: MatTableDataSource<any>;
    rmsDashboardData: any;
    piaChartLabel: string[] = new Array<string>();
    piaChartNumberOfSeries: number[] = new Array<number>();
    fiscalYears: any[];


    spinner: boolean = false;
    sessionId:any='';

    //@ViewChild('testFrame') iframe: ElementRef;
    @ViewChild('Tokens') Tokens: ElementRef;

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _configurationService: ConfigurationService,
        private _rmsDashboardService: RmsDashboardService,
        private _router: Router,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.getRmsDashboardData();
    }


    ngOnInit(): void {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var storeSessionId = url.searchParams.get("p");
        if(storeSessionId){
            this._router.navigateByUrl('/rms-dashboard');
        }

        this.categoryChart();
        this.getFiscalYears();
    }

    categoryChart() {
        this.chartOptions = {
            series: this.piaChartNumberOfSeries,
            chart: {
                //width: 550,
                //height: 480,
                type: "pie"
            },
            labels: this.piaChartLabel,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }

    private getFiscalYears() {
        this._configurationService.getFiscalYearList().subscribe(
            res => {
                this.fiscalYears = res.items;
            },
            error => {
                console.log(error)
            }
        )
    }

    private getRmsDashboardData() {
        this.spinner = true;
        this._rmsDashboardService.getRmsDashboardData().subscribe(
            data => {
                this.rmsDashboardData = data.obj;
                /*
                data.obj.categoriesWiseProposalResponsesList.forEach(data => {
                    this.piaChartLabel.push(data.categoryName)
                    this.piaChartNumberOfSeries.push(+(data.countProposal))
                });

                data.obj.trainingInstituteResponseList.forEach(data => {
                    this.dataTable.push({
                        name: data.instituteName,
                        position: 0,
                        weight: data.totalPertinentCount,
                        symbol: data.courseCompletedPertinentCount
                    })
                });
                */
                
                this.dataSource = new MatTableDataSource(this.dataTable);
                this.spinner = false;
            }, error => {
                console.log("Error");
                this.spinner = false;
            })
    }

    selectedFiscalYear(value: any) {

        this.rmsDashboardData = {};
        this.piaChartLabel = [];
        this.piaChartNumberOfSeries = [];

        this.dataSource = new MatTableDataSource();
        this.dataTable = new Array();

        if (+(value) === -1) {
            this.getRmsDashboardData();

        } else {
            this.spinner = true;
            this._rmsDashboardService.getRmsDashboardDataByFiscalYear(value).subscribe(
                data => {
                    this.rmsDashboardData = data.obj;

                    this.rmsDashboardData.categoriesWiseProposalResponsesList.forEach(data => {
                        this.piaChartLabel.push(data.categoryName);
                        this.piaChartNumberOfSeries.push(+(data.countProposal));
                    }, error => {
                        console.log(error)
                    });

                    data.obj.trainingInstituteResponseList.forEach(data => {
                        this.dataTable.push({
                            name: data.instituteName,
                            position: 0,
                            weight: data.totalPertinentCount,
                            symbol: data.courseCompletedPertinentCount
                        });
                    });
                    this.dataSource = new MatTableDataSource(this.dataTable);
                    this.spinner = false;
                },
                error => {
                    this.spinner = false;
                }

            );
        }

    }


}


