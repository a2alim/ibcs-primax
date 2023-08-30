import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
//----Lng Translation----
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {ApiService} from 'app/main/core/services/api/api.service';
import {ToastrService} from 'ngx-toastr';
import {GlobalValidationServiceService} from 'app/main/core/services/global-validation-service.service';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {DataComService} from 'app/main/core/services/data-com/data-com.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {previousIcon, refreshIcon, saveIcon} from '../../../constants/button.constants';
import {CreateLetterGedServiceService} from '../../../services/create-letter-ged-service.service';
import {GedBeedbackSeviceService} from '../../../services/ged-feedback-sevice.service';

@Component({
    selector: 'app-create-ged-feedbak-answer',
    templateUrl: './create-ged-feedbak-answer.component.html',
    styleUrls: ['./create-ged-feedbak-answer.component.scss']
})
export class CreateGedFeedbakAnswerComponent implements OnInit {
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    /*----/Button---*/

    @ViewChild('inputForm') inputForm: NgForm;
    subscription: Subscription;
    @ViewChild("ckeditor") ckeditor: any;

    formTypes: any = [];
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = 'Save'; //Edit
    attachment: string = null;
    fiscalYearListFull: any[] = [];
    fiscalYearList: any[] = [];
    fileToUpload: { id: number, file: File }[] = [];
    editData: any = null;
    change: string = 'false';
    fileUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private globalVal: GlobalValidationServiceService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private gedService: CreateLetterGedServiceService,
        private createLetterService: CreateLetterGedServiceService,
        private feedbackService: GedBeedbackSeviceService,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        this.formTitle = 'Add';
        this.frmGroup = this.formBuilder.group({
            uuid: [''],
            id: [],
            stFiscalYearId: ['', [this.globalVal.trimValidator('Fiscal year')]],
            personName: ['', [this.globalVal.trimValidator('Person name')]],
            designation: ['', [this.globalVal.trimValidator('Designation')]],
            mobileNo: ['', [this.globalVal.trimValidator('Mobile no')]],
            emailAddress: ['', [this.globalVal.trimValidator('E-mail Address')]],
            fileDownloadUrl: [''],
            bucketName: [''],
            fileName: [''],
            mode: [''],
        });

        this.getFiscalyearList();
        this.getFiscalyearListFull();

        this.editData = this.feedbackService.data;
        this.change = 'false';
        if (this.editData != null) {
            this.formTitle = "Edit";
            this.frmGroup.patchValue(this.editData);
            this.attachment = this.editData.fileName;
            this.fileUrl = this.editData.fileDownloadUrl
        }

    }


    editRow(data) {
        this.formTitle = "Edit";
        this.frmGroup.patchValue(data);
        this.frmGroup.patchValue({active: data.active.toString()});
        this.frmGroup.patchValue({form_type: 'Profession'});
        console.log('Edit Data By ' + JSON.stringify(data))
    }


    changeSector(sectorId) {
        console.log('sectorId', sectorId.value);

        //this.subSectorTypeList = [];
        //this.subSectorTypeList = this.subSectorTypeList2;
        // const getUrl = this.baseUrl+'get-list/';
        // this.api.get(getUrl).subscribe(res => {
        //     this.subSectorTypeList = this.subSectorTypeList2;
        // });

    }

    /*------------------------Insert form functions----------------------*/
    onSubmit() {
        if (this.frmGroup.valid) {
            this.submitForm();
        }
    }


    submitForm() {
        if (this.formTitle == 'Edit' && this.change == 'true') {
            this.frmGroup.patchValue({mode: 'edit'});
            this.feedbackService.saveData(this.fileToUpload, this.frmGroup.value).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.router.navigate(['/ged-feedback-list']);
                        this.fileToUpload = [];
                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occord !', "", this.config);
                }
            )
        }
        if (this.formTitle == 'Edit' && this.change == 'false') {
            this.feedbackService.updateData(this.frmGroup.value).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.router.navigate(['/ged-feedback-list']);
                        // this.getListData();
                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occurred !', "", this.config);
                }
            )
        }
        if (this.formTitle != 'Edit') {
            this.feedbackService.saveData(this.fileToUpload, this.frmGroup.value).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);

                        // this.getListData();
                        this.fileToUpload = [];
                        this.router.navigate(['/ged-feedback-list']);
                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occord !.', "", this.config);
                }
            )
        }
    }

    formReset() {
        this.formTitle = 'Add';
        this.frmGroup.reset();
        this.ckeditor.instance.setData('');
        this.inputForm.resetForm();
        this.frmGroup.patchValue({forType: ""});
        this.frmGroup.patchValue({active: 'true'});
    }

    back() {
        this.editData = null;
        this.router.navigate(['/ged-feedback-list']);
    }

    /*------------------------/Insert form functions----------------------*/


    handleFileInput(files: FileList, index: number) {
        if (index === 0) {
            this.attachment = ''
        }
        this.fileToUpload = [];
        this.attachment = ''
        this.change = 'true';
        //this.personalInfoFormModel.profileImage = files.item(0);
        //this.fileToUpload = files.item(0);
        this.fileToUpload.push({id: index, file: files.item(0)});
        console.log(this.fileToUpload)
        // {id:this.in}
    }


    getFiscalyearList() {
        this.gedService.getAllActive().subscribe(
            res => {
                this.fiscalYearList = res.items ? res.items : [];
            }
        );
    }

    getFiscalyearListFull() {
        this.gedService.getAll().subscribe(
            res => {
                this.fiscalYearListFull = res.items ? res.items : [];
            }
        );
    }

    downloadFile() {
        this.gedService.download(this.fileUrl).subscribe(
            res => {
                //console.log(res)
            }
        );

    }

    viewDetails(row) {
        this.createLetterService.data = row;
        this.createLetterService.fiscalYearList = this.fiscalYearListFull;

        this.router.navigate(['/view-letter-ged']);

    }

}

