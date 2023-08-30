import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { environment } from 'environments/environment';
import { downloadIcon, noteIcon, previousIcon, printIcon } from '../../../constants/button.constants';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class DetailsComponent implements OnInit {

  /*----Button---*/
  previousIcon = previousIcon;
  downloadIcon = downloadIcon;
  printIcon = printIcon;
  noteIcon = noteIcon;
  /*----/Button---*/

  baseUrl  = environment.ibcs.rpmBackend+'api/fyw-sector-sub-sector-selection/';

  searchEventSubscription: Subscription;
  data:any;

  fiscalYear = localStorage.getItem("fiscalYear");

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private dataCom: DataComService,
    private router : Router,
    private api: ApiService,
  ) {
     // Language translations
     this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
   }

  ngOnInit(): void {
    this.searchEventSubscription = this.dataCom.getPassedItemData.subscribe(
      res => {
        if(res.length > 0){
          console.log('res --- ', res)
          this.data = res;
        }
        else{
          this.back();
        }
      })
  }

  back(){
    this.router.navigate(['/sector-sub-sector-list']);
  }

  requestLetter()
  {
    this.router.navigate(['/create-request-letter']);
  }

    printDiv(divName: string) {
        //window.location.href = window.location.href;
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        //return false;
        window.location.reload();
        document.body.innerHTML = originalContents;

    }
}
