import { Component, OnInit } from '@angular/core';
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon, saveFailed, saveSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { EvaluatorsGrantAmountLetter } from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import { GuarantorRequest } from 'app/main/modules/training-institute/models/guarantor-request.model'
import { GuarantorService } from 'app/main/modules/training-institute/services/guarantor.service'
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from "../../../../../../shared/services/file-upload.service";
import { ProposalService } from "../../../../services/proposal.service";
import { ConfigurationService } from "../../../../../settings/services/configuration.service";

@Component({
    selector: 'app-add-new-guarantor',
    templateUrl: './add-new-guarantor.component.html',
    styleUrls: ['./add-new-guarantor.component.scss']
})
export class AddNewGuarantorComponent implements OnInit {

    //Icon
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;

    //Toast Config
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    displayedColumns: string[] = ['sl', 'subject', 'examination', 'result', 'passing_year', 'institution', 'board', 'action'];
    dataSource: MatTableDataSource<EvaluatorsGrantAmountLetter>;
    days: any[] = [];

    //Variable

    guarantorRequest: GuarantorRequest = new GuarantorRequest();
    isUpdatedAction: boolean;
    guarantorId: number;
    tempGuarantorId: string;
    isEditable: boolean = false;
    isReset: boolean = false;
    fileRef: any;
    nidImg: any;
    sigImg: any;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;


    fiscalYears: { id: number, fiscalYear: string, active: boolean }[] = [];
    courseList: { id: number, name: string }[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private route: Router,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _gurantorService: GuarantorService,
        private _fileUploadService: FileUploadService,
        private _proposalService: ProposalService,
        private _configurationService: ConfigurationService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.getReadyForEdit();
    }

    ngOnInit(): void {


        // this._courseService.getCourseList(2000, 0).subscribe(
        //     res => {
        //         console.log(res)
        //         this.trainingTitles = res.data;
        //     },
        //     error => {
        //         console.log(error)
        //     }
        // )
        this.dayGenerator();
        this.getFiscalYears()
        this._proposalService.getProposals(2000, 0).subscribe(res => {
            console.log(res)
            res.data.forEach(course => {
                this.courseList.push({ id: course.id, name: course.trainingName })
            })

        })
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }

    addGuarantor(guarantorRequest: GuarantorRequest) {
        this._gurantorService.addGuarantor(guarantorRequest).subscribe(
            () => {
                this.route.navigate(['guarantor-list']);
                this._toastrService.success(saveSuccess, "Success");
            },
            error => {
                this._toastrService.error(saveFailed, "Error");
                console.log("Error: " + error);
            }
        )
    }

    getReadyForEdit() {
        this.tempGuarantorId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.tempGuarantorId != null) {
            this.isEditable = true;
            this.guarantorId = Number(this.tempGuarantorId);
        }

        console.log(this.guarantorId);

        if (this.isEditable) {
            this._gurantorService.getGuarantorById(this.guarantorId).subscribe(
                res => {
                    this.guarantorRequest.proposalId = res.proposalModel.id;
                    this.guarantorRequest.guarantorName = res.guarantorName;
                    this.guarantorRequest.designation = res.designation;
                    this.guarantorRequest.mobileNo = res.mobileNo;
                    this.guarantorRequest.email = res.email;
                    this.guarantorRequest.image = res.image;
                    this.guarantorRequest.nid = res.nid;
                    this.guarantorRequest.nidImage = res.nidImage;
                    this.guarantorRequest.jobInfo = res.jobInfo;
                    this.guarantorRequest.presentAddress = res.presentAddress;
                    this.guarantorRequest.permanentAddress = res.permanentAddress;
                    this.guarantorRequest.signatureImage = res.signatureImage;
                    this.guarantorRequest.refundDays = res.refundDays;
                    this.guarantorRequest.fiscalYearId = res.fiscalYearId;
                }
            );
        }
    }
    resetFrom() {
        this.isReset = true;
        this.fileRef = undefined;
        this.nidImg = undefined;
        this.sigImg = undefined;
        this.guarantorRequest.signatureImage = undefined;
        this.guarantorRequest.nidImage = undefined;
        this.guarantorRequest.image = undefined;
    }
    editGuarantor(guarantorRequest: GuarantorRequest, guarantorId: number) {
        this._gurantorService.editGuarantor(guarantorRequest, guarantorId).subscribe(
            () => {
                this._toastrService.success(updateSuccess, "Success");
                this.route.navigate(['guarantor-list']);
            },
            error => {
                this._toastrService.error(updateFailed, "Error");
                console.log("Error: " + error);
            }
        )
    }

    uploadFile(files: FileList, tag: string) {

        // this.fileRef = 
        console.log(files[0].name + " " + tag)
        if (tag === 'profile_image') {
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.guarantorRequest.image = data;
            })
        } else if (tag === 'nid_image') {
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.guarantorRequest.nidImage = data;
            })
        } else if (tag === 'signature') {
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.guarantorRequest.signatureImage = data;
            })
        }
    }

    save() {
        if (this.isEditable) {
            this.editGuarantor(this.guarantorRequest, this.guarantorId);
        } else {
            this.addGuarantor(this.guarantorRequest);
        }
    }

    private getFiscalYears() {
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
            },
            error => {
                console.log(error)
            }
        )
    }



    dayGenerator() {
        for (let i = 1; i <= 30; i++) {
            this.days.push({
                id: i
            });
        }

    }

}
