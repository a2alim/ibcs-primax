import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {RmsEvaluatorsGrantAmountLetterService} from "../../../services/rms-evaluators-grant-amount-letter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {EvaluatorsGrantAmount} from "../../../models/EvaluatorsGrantAmount";
import {EvaluatorsGrantAmountLetter} from "../../../models/EvaluatorsGrantAmountLetter";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../core/constants/constant";
import { previousIcon, refreshIcon, saveIcon ,downloadIcon,printIcon,noteIcon,pdfIcon} from '../../../constants/button.constants';
import {JasperServiceService} from "../../../services/jasper-service.service";
import * as bl2Js from 'bl2-js-report';
import { environment, reportBackend } from 'environments/environment';
@Component({
    selector: 'app-evaluators-grant-amount-letter-details',
    templateUrl: './evaluators-grant-amount-letter-details.component.html',
    styleUrls: ['./evaluators-grant-amount-letter-details.component.scss']
})
export class EvaluatorsGrantAmountLetterDetailsComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    uuid: string;
    spinner: boolean = true;
    displayedColumns: string[] = ['sl', 'evaluatorName', 'researchTitle', 'researchCategory', 'grantAmount'];
    data: EvaluatorsGrantAmountLetter;
    dataSource: MatTableDataSource<EvaluatorsGrantAmount>;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    spinner2: boolean=false;
    refreshIcon = refreshIcon; saveIcon = saveIcon; previousIcon = previousIcon;downloadIcon=downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    pdfIcon=pdfIcon;
    pdfData:any={};

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private activatedRoute: ActivatedRoute,
                private router:Router,
                private jasperService:JasperServiceService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['uuid'];
            this.getByUuidWithADetails();
            // this.spinner = false;
        });
    }

    getByUuidWithADetails() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.getByUuidWithADetails(this.uuid).subscribe(res => {
                if (res.success) {
                    this.data = res.obj;
                    this.dataSource = new MatTableDataSource(res.obj.details);
                    this.dataSource.paginator = this.paginator;
                    this.spinner = false;
                }
            })
        );
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        // this.getByRmsEvaluatorsGrantAmountLetterId();
    }

    back() {
        this.router.navigate(['/evaluators-grant-amount-list']);

    }

    downloadFile() {
        let lang = localStorage.getItem("currentLang");
        this.genPdf(lang);

    }

    genPdf(lang) {
        this.spinner2=true;
        this.jasperService.generateEvaluatorGrantAmountPdf( this.uuid,lang).subscribe((response)=>{
            this.spinner2=false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        },error => {
            this.spinner2=false;
        })

    }



    download() {
        this.pdfData['fileName'] = 'evaluator-grand-amount';
        this.pdfData['templateName'] = 'rms-reports/evaluatorGrandAmount';
        this.pdfData['lng'] = localStorage.getItem("currentLang");
        this.pdfData['data'] = JSON.stringify(this.data);
        // this.pdfData['dataSource'] = JSON.stringify(this.dataSource);

        //Optional
        this.pdfData['view'] = 0; // 0 = false or 1 = true
        this.pdfData['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;

        console.log('this.data', this.pdfData);
        //return;

        bl2Js(this.pdfData, actionUrl);
    }

}
