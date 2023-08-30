import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DEFAULT_SIZE } from "../../../../core/constants/constant";
import { FuseTranslationLoaderService } from "../../../../core/services/translation-loader.service";
import { ApiService } from "../../../../core/services/api/api.service";
import { ToastrService } from "ngx-toastr";
import { SnackbarHelper } from "../../../../core/helper/snackbar.helper";
import { MatDialog } from "@angular/material/dialog";
import { DataComService } from "../../../../core/services/data-com/data-com.service";
import { Router } from "@angular/router";
import { GlobalValidationServiceService } from "../../../../core/services/global-validation-service.service";
import { CreateGoLetterServiceService } from "../../services/create-go-letter-service.service";
import { locale as lngEnglish } from "../create-go-letter/i18n/en";
import { locale as lngBangla } from "../create-go-letter/i18n/bn";

@Component({
    selector: 'app-research-profile',
    templateUrl: './research-profile.component.html',
    styleUrls: ['./research-profile.component.scss']
})
export class ResearchProfileComponent implements OnInit {
    /*----Button---*/
    // editIcon = editIcon;
    // deleteIcon = deleteIcon;
    // addNewIcon = addNewIcon;
    // viewIcon = viewIcon;
    // refreshIcon = refreshIcon;
    // previousIcon = previousIcon;
    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = 'Save'; //Edit

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    templateType: any;
    predifinedTemplate: any;
    installmentProcess: any;
    getInstallmentProcess: any;
    submitData: any;
    dataSource: any;
    templateId: any;
    predifinedTemplateId: any;
    element: any;

    getInstallmentType: any;
    getTkAmount: any;
    getResearchTitle: any;
    getCategory: any;
    getFiscalYear: any;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'Subject', 'tempType', 'preTemplate', 'ReceiveBankCheque', 'action'];

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private globalVal: GlobalValidationServiceService,
        private _createGoLetterServiceService: CreateGoLetterServiceService,
        private getGoLetterID: CreateGoLetterServiceService,
        private getElement: CreateGoLetterServiceService,
        private _route: Router,
        private _dialog: MatDialog,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        console.log('===== test ====== ');
    }


}
