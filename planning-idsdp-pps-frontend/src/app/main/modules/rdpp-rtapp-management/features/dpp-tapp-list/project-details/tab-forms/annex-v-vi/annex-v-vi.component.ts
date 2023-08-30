import {Component, OnInit} from '@angular/core';

/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {AnnexVVI} from '../../models/annex-v-vi.model';
import {ProjectDetailsPartbService} from '../../services/project-details-partb.service';
import {ProjectDetailsPartB} from '../../models/project-details-partb.model';
import {AnnexVViService} from '../../services/annex-v-vi.service';
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import { environment } from 'environments/environment';
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import {OK} from "../../../../../../../core/constants/message";
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";

/*----/Lng Translation----*/

@Component({
    selector: 'app-annex-v-vi',
    templateUrl: './annex-v-vi.component.html',
    styleUrls: ['./annex-v-vi.component.scss']
})
export class AnnexVViComponent implements OnInit {
    conceptUuid = this.route.snapshot.params['id'];
    uuid: string;
    attachmentUrl;
    buttonDisable: boolean;
    dppMasterUuid;
    isAttachmentEnable: boolean = false;
    annexViAttachmentId: any;
    annexVVI: AnnexVVI = new AnnexVVI();
    projectDetailsPartb: ProjectDetailsPartB = new ProjectDetailsPartB();
    formGroup: FormGroup;
    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private route: ActivatedRoute,
                private router: Router,
                private objectiveAndCostService : DppObjectiveCostService,
                private snackBar: SnackbarHelper,
                private _fileUploadService: FileUploadService,
                private formBuilder: FormBuilder,
                private annexVViService: AnnexVViService,
                private projectSummaryService: ProjectSummaryService,
                private _projectDetailsPartbService: ProjectDetailsPartbService) {
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla)
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            otherAttachment: [''],
        });
        this.getDppMasterUuid();
        this._projectDetailsPartbService.getProjectDetailsPartBuuid().subscribe(uuId => {
            this.projectDetailsPartb.uuid = uuId;
        });
        this.getAnnexV_vi();
    }

    buttonEnable(){
        if(this.dppMasterUuid == null){
            this.buttonDisable = true;
             }else{
            this.buttonDisable= false;
        }
    }

    /* For getting Master table data */
    getDppMasterUuid(){
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
            this.dppMasterUuid = res.uuid;
            this.buttonEnable();
        })
    }

    /* For getting AnnexV_VI */
    getAnnexV_vi() {
        this.annexVViService.getAnnexV_VI(this.conceptUuid).subscribe((res) => {
            console.log("annexVi");
            console.log(res);
            this.uuid = res.uuid;
            if (res.attachmentId != null) {
                this.isAttachmentEnable = true;
                this.attachmentUrl = res.attachmentId.urlPath;
                this.annexViAttachmentId = res.attachmentId.id;

            } else {
                this.isAttachmentEnable = false
            }

        })
    }

    selectFile(file: FileList) {
        this.annexVVI.currentFile = file.item(0);
    }

    onSubmit() {
        if (this.uuid == null) {
            this.save();
        } else {
            this.updateAnnexVvi();
            this.snackBar.openSuccessSnackBarWithMessage("Successfully Updated Data", 'Ok');

        }
    }
    onSubmitAndExit(){
        if (this.uuid == null) {
            this.saveAndExit();
        } else {
            this.updateAnnexVviAndExit();
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.snackBar.openSuccessSnackBarWithMessage("Successfully Updated Data", 'Ok');
        }
    }

    /* For saving AnnexVVI */
    save() {
        this.spinner = true;
        this.annexVVI.projectConceptUuid = this.conceptUuid;
        this.annexVViService.saveAnnexVVI(this.annexVVI).subscribe(res => {
            if(res.status === 201) {
                this.spinner = false;
                this.getAnnexV_vi();
                this.snackBar.openSuccessSnackBar();
            }
            this.spinner = false;
        })
    }

    /* For saving AnnexVVI */
    saveAndExit() {
        this.spinner = true;
        this.annexVVI.projectConceptUuid = this.conceptUuid;
        this.annexVViService.saveAnnexVVI(this.annexVVI).subscribe(res => {
            if(res.status === 201) {
                this.spinner = false;
                this.getAnnexV_vi();
                this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                this.snackBar.openSuccessSnackBar();

            }
            this.spinner = false;
        })
    }

    updateAnnexVvi() {
        this.spinner = true;
        this.annexVVI.projectConceptUuid = this.conceptUuid;
        this.annexVViService.updateAnnexVI(this.annexVVI, this.conceptUuid).subscribe(res => {
            if(res.status === 200) {
                this.spinner = false;
                this.formGroup.reset();
                this.getAnnexV_vi();
            }
            this.spinner = false;
        })
    }

    updateAnnexVviAndExit() {
        this.spinner = true;
        this.annexVVI.projectConceptUuid = this.conceptUuid;
        this.annexVViService.updateAnnexVI(this.annexVVI, this.conceptUuid).subscribe(res => {
            if(res.status === 200) {
                this.spinner = false;
                this.getAnnexV_vi();
            }
            this.spinner = false;
        })
    }



    /* For downloading AnnexVVI */
    download() {
        this._fileUploadService.downloadAttachmentInDppService(this.attachmentUrl);

    }


    /* For Delete Attachment AnnexVVI */

    deleteAttachment() {
        this.spinner = true;
        this._fileUploadService.deleteByIdDpp(this.annexViAttachmentId).subscribe( res => {
            this.spinner = false;
            this.isAttachmentEnable = false;
            this.snackBar.openSuccessSnackBarWithMessage('Succesfully Attachment Delete', OK);
        });
    }

}
