import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {UnsubscribeAdapterComponent} from 'app/main/core/helper/unsubscribeAdapter';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {ProjectSummaryService} from 'app/main/modules/project-concept-management/services/project-summary.service';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {DppLocationService} from '../../../services/dpp-location.service';
import {DppProjectSummeryHelperService} from '../../../services/dpp-project-summery-helper.service';
import {DivisionModel} from '../../../../configuration-management/models/division.model';
import {UpazillaModel} from '../../../../configuration-management/models/upazilla.model';
import {IDppLocationWiseCostBreakdown} from '../../../models/dpp-location-wise-cost-breakdown.model';
import {DppLocationWiseCostBreakdownService} from '../../../services/dpp-location-wise-cost-breakdown.service';
import {ERROR, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN} from '../../../../../core/constants/message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
import {TranslateService} from "@ngx-translate/core";
import { ZillaModel } from 'app/main/modules/configuration-management/models/zilla.model';
import {MEDIUM_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";
import {AgencyService} from "../../../../configuration-management/services/agency.service";

@Component({
    selector: 'app-location-wise-cost-breakdown',
    templateUrl: './location-wise-cost-breakdown.component.html',
    styleUrls: ['./location-wise-cost-breakdown.component.scss']
})
export class LocationWiseCostBreakdownComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild('locationCkEditor') locationCkEditor: TemplateRef<any>;
    conceptUuid: string;
    conceptId: number;
    projectSummary: IProjectConcept;
    objectiveCostId: number;
    locationWiseCost: IDppLocationWiseCostBreakdown[] = [];
    locations: { id: number, uuid: string, dppMasterId: number, divisions: DivisionModel[] };
    upazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, upazila: UpazillaModel, zilla: ZillaModel, division: DivisionModel}[] = [];
    show = false;
    saveDisable = false;
    spinner: boolean;
    titleEn: any;

    paripatraVersion: string;
    isParipatra2016: boolean = true;

    ckEditorData: string = '';
    title:any;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    agencyModel: any;

    constructor(private service: DppLocationWiseCostBreakdownService,
                private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private _snackBar: MatSnackBar,
                private route: ActivatedRoute,
                public numberPipe : NumberPipe,
                private helperService: DppProjectSummeryHelperService,
                private locationService: DppLocationService,
                private projectSummaryService: ProjectSummaryService,
                private snackbarHelper: SnackbarHelper,
                private _translateService: TranslateService,
                private dialog: MatDialog,
                private agencyService: AgencyService) {
        super();
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }


    ngOnInit(): void {
        this.conceptUuid = this.route.snapshot.params['id'];
        this.getProjectConceptByUuid();
    }

    /**
     * get Project Concept data by project uuid
     * @private
     */
    private getProjectConceptByUuid() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.titleEn = res.titleEn;
                if (res.isForeignAid) {
                    this._translateService.use('en');
                } else {
                    this._translateService.use('bn');
                }
                this.paripatraVersion = res.paripatraVersion.nameEn;
                if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                    this.isParipatra2016 = true;
                } else {
                    this.isParipatra2016 = false;
                }

                this.conceptId = res.id;
                this.projectSummary = res;
                this.getByLocationWiseCostProjectConceptMasterId();
                this.getAgency();
            })
        );
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    /**
     * get location wise cost by project concept master id
     * @private
     */
    private getByLocationWiseCostProjectConceptMasterId() {
        this.subscribe$.add(
            this.service.getByProjectConceptMasterId(this.conceptId).subscribe(res => {
                this.locationWiseCost = res;
                this.getLocationByObjectCostId();
            })
        );
    }

    private getLocationByObjectCostId() {
        this.subscribe$.add(
            this.locationService.getLocationByObjectiveCostIdUsingProjectSummary(this.conceptId).subscribe(res => {
                if (res) {
                    this.locations = res;
                    this.arrangeData(res);
                } else {
                    this.saveDisable = true;
                    this.show = true;
                    this.snackbarHelper.openWarnSnackBarWithMessage("Require to save Part-A (Project Summary)", OK);
                }
            }, _ => {
                this.saveDisable = true;
                this.show = true;
            })
        );
    }

    private arrangeData(res) {
        let di = 0;
        res.divisions.forEach(division => {
            let zi = 0;
            let upazilaUnderDivision = division.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0);

            if(division && division.zillaList.length==0){
                this.createViewList(res.dppMasterId, division, null, null, di, zi, 0, upazilaUnderDivision);
            }

            division.zillaList.forEach(zilla => {
                let ui = 0;

                if(zilla && zilla.upaZillaList.length==0){
                    this.createViewList(res.dppMasterId, division, zilla, null, di, zi, ui, upazilaUnderDivision);
                }

                zilla.upaZillaList.forEach(upazila => {
                    this.createViewList(res.dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision);
                    ui += 1;
                });
                zi += 1;
            });
            di += 1;
        });

        this.show = true;
    }

    createViewList(dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision){
        const serial = ((!this.projectSummary?.isForeignAid && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(di +1) : di +1);
        let lwc:IDppLocationWiseCostBreakdown;
        if(upazila){
            lwc = this.locationWiseCost.find(f => f.upazilaId === upazila.id);
        } else if(zilla){
            lwc = this.locationWiseCost.find(f => f.zillaId === zilla.id);
        } else if(division){
            lwc = this.locationWiseCost.find(f => f.divisionId === division.id);
        }

        this.upazilas.push(
            {
                location: {
                    uuid: lwc ? lwc?.uuid : null,
                    id: lwc ? lwc?.id : null,
                    dppMasterId: dppMasterId,
                    divisionId: division?.id,
                    zillaId: zilla?.id,
                    upazilaId: upazila?.id,
                    projectConceptMasterId: this.conceptId,
                    projectConceptMasterUuid: this.conceptUuid,
                    comment: lwc ? lwc?.comment : '',
                    estimatedCost: lwc ? lwc.estimatedCost : 0,
                    quantity: lwc ? lwc?.quantity : '',
                },
                sl: serial,
                dSpan: this.calDSpan(division, zilla, upazila, zi, ui), //((zi === 0 && ui === 0) ? upazilaUnderDivision : 0),
                zSpan: this.calZSpan(zilla,ui), //((ui === 0) ? (division.zillaList[zi].upaZillaList.length) : 0),
                upazila: upazila,
                division: division,
                zilla: zilla,

            }
        );
    }

    calDSpan(division, zilla, upazila, zi, ui){
        let dRowSpan = 0;
        if(zi==0 && ui ==0){
            if (zilla){
                division?.zillaList.forEach(element => {
                    dRowSpan +=element.upaZillaList.length == 0?1:element.upaZillaList.length;
                })
            }else {
                dRowSpan = 1
            }
        }else if (zi==0 && !ui){
            dRowSpan = division?.zillaList.length;
        } else{
            dRowSpan = 0;
        }
        return dRowSpan;
    }

    calZSpan(zilla,ui){
        let zRowSpan;
        if (ui === 0){
            if (zilla==null){
                zRowSpan = 1;
            }else if(zilla?.upaZillaList.length==0){
                zRowSpan = 1;
            }else{
                zRowSpan = zilla?.upaZillaList.length;
            }
        }else {
            zRowSpan = 0;
        }
        return zRowSpan;
    }


    /**
     * Save Data
     */
    onSubmit() {
        let isValidated = this.validateForm();
        if(isValidated) {
            (this.locationWiseCost.length > 0) ? this.updateList() : this.createList();
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessageEnBn("Estimated Cost must be greater than or equal to 1", "আনুমানিক খরচ অবশ্যই ১ বা তার থেকে বেশি হতে হবে");
        }
    }

    validateForm() {
        let isValidated = true;
        this.upazilas.forEach(e => {
            if (e.location.estimatedCost<1) {
                isValidated = false;
            }
        });
        return isValidated;
    }

    /**
     * update whole list
     * @private
     */
    private updateList() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.updateList(this.upazilas.map(m => m.location)).subscribe(res => {
                if (res.length > 0) {
                    this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                } else this.snackbarHelper.openErrorSnackBar();
                this.spinner = false;
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage(error.statusText, ERROR);
                this.spinner = false;
            })
        );
    }

    /**
     * crete whole list
     * @private
     */
    private createList() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.createList(this.upazilas.map(m => m.location)).subscribe(res => {
                if (res.length > 0) {
                    this.locationWiseCost = res;
                    this.setUpdatedData(res);
                    this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                } else this.snackbarHelper.openErrorSnackBar();
                this.spinner = false;
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage(error.statusText, ERROR);
                this.spinner = false;
            })
        );
    }

    setUpdatedData(res: IDppLocationWiseCostBreakdown[]) {
        let index = 0;
        this.upazilas.forEach(e => {
            const lwc: IDppLocationWiseCostBreakdown = res.find(
                f => f.upazilaId === this.upazilas[index].location.upazilaId || f.zillaId === this.upazilas[index].location.zillaId
                || f.divisionId === this.upazilas[index].location.divisionId
            );
            this.upazilas[index].location.id = lwc.id;
            this.upazilas[index].location.uuid = lwc.uuid;
            this.upazilas[index].location.estimatedCost = lwc.estimatedCost;
            this.upazilas[index].location.quantity = lwc.quantity;
            this.upazilas[index].location.comment = lwc.comment;
            index += 1;
        });
    }


    keyUp($event: KeyboardEvent, index: number, field: 'quantity' | 'cost' | 'comment') {
        const value = $event.target['value'];
        if (field === 'quantity') {
            this.upazilas[index].location.quantity = value;
        }
        if (field === 'cost') {
            this.upazilas[index].location.estimatedCost = value;
        }
        if (field === 'comment') {
            this.upazilas[index].location.comment = value;
        }
        //this.saveDisable = !this.upazilas.every(m => m.location.estimatedCost > 0 && m.location.quantity > 0);
    }

    /*
   ********* Open dialog box for delete confirmation
   */
    private openDialog(row: DppLocationWiseCostBreakdownService) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {

                dialogRef.close(true);
            } else {
                dialogRef.close(true);
            }

        });
    }

    /*
   ********* History back method
   */
    goBackToHome() {
        window.history.back();
    }

    /**
     * get Location  in Part-A Location table by project summary id
     */
    // getLocation() {
    //     this.locationService.getByProjectSummaryId(1 /*this.helperService.projectSummaryCreateId*/).subscribe((res) => {
    //         this.objectiveCostId = res.objectiveCostId;
    //         this.getLocationByObjectCostId()
    //     })
    // }

    private convertToBanglaNumber(value) {
        const numbers = {
            0: '০',
            1: '১',
            2: '২',
            3: '৩',
            4: '৪',
            5: '৫',
            6: '৬',
            7: '৭',
            8: '৮',
            9: '৯'
        };

        let output = '';
        const input = value.toString();
        for (let i = 0; i < input.length; ++i) {
            if (numbers.hasOwnProperty(input.charAt(i))) {
                output = output + numbers[input[i]];
            }else{
                output = output + input.charAt(i);
            }
        }
        return output;
    }

    openCkEditorDialog(upazila) {
        this.ckEditorData = upazila?.location?.quantity ? upazila?.location?.quantity:'';
        const dialogRef = this.dialog.open(this.locationCkEditor, {
            height: '32vw',
            width: '70vw',
            position: {
                top: '7vh',
                left: '19vw'
            },
        });
        dialogRef.afterClosed().subscribe(
            res => {
                if(res){
                    upazila.location.quantity = this.ckEditorData;
                    this.ckEditorData = null;
                }
                this.dialog.closeAll();
            }
        );
    }

}
