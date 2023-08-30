import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExpertEvaluatorService} from "../../../services/expert-evaluator.service";
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {previousIcon,downloadIcon,printIcon} from '../../../constants/button.constants';
import {CommonTypeService} from "../../../services/common-type.service";


@Component({
    selector: 'app-view-expert-evulator',
    templateUrl: './view-expert-evulator.component.html',
    styleUrls: ['./view-expert-evulator.component.scss']
})
export class ViewExpertEvulatorComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private expertEvaluatorService: ExpertEvaluatorService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private router: Router,
        private commonTypeService: CommonTypeService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        //this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy

    }

    commonTypesList: any;
    educationLevelList: any;
    data: any;
    spinner: boolean = false;
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    spinner2: boolean=false;

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getCommonTypeList((res1) => {
            this.getData(id);
        });
    }


    extractEducationLevel(id) {
        if(id > 0){
            const find = this.educationLevelList.find(f => f.id === id);
            return find.typeName;
        }
        else
        {
            return "";
        }     
    }

    extractSpeciality(id) {
        if(id > 0){
            const find = this.commonTypesList.find(f => f.id === id);
            return find.typeName;
        }
        else
        {
            return "";
        }    
    }


    getData(id) {
        this.expertEvaluatorService.getById(id).subscribe(res => {
            if (res) {
                this.data = res.obj;
            }
        }, error => {
            console.log("error....", error)
        })
    }


    getCommonTypeList(callBack) {
        this.spinner = true;
        this.commonTypeService.findAllByActiveData(2).subscribe(
            res => {
                this.educationLevelList = res ? res : [];
            });
        this.commonTypeService.findAllByActiveData(10).subscribe(
            res => {
                this.commonTypesList = res ? res : [];
            }
        );

        callBack(true);
        this.spinner = false;
    }


    back() {
        this.router.navigate(['/expert-evaluator']);

    }

    parseSector(sector: any) {
        const parse = JSON.parse(sector);
        return parse?.sectorName;


    }

    parseSubSector(subSector: any) {
        let output = "";
        const parse = JSON.parse(subSector);
        parse?.forEach(data => {
            if (output === '') {
                output = data.stSubSectorsName;
            } else {
                output = output + ',' + data.stSubSectorsName;
            }
        })
        return output;
    }

    downloadFile() {

    }
}
