import {Component, OnInit} from '@angular/core';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {AuthService} from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {ChequeCollectionResponse} from 'app/main/modules/training-institute/models/cheque-collection-response.model';
import {ChequeCollectionService} from 'app/main/modules/training-institute/services/cheque-collection.service';
import {environment, reportBackend} from "../../../../../../../../environments/environment";
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-cheque-collection-view',
    templateUrl: './cheque-collection-view.component.html',
    styleUrls: ['./cheque-collection-view.component.scss']
})
export class ChequeCollectionViewComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'instituteName', 'collectionDate', 'receivedAmount', 'mobileNo',
        'isChequeReceived', 'signaturedDocument', 'action'];
    dataSource: MatTableDataSource<any>;

       /*----Button---*/
       previousIcon = previousIcon;
       downloadIcon = downloadIcon;
       printIcon = printIcon;
       noteIcon = noteIcon;
       editIcon = editIcon;
       addNewIcon = addNewIcon;
       pdfIcon = pdfIcon;
       /*----/Button---*/

    fiscalYears: any [] = [];
    trainingInstitutes: any[] = [];
    userType: string = this._authService.getLoggedUserType();

    chequeCollectionResponse: ChequeCollectionResponse = new ChequeCollectionResponse();
    tempChequeId: string;
    chequeId: number;
    minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;
    data: any = {}; //must have to check the data array declear same way



    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private route: Router,
                private _authService: AuthService,
                private _activatedRoute: ActivatedRoute,
                private _chequeCollecionService: ChequeCollectionService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = true;
        this.getViewPageInfo()
    }


    getViewPageInfo() {
      this.tempChequeId = this._activatedRoute.snapshot.paramMap.get('id');
      if (this.tempChequeId != null) {
          this.chequeId = Number(this.tempChequeId);
      }
          this._chequeCollecionService.getChequeCollectionById(this.chequeId).subscribe(
              res => {
                  this.spinner = false;
                  this.chequeCollectionResponse = res.data;
                  console.log(this.chequeCollectionResponse);
              }
          );
      }

    viewDetails(id: number) {
        this.route.navigate(['cheque-collection/view/'+ id]);
    }

    edit(id: number) {
        this.route.navigate(['cheque-collection/edit/' + id]);
    }

    download($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/chequeCollection';
        this.data['lng'] = localStorage.getItem("currentLang");




        this.data['chequeCollectionResponse'] = JSON.stringify(this.chequeCollectionResponse);
        console.log(this.chequeCollectionResponse )


        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    print(){
        window.print();
    }
}
