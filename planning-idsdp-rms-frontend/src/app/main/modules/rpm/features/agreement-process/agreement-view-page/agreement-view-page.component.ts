import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AgreementWithResearcherServiceService} from '../../../services/agreement-with-researcher-service.service';
import {downloadIcon, noteIcon, pdfIcon, previousIcon, printIcon} from '../../../constants/button.constants';
import {GedBeedbackSeviceService} from '../../../services/ged-feedback-sevice.service';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {JasperServiceService} from "../../../services/jasper-service.service";
import {ResearchCategoryTypeService} from 'app/main/modules/settings/services/research-category-type.service';
import {environment, reportBackend} from 'environments/environment';
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import * as bl2Js from 'bl2-js-report';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
    selector: 'app-agreement-view-page',
    templateUrl: './agreement-view-page.component.html',
    styleUrls: ['./agreement-view-page.component.scss']
})
export class AgreementViewPageComponent implements OnInit {

    id: any;
    allTabData: any = [];
    researchCategoryTypeList: any[] = [];
    tbObj1: any = {};
    tb2List: any = [];
    tbObj3: any = {};
    tbObj4: any = {};
    spinner2: boolean = false;
    spinner: boolean = false;

    data: any = {};

    researcherProfileInfo:any = {};
    userInfo:any = {};
    researchCategoryName:any = {};

    constructor(
        private router: Router,
        private activateRoute: ActivatedRoute,
        private _agreementWithResearcherServiceService: AgreementWithResearcherServiceService,
        private _router: Router,
        private feedbackService: GedBeedbackSeviceService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private jasperService: JasperServiceService,
        private _researchCategoryTypeService: ResearchCategoryTypeService,
        private _researchProfileMultiFormService : ResearchProfileMultiFormService,
        private userService : UserListServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    /*----Button---*/
    previousIcon = previousIcon; downloadIcon = downloadIcon; printIcon = printIcon;
    noteIcon = noteIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    ngOnInit(): void {
        this.id = this.activateRoute.snapshot.paramMap.get('id');
        let researcherProfileUuid = this.activateRoute.snapshot.paramMap.get('researcherProfileUuid');
        let userId = this.activateRoute.snapshot.paramMap.get('userId');
        //this.getResearchCategoryTypeList();
        this.getAllTabData(researcherProfileUuid, userId);
    }


    getAllTabData(researcherProfileUuid, userId) {
        this._agreementWithResearcherServiceService.getAllTabData(this.id).subscribe(
            res => {
                if (res.success) {
                    this.allTabData = res.obj;
                    this.tbObj1 = this.allTabData.tabOne;
                    this.tb2List = this.allTabData.tabTwo;
                    this.tbObj3 = this.allTabData.tabThree;
                    this.tbObj4 = this.allTabData.tabFour;
                    this.getResearchCategoryTypeList();
                }
            }
        );
        this.userService.getUserById(userId).subscribe((res) => {
            console.log('res == ', res);
            this.userInfo = res
        })
        this._researchProfileMultiFormService.profileView(researcherProfileUuid).subscribe((res) => {
            console.log('res?.personalInfo =', res?.personalInfo);
            this.researcherProfileInfo = res?.personalInfo
        })

    }

    backAgreementList() {
        this._router.navigate(['agreement-process'])
    }

    downloadPdf($researchCatId:any, $researcherProfileUuid:any) {

        //let $researchCatId = $tbObj1?.researcherProposalId?.stResearchCatTypeId;
        //let researcherProfileUuid = $tbObj1?.researcherProposalId?.researcherProfilePersonalInfoMaster?.uuid;

        console.log('$researchCatId', $researchCatId);
        //return;

        var $downloadFileName = "";
        var $viewFileName = "";
        if($researchCatId == 1)
        {

            $downloadFileName = "Institutional-Agreement";
            $viewFileName = "InstitutionalAgreement";
        }
        if($researchCatId == 2)
        {
            $downloadFileName = "Fellowship-Agreement";
            $viewFileName = "FellowshipAgreement";
        }
        if($researchCatId == 4)
        {
            $downloadFileName = "PhD-Agreement";
            $viewFileName = "PhdAgreement";
        }
        if($researchCatId == 5)
        {
            $downloadFileName = "MPhil-Agreement";
            $viewFileName = "MPhilAgreement";
        }
        if($researchCatId == 6)
        {
            $downloadFileName = "Promotional-Agreement";
            $viewFileName = "PromotionalAgreement";
        }

        this.data['fileName'] = $downloadFileName;
        this.data['templateName'] = 'rms-reports/agreement/' +$viewFileName;
        //this.data['templateName'] = 'ti-reports/agreement-view';//
        this.data['lng'] = localStorage.getItem("currentLang");

        this.data['allTabData'] = JSON.stringify(this.allTabData);
        this.data['tbObj1'] = JSON.stringify(this.tbObj1);
        this.data['tb2List'] = JSON.stringify(this.tb2List);
        this.data['tbObj3'] = JSON.stringify(this.tbObj3);
        this.data['tbObj4'] = JSON.stringify(this.tbObj4);
        this.data['minioEndPointHost'] = environment.ibcs.minioEndPointHost
        this.data['researcherProfileInfo'] = JSON.stringify(this.researcherProfileInfo)
        this.data['userInfo'] = JSON.stringify(this.userInfo);
        this.data['researchCategoryName'] = this.researchCategoryName;
        this.data['headOfInstitute'] = sessionStorage.getItem('instHeadName')||"";

        //console.log('data = ', this.data);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
/*
    download() {
        let lang = localStorage.getItem("currentLang");
        if(lang==='en'){
            lang='bn' ;
        }
        this.genPdf(lang);
    }

    //for pdf gen
    genPdf(lang) {
        this.spinner2 = true;
        this.jasperService.generateAgreementPdf(this.id, lang).subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })

    }
    */

    print() {

    }

    // downloadFile(url) {
    //     this.feedbackService.download(url).subscribe(res => {

    //     });
    // }
    downloadFile(fileFath: any) {
        // saveAs.saveAs(environment.ibcs.minioEndPointHost+data.fileDownloadUrl, "File.pdf");
        var fileFullPath = environment.ibcs.minioEndPointHost + fileFath;
        console.log('fileFullPath =', fileFullPath);
        window.open(fileFullPath);
        //saveAs.saveAs(environment.ibcs.minioEndPointHost + data.fileDownloadUrlSignature);
    }

    getResearchCategoryTypeList() {
        this.spinner = true;
        this._researchCategoryTypeService.getAllActiveList().subscribe(
            response => {
                this.researchCategoryTypeList = response.items ? response.items : [];
                this.spinner = false;
            }
        );
    }

    showResearchCategory(caragoryId: any) {
        if (!caragoryId) {
            return '';
        }
        let data = this.researchCategoryTypeList.find(f => f.id == caragoryId);
        if (data) {
            this.researchCategoryName = data.categoryName;
            return data.categoryName;
        }
        return '';
    }

}
