import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon} from 'app/main/modules/rpm/constants/button.constants';
import {CourseScheduleModel} from 'app/main/modules/training-institute/models/course-response.model';
import {FileUploadService} from 'app/main/shared/services/file-upload.service';
import {ToastrService} from 'ngx-toastr';
import {locale as lngEnglish} from "../../../i18n/en";
import {locale as lngBangla} from "../../../i18n/bn";
import {PartialFinalPaymentService} from "../../../../../../services/partial-final-payment.service";
import {PartialFinalPaymentModel, PaymentVoucherModel} from "../../../../../../models/partial-final-payment.model";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    @Input() participantId: number;

    // @Input() newPaymentModel: PartialFinalPaymentModel;
    newPaymentModel: PartialFinalPaymentModel = new PartialFinalPaymentModel();

    tempPaymentVoucherModels: PaymentVoucherModel[] = [];

    // @Input() isEditable: boolean = false;
    isEditable: boolean = false;

    @Input() partialPaymentId: number;

    /*-----*/
    spinner: boolean = false;
    dataSource: any;
    total: number;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;


    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    uuid: string;

    courseSchedules: CourseScheduleModel[];
    newCourseModel: any;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private route: Router,
        private _toastrService: ToastrService,
        private _partialFinalPaymentService: PartialFinalPaymentService,
        private _fileUploadService: FileUploadService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        if (this.tempPaymentVoucherModels.length == 0) {
            let tempPaymentVoucherModel: PaymentVoucherModel = new PaymentVoucherModel();

            Object.assign(tempPaymentVoucherModel, {
                boucherImage: {
                    bucketName: "string",
                    downloadUrl: "string",
                    fileName: "Upload File",
                    uuid: "string"
                },
                serialNo: 0
            });
            // console.log(tempPaymentVoucherModel)
            this.tempPaymentVoucherModels.push(tempPaymentVoucherModel);
        }
    }

    ngOnInit(): void {


        this._partialFinalPaymentService.getPartialFinalPaymentModel().subscribe(
            res => {
                this.newPaymentModel = res;

                if (this.newPaymentModel.paymentVoucherModels.length != 0) {
                    this.tempPaymentVoucherModels = this.newPaymentModel.paymentVoucherModels;

                    this.tempPaymentVoucherModels.sort((a, b) => {
                        return a.serialNo - b.serialNo;
                    });
                }

            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )

        this._partialFinalPaymentService.getIsEditable().subscribe(
            res => {
                this.isEditable = res;
            },
            err => {
                this._toastrService.error(err.error.message, 'Error');
            }
        )

        console.log(this.tempPaymentVoucherModels)

    }

  
    addNewVoucherUploadRow() {
        let tempPaymentVoucherModel: PaymentVoucherModel = new PaymentVoucherModel();

        Object.assign(tempPaymentVoucherModel, {
            boucherImage: {
                bucketName: "string",
                downloadUrl: "string",
                fileName: "No File Selected",
                uuid: "string"
            },
            serialNo: this.tempPaymentVoucherModels.length
        });

        this.tempPaymentVoucherModels.push(tempPaymentVoucherModel);
    }

    saveAndUpdate() {
        console.log(this.newPaymentModel)

        this.newPaymentModel.paymentVoucherModels = this.tempPaymentVoucherModels;
        this._partialFinalPaymentService.setPartialFinalPaymentModel(this.newPaymentModel);
        this._partialFinalPaymentService.editPartialFinalPayment(this.newPaymentModel, this.newPaymentModel.id).subscribe(
            res => {
                // console.log(res);
                this._toastrService.success(updateSuccess, "Success");

                this.route.navigate(["/partial-and-final-payment"]);
            },
            error => {
                console.log(error);
                this._toastrService.error(updateFailed, "Error");
            }
        )

    }

    uploadFile(files: FileList, index: number) {

        this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
            this.tempPaymentVoucherModels[index].boucherImage = data;
        })

    }

    /*
    * Bottom Default Tab Options
    * */
    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

    showFileName(fileName: string | undefined) {
        if (fileName) {
            if (fileName.length > 15) {
                return fileName.substring(0, 10) + '...' + fileName.substring(fileName.length - 4, fileName.length);
            } else {
                return fileName;
            }
        } else
            return "No File Selected";
    }
}


