import {Component, OnInit} from '@angular/core';
//----Lng Translation----
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';

import {downloadIcon, noteIcon, previousIcon, printIcon, sendToEnothi} from '../../../../constants/button.constants';
import {DataComService} from 'app/main/core/services/data-com/data-com.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {JasperServiceService} from "../../../../services/jasper-service.service";
import { ApiService } from 'app/main/core/services/api/api.service';
import { environment, reportBackend } from 'environments/environment';
import * as bl2Js from 'bl2-js-report';

@Component({
    selector: 'app-ad-details',
    templateUrl: './ad-details.component.html',
    styleUrls: ['./ad-details.component.scss']
})
export class AdDetailsComponent implements OnInit {    
    $:any;
    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    sendToEnothi = sendToEnothi;
    /*----/Button---*/
    baseUrl  = environment.ibcs.rpmBackend+'api/fyw-sector-sub-sector-selection/';

    subscription: Subscription;
    data: any;
    fiscalYear = localStorage.getItem("fiscalYear");
    numbers = {
        '০': 0,
        '১': 1,
        '২': 2,
        '৩': 3,
        '৪': 4,
        '৫': 5,
        '৬': 6,
        '৭': 7,
        '৮': 8,
        '৯': 9
    };

    langVal: string;
    fiscalYearId: any;
    letterFordata: any;
    spinner2: boolean = false;
    fieldSubFieldList:any;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dataCom: DataComService,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private jasperService: JasperServiceService,
        private api: ApiService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.langVal = localStorage.getItem("currentLang")
        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
    
    }

    ngOnInit(): void {
        let lang = localStorage.getItem("currentLang");        
        this.fiscalYearId = this._activatedRoute.snapshot.paramMap.get('stFiscalYear'),
        this.data = JSON.parse(sessionStorage.letterInfo);
        console.log('data', this.data);
        this.fieldSubFieldList = JSON.parse(this.data.storeData);
        this.letterFordata = this.data?.letterFor;
    }

    back() {
        this.router.navigate(['/create-request-letter']);
    }

    replaceNumbers(val) {
        var output = [];
        for (var i = 0; i < val.length; ++i) {
            if (this.numbers.hasOwnProperty(val[i])) {
                output.push(this.numbers[val[i]]);
            } else {
                output.push(val[i]);
            }
        }
        return output.join('');
    }

    replaceNumbersX(input) {
        var output = [];
        for (var i = 0; i < input.length; ++i) {
            if (this.numbers.hasOwnProperty(input[i])) {
                output.push(this.numbers[input[i]]);
            } else {
                output.push(input[i]);
            }
        }
        return output.join('');
    }

    // downloadX() {
    //     let lang = localStorage.getItem("currentLang");
    //     this.genPdf(this.fiscalYearId,this.letterFordata,lang)

    // }

    printDiv(divName) {       
      //window.location.href = window.location.href;
      var printContents = document.getElementById(divName).innerHTML;          
      var originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;        
      window.print();
      //return false;
      window.location.reload();
      document.body.innerHTML = originalContents;
    }

    genPdf(id, type, lang) {
        this.spinner2 = true;
        this.jasperService.generateRequestLetterPdf(id, type, lang).subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })

    }

    downloadX($fileName = ''){
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'rms-reports/fywSectorSubSectorSelection';
        this.data['lng'] = localStorage.getItem("currentLang");

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        console.log('this.data', this.data);
        return;
        // form.action = reportBackend+'/pdf-generate-post';

        form.action = `${reportBackend}/pdf-generate-post`

        var params = this.data; 
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
     }

     download($fileName:any = '') {

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'rms-reports/fywSectorSubSectorSelection';
        this.data['lng'] = localStorage.getItem("currentLang");

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;

        console.log('this.data', this.data);
        //return;

        bl2Js(this.data, actionUrl);
    }

     unsafe(val)
     {
        return ''; //trustAsHtml(val);
     }
    //  it('should check ng-bind-html', function() {
    //     expect(element(by.binding('myHTML')).getText()).toBe(
    //         'I am an HTMLstring with links! and other stuff');
    //   });


    sendToEnothiFile(){
        console.log('dddddddddd')
     }
}
