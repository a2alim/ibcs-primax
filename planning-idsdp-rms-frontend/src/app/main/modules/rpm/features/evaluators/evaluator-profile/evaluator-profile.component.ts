import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { StorageService } from "../../../../../core/services/storage/storage.service";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { ExpertEvaluator } from "../../../../settings/models/expert-evaluator.model";
import { ExpertEvaluatorService } from "../../../../settings/services/expert-evaluator.service";
import {
    downloadIcon, editIcon,
    previousIcon, printIcon
} from '../../../constants/button.constants';
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";
import {DataTransportService} from "../../../../settings/services/DataTransportService.service";
@Component({
    selector: 'app-evaluator-profile',
    templateUrl: './evaluator-profile.component.html',
    styleUrls: ['./evaluator-profile.component.scss']
})
export class EvaluatorProfileComponent implements OnInit {
    /*button*/
    editIcon = editIcon;
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    spinner2: boolean = false;
    evaluatorInfo: ExpertEvaluator = new ExpertEvaluator();
    isEvaluator: boolean = false;
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private expertEvaluatorService: ExpertEvaluatorService,
        private storageService: StorageService,
        private router: Router,
        private dataservice:DataTransportService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }
    async ngOnInit(): Promise<void> {
        this.spinner2 = false;
        let userData = this.storageService.getUserData();
        if (userData.userType == "Rms_Evaluator") {
            this.isEvaluator = true;
        }
        await this.getData(userData.id);
    }
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
    async getData(id) {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var storeSessionId = url.searchParams.get("p");
        if(storeSessionId){
            this.router.navigateByUrl('/evaluator-profile');
        }
        this.expertEvaluatorService.getById(id).subscribe(
            res => {
                this.evaluatorInfo = new ExpertEvaluator();
                this.evaluatorInfo = res.obj ? res.obj: new ExpertEvaluator();
            }, error => {
                console.log('error');
            }
        )
    }
    getSectorName(val){
        if(val != "" && val != null){
            var sector = JSON.parse(val);
            return sector.sectorName;
        }
    }
    getSubSectorName(val){
        if(val != "" && val != null){
            var subSector = JSON.parse(val);
            var subSectorName = '';
            subSector.forEach(val =>{
                subSectorName += val.stSubSectorsName+', ';
            })
            return subSectorName;
        }
    }

    editProfile(data) {
        this.dataservice.mode='edit';
        this.dataservice.isEvaluator = true;
        this.dataservice.evaluatorData=data
        this.router.navigate(['/expert-evaluator/add'])
    }
}
