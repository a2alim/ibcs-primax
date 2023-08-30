import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ToastrService } from 'ngx-toastr';
import {
    downloadIcon,
    editIcon,
    previousIcon,
    printIcon,
    saveIcon,
    updateIcon,
} from '../../../constants/button.constants';
import { ResearchFinalSubmissionService } from '../../../services/research-final-submission.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ResearcherProposalService } from '../../../services/researcher-proposal.service';
import { JasperServiceService } from '../../../services/jasper-service.service';
import { reportBackend } from 'environments/environment';

@Component({
    selector: 'app-view-research-final-submission',
    templateUrl: './view-research-final-submission.component.html',
    styleUrls: ['./view-research-final-submission.component.scss'],
})
export class ViewResearchFinalSubmissionComponent implements OnInit {
    /*----Button---*/
    saveIcon = saveIcon;
    editIcon = editIcon;
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    updateIcon = updateIcon;
    /*----/Button---*/

    spinner: boolean = false;
    userInfo: any = {};
    m1ResearcherProfilePersonalInfoId: number;
    m1ResearcherProposalId: number;
    proposalUuid: string;
    finalReportOfProposalSubmission: any = {};
    proposalObj: any = {};

    spinner2: boolean;
    data: any = {};

    constructor(
        private toaster: ToastrService,
        private storageService: StorageService,
        private activateRoute: ActivatedRoute,
        private _router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private researchFinalSubmissionService: ResearchFinalSubmissionService,
        private proposalService: ResearcherProposalService,
        private jasperService: JasperServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.m1ResearcherProfilePersonalInfoId = Number(
            this.activateRoute.snapshot.paramMap.get(
                'm1ResearcherProfilePersonalInfoId'
            )
        );
        this.m1ResearcherProposalId = Number(
            this.activateRoute.snapshot.paramMap.get('m1ResearcherProposalId')
        );
        this.proposalUuid = this.activateRoute.snapshot.paramMap.get('proposalUuid');
        this.userInfo = this.storageService.getUserData();
        this.findByResearcherProposalId();
        this.getResearcherProposalByUuId();
    }



    saveOrUpdate() {
        this.researchFinalSubmissionService
            .onSaveOrUpdate(this.finalReportOfProposalSubmission)
            .subscribe(
                (response) => {
                    if (response && response.success) {
                        this.toaster.success(response.message);
                    } else {
                        this.toaster.warning(response.message);
                    }
                },
                (error) => {
                    console.log('Update error =>', error);
                }
            );
    }

    onClickEdit() {
        this._router.navigate(['research-final-submission/' + this.m1ResearcherProfilePersonalInfoId + "/" + this.m1ResearcherProposalId + "/" + this.proposalUuid]);
    }

    onClickPrevious() {
        this._router.navigate(['/researcher/list']);
    }

    finalSubmit(){
        let m1ResearcherProposalId = this.m1ResearcherProposalId;
        this.researchFinalSubmissionService.submitFinalReport(m1ResearcherProposalId).subscribe(
            response =>{
              if (response && response.success) {
                this.toaster.success(response.message);
               // this._router.navigate(['view-final-report-of-research-submission/'+this.m1ResearcherProfilePersonalInfoId+"/"+this.m1ResearcherProposalId+"/"+this.proposalUuid]);
              }else{
                this.toaster.warning(response.message);
              }
            },
            error =>{
              console.log('save or update error =>', error);
            }
          );
        //this._router.navigate(['research-final-submission/' + this.m1ResearcherProfilePersonalInfoId + "/" + this.m1ResearcherProposalId + "/" + this.proposalUuid]);
    }

    findByResearcherProposalId() {
        if (!this.m1ResearcherProposalId) {
            this.toaster.warning('Researcher Proposal ID Not Found!');
            return;
        }

        this.researchFinalSubmissionService
            .findByResearcherProposalId(this.m1ResearcherProposalId)
            .subscribe(
                (response) => {
                    if (response && response.obj) {
                        this.finalReportOfProposalSubmission = response.obj;
                    }
                    else {
                        this.onClickEdit();
                    }
                },
                (error) => {
                    console.log('error', error);
                }
            );
    }

    getResearcherProposalByUuId() {
        this.spinner = true;
        this.proposalService.getByUuid(this.proposalUuid).subscribe(
            (response) => {
                if (response.success) {
                    this.proposalObj = response.obj;
                }
                this.spinner = false;
            },
            (err) => {
                console.log('err', err);
                this.spinner = false;
            }
        )
    }


    // download() {
    //     let lang = localStorage.getItem("currentLang");
    //     this.spinner2 = true;
    //     this.jasperService.generateFinalReportOfRresearchSubmissionPdf(this.m1ResearcherProposalId, this.proposalUuid, lang).subscribe((response) => {
    //         this.spinner2 = false;
    //         let file = new Blob([response], { type: 'application/pdf' });
    //         var fileURL = URL.createObjectURL(file);
    //         window.open(fileURL);
    //     }, error => {
    //         this.spinner2 = false;
    //     });
    // }


    download($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'rms-reports/researchFinalSubmissionReport';
        this.data['lng'] = localStorage.getItem("currentLang");
        this.data['finalReportOfProposalSubmission'] = JSON.stringify(this.finalReportOfProposalSubmission) ;
        this.data['proposalObj'] = JSON.stringify(this.proposalObj);

        // this.data['finalReportOfProposalSubmission'] = JSON.stringify({}) ;
        // this.data['proposalObj'] = JSON.stringify({});

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';     

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


}
