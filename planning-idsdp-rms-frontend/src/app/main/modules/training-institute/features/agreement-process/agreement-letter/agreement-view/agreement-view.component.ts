import { Component, OnInit } from '@angular/core';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from "../../../agreement-process/agreement-letter/i18n/en";
import { locale as lngBangla } from "../../../agreement-process/agreement-letter/i18n/bn";
import { AgreementService } from 'app/main/modules/training-institute/services/agreement.service';
import { environment, reportBackend } from "../../../../../../../../environments/environment";
import { JasperServiceService } from "../../../../../rpm/services/jasper-service.service";
import * as bl2Js from 'bl2-js-report';

@Component({
    selector: 'app-agreement-view',
    templateUrl: './agreement-view.component.html',
    styleUrls: ['./agreement-view.component.scss']
})
export class AgreementViewComponent implements OnInit {


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
    agreementUuid: String;
    agreementData: any = {};
    totalBudgetAmount: number = 0;
    minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;
    spinner2: boolean = false;
    minioEndPointHost: any;

    data: any = {};

    constructor(
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private _agreementService: AgreementService,
        private jasperService: JasperServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.agreementUuid = this.activateRoute.snapshot.paramMap.get('uuid');
        if (this.agreementUuid) {
            this.getAllAgreementViewList();
        }

    }

    backToAgreements() {
        this._router.navigate(['/agreement-letter']);
    }


    back() {
        this._router.navigate(['/proposal-list']);
    }

    // download() {
    //     let lang = localStorage.getItem("currentLang");
    //     this.genPdf(lang);
    // }



    download($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/agreement-view';
        this.data['lng'] = localStorage.getItem("currentLang");

        console.log(this.minioFileDownloadEndPointHost+this.agreementData?.guarantorViewListList[0].signatureImage?.bucketName+'/'
        +this.agreementData?.guarantorViewListList[0]?.signatureImage.fileName)

        this.data['agreementData'] = JSON.stringify(this.agreementData);
        this.data['installmentViewLists'] = JSON.stringify(this.agreementData.installmentViewLists);
        this.data['guarantorViewListList'] = JSON.stringify(this.agreementData.guarantorViewListList);
        this.data['witness'] = JSON.stringify(this.agreementData.witness);
        this.data['onBehalf'] = JSON.stringify(this.agreementData.onBehalf);

        this.data['imageUrl'] = this.minioFileDownloadEndPointHost+this.agreementData?.guarantorViewListList[0].image?.bucketName+'/'
        +this.agreementData?.guarantorViewListList[0].image?.fileName;


        this.data['signImageUrl'] = this.minioFileDownloadEndPointHost+this.agreementData?.guarantorViewListList[0].signatureImage?.bucketName+'/'
        +this.agreementData?.guarantorViewListList[0]?.signatureImage.fileName;

        this.data['instlPrcent'] = this.agreementData?.installmentViewLists[0]?.percentageOfInstallment;
        this.data['totalAmount'] = this.agreementData?.installmentViewLists[0]?.totalAmount;
        this.data['refundDays'] = this.agreementData?.guarantorViewListList[0]?.refundDays;

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }



    genPdf(lang) {
        this.spinner2 = true;
        this.jasperService.generateAgreementLetterPdf(this.agreementUuid, lang).subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })

    }

    print() {
        window.print();
    }

    getAllAgreementViewList() {
        this.spinner = true;
        this._agreementService.getAllAgreementViewList(this.agreementUuid).subscribe(
            response => {
                this.spinner = false;
                this.agreementData = response;
                console.log('this.agreementData ==== >>>> ', this.agreementData);
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

}
