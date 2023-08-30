import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { downloadIcon, editIcon, noteIcon, previousIcon, printIcon } from '../../../constants/button.constants';
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';

@Component({
  selector: 'app-infor-of-research',
  templateUrl: './infor-of-research.component.html',
  styleUrls: ['./infor-of-research.component.scss']
})
export class InforOfResearchComponent implements OnInit {


/*----Button---*/
previousIcon = previousIcon; downloadIcon = downloadIcon; printIcon = printIcon;
noteIcon = noteIcon;
editIcon = editIcon;
/*----/Button---*/

id:any
tabData:any
spinner:boolean = false;
  constructor(
    private _researchProfileMultiFormService: ResearchProfileMultiFormService,
    private activateRoute:ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router:Router,

  ) {
    // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
      this.id= this.activateRoute.snapshot.paramMap.get('id')
      this.viewProfile(this.id);
      console.log(this.id)
  }

  backResearcherprofilelist() {
    this.router.navigate(['researcher-profile-information']);
}


  viewProfile(id:number) {
    this.spinner=true;
    this._researchProfileMultiFormService.profileView(id).subscribe(data => {
       console.log(data)
       this.tabData=data;
       this.spinner=false;
    }, error => {
        console.log('Successfully not saved')

    })
}

back(){
  this.router.navigate(['/researcher-profile-information']);
}

download(){}

print(){}

}
