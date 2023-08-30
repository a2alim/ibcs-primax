import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { ExpertEvaluator } from '../../../models/expert-evaluator.model';
import { ExpertEvaluatorEducation } from '../../../models/expert-evaluator-education-model';
import { ExpertEvaluatorService } from '../../../services/expert-evaluator.service';
import { ToastrService } from 'ngx-toastr';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SectorTypeService } from '../../../services/sector-type.service';
import { SubSectorService } from '../../../services/sub-sector.service';
import { ExpertEvaluatorSectorSubSector } from '../../../models/expert-evaluator-sector-subsector-model';
import { ExpertEvaluatorBySsrc } from '../../../models/expert-evaluator-by-ssrc';
import { CommmonTypes } from "../../../models/CommmonTypes";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmDialogConstant } from "../../../../../shared/constant/confirm.dialog.constant";
import { SubmitConfirmationDialogComponent } from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import { FormGroup, NgForm } from "@angular/forms";
import { environment } from "../../../../../../../environments/environment";
import { ApiService } from "../../../../../core/services/api/api.service";
import { AuthService } from "../../../../auth/services/auth.service";
import { FORM_TYPES } from '../../../constants/common.constants';
import { UserListServiceService } from '../../../services/user-list-service.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { CommonTypeService } from '../../../services/common-type.service';
import { DateAdapter } from '@angular/material/core';
import {Router} from "@angular/router";
import {OtpComponent} from "../../../../../shared/components/otp/otp.component";
import {AddEvaluatorModalComponent} from ".././add-evaluator-modal/add-evaluator-modal.component";
import {previousIcon, viewIcon} from '../../../constants/button.constants';
import {DataTransportService} from "../../../services/DataTransportService.service";

@Component({
  selector: 'app-expert-evaluator-list',
  templateUrl: './expert-evaluator-list.component.html',
  styleUrls: ['./expert-evaluator-list.component.scss']
})
export class ExpertEvaluatorListComponent implements OnInit {

    // Common Properties
    spinner: boolean = false;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'name','mobileNo' ,'presentProfession','action'];
    dataSource: any;

    certificateColumns: string[] = ['education_level', 'subject_area', 'university_institute', 'result', 'action'];
    certificateDataSource: any;
    certificateDataSourceRows = [];

    //sectorColumns: string[] = ['sector', 'sub_sector', 'action'];
    sectorColumns: string[] = ['sector','sub_sector', 'action'];
    sectorDataSource: any;
    sectorDataSourceRows = [];
    stSubSectorsIdsList: any;

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    expertEvaluator: ExpertEvaluator = new ExpertEvaluator();

    expertEvaluatorBySsrc: ExpertEvaluatorBySsrc = new ExpertEvaluatorBySsrc();
    expertEvaluatorEducation: ExpertEvaluatorEducation = new ExpertEvaluatorEducation();
    expertEvaluatorEducationList: ExpertEvaluatorEducation[] = [];

    sectorSubSector: ExpertEvaluatorSectorSubSector = new ExpertEvaluatorSectorSubSector();
    sectorSubSectors: ExpertEvaluatorSectorSubSector[] = [];
    formTitle = '';
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    sectors = [];
    subSectors = [];
    allSubSectors = [];
    commonTypesList: CommmonTypes[] = new Array<CommmonTypes>();
    educationLevelList: CommmonTypes[] = new Array<CommmonTypes>();
    isValid: boolean = false;
    @ViewChild('inputForm') inputForm: NgForm;
    frmGroup: FormGroup;

    userList: any[] = [];
    userInfo: any;
    viewIcon = viewIcon;
    previousIcon=previousIcon

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private expertEvaluatorService: ExpertEvaluatorService,
                private sectorTypeService: SectorTypeService,
                private subSectorService: SubSectorService,
                private dialog: MatDialog,
                private api: ApiService,
                private _authService: AuthService,
                private toastr: ToastrService,
                private userListService: UserListServiceService,
                private storageService: StorageService,
                private commonTypeService: CommonTypeService,
                private dateAdapter: DateAdapter<Date>,
                private route: Router,
                private dataservice:DataTransportService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
    }


    ngOnInit(): void {
        this.dataservice.evaluatorData=null;
        this.dataservice.mode=null;

        this.initialize();

        this.spinner = true;
        this.userInfo = this.storageService.getUserData();

        // Load List
        this.getListData();

        // Load Sector
        this.getSectorTypes();

        // Load SubSector
        this.getSubSectorTypes();


        //Add Certificate Row
        this.addCertificateRow();

        //Add Certificate Row
        this.addSectorDataSource();
        this.spinner = false;

        //For user list
        this.getUserList();

        this.getCommonTypeList();

        var d = new Date(2022, 6, 1);
        d.setMonth(d.getMonth() + 8);

    }

    private addCertificateRow() {
        this.certificateDataSourceRows.push(this.expertEvaluatorEducation)
        this.certificateDataSource = new MatTableDataSource(this.certificateDataSourceRows);
        this.expertEvaluatorEducation = new ExpertEvaluatorEducation();
    }

    private removeCertificateRow(index) {
        this.certificateDataSourceRows.splice(index, 1);
        this.certificateDataSource = new MatTableDataSource(this.certificateDataSourceRows);

    }

    private addSectorDataSource() {
        this.sectorDataSourceRows.push(new ExpertEvaluatorSectorSubSector());
        this.sectorDataSource = new MatTableDataSource(this.sectorDataSourceRows);
        this.expertEvaluator.sectorSubSectors.push(new ExpertEvaluatorSectorSubSector());
    }

    private removeSectorRow(index) {
        this.sectorDataSourceRows.splice(index, 1);
        this.sectorDataSource = new MatTableDataSource(this.sectorDataSourceRows);
        if(this.sectorDataSourceRows.length==0){
            this.sectorDataSourceRows.push(new ExpertEvaluatorSectorSubSector());
        }
    }

    private getSubSectorTypes() {
        this.subSectorService.getAll().subscribe(res => {
            this.allSubSectors = res.items;
        });
    }

    private getSectorTypes() {
        this.sectorTypeService.getAll().subscribe(res => {
            this.sectors = res.items
        });
    }

    initialize() {
        const expertEvaluatorEducation = new ExpertEvaluatorEducation();
        const sectorSubSector = new ExpertEvaluatorSectorSubSector();
        this.expertEvaluator.educations.push(expertEvaluatorEducation);
        this.expertEvaluator.sectorSubSectors.push(sectorSubSector);
        this.expertEvaluator.expertEvaluatorBySsrc = this.expertEvaluatorBySsrc;
        //Set Logged User Name
        let tokenInfo = this._authService.getLoggedUserDetails();
        this.expertEvaluator.name = tokenInfo.name;
        this.expertEvaluator.userId = tokenInfo.id;
    }

    onSubmit(action, myForm: NgForm) {
        if (myForm.valid) {
            this.spinner = true;
            this.expertEvaluator.educations = this.certificateDataSourceRows;

            if (action == "Edit") {
                this.expertEvaluatorService.updateExpertEvaluator(this.expertEvaluator, this.expertEvaluator.id).subscribe(res => {
                    if (res.success) {
                        this.showSuccessResponse(res.message);
                        this.getListData();
                        myForm.resetForm();
                    }
                    this.spinner = false;
                })
            } else {
                this.expertEvaluatorService.saveExpertEvaluator(this.expertEvaluator).subscribe(res => {
                    if (res.success) {
                        this.showSuccessResponse(res.message);
                        this.getListData();
                        myForm.resetForm();
                    }
                    this.spinner = false;
                })
            }
        }
    }


    showSuccessResponse(message) {
        this.toastr.success(message, "Success!", this.config);
        this.getListData();
        this.expertEvaluator = new ExpertEvaluator();
        this.initialize();
    }

    formReset(myForm: NgForm) {
        myForm.resetForm();
    }

    deleteEducation(i) {
        this.removeCertificateRow(i)
    }

    getListData() {
        this.spinner = true;
        this.expertEvaluatorService.getList(this.page, this.pageSize).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.items);
            //  this.totalElements = res.page ? res.page.totalElements : 0;
            this.spinner = false;
        })
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData();
    }

    editRow(data) {
        this.dataservice.mode='edit';
        this.dataservice.evaluatorData=data
        this.route.navigate(['/expert-evaluator/add'])
        // this.expertEvaluatorService.getById(data.id).subscribe(res => {
        //     this.expertEvaluator = new ExpertEvaluator();
        //     this.formTitle = "Edit";
        //     this.expertEvaluator = res.obj;
        //     this.expertEvaluator.expertEvaluatorBySsrc = res.obj.expertEvaluatorBySsrc?res.obj.expertEvaluatorBySsrc:this.expertEvaluatorBySsrc;
        //
        //     //Eudcation
        //     this.certificateDataSourceRows = this.expertEvaluator.educations;
        //     this.certificateDataSource = new MatTableDataSource(this.certificateDataSourceRows);
        //     this.expertEvaluatorEducation = new ExpertEvaluatorEducation();
        //     //Sector Sub Sector
        //     this.sectorDataSourceRows = [];
        //     this.expertEvaluator.sectorSubSectors.forEach(element =>{
        //         this.sectorSubSector = new ExpertEvaluatorSectorSubSector();
        //         this.sectorSubSector.sector = JSON.parse(element.sector);
        //         this.sectorSubSector.sectorId = this.sectorSubSector.sector.sectorId;
        //         this.sectorSubSector.subSector = JSON.parse(element.subSector);
        //         this.sectorSubSector.subSector.forEach(ele => {
        //             this.sectorSubSector.subSectorIds.push(ele.stSubSectorsId);
        //         });
        //         this.sectorDataSourceRows.push(this.sectorSubSector);
        //
        //         this.getSubsectorBySector(this.sectorSubSector.sector.sectorId);
        //     });
        //     if(this.expertEvaluator.sectorSubSectors.length>0){
        //         this.sectorDataSource = new MatTableDataSource(this.sectorDataSourceRows);
        //     }else{
        //         this.expertEvaluator.sectorSubSectors.push(new ExpertEvaluatorSectorSubSector());
        //     }
        // })
    }

    getSubsectorBySector(sectorId) {
        this.subSectorService.getBySectorId(sectorId).subscribe(res => {
            this.subSectors = res.items;
        })
    }

    onCheckBoxChange(event, tag) {
        switch (tag) {
            case 'thesisGroup':
                this.expertEvaluator.thesisGroup = event.source.checked;
                break;
            case 'isVerified':
                this.expertEvaluator.expertEvaluatorBySsrc.isVerified = event.source.checked;
                break;
            case 'acceptEvaluator':
                this.expertEvaluator.expertEvaluatorBySsrc.acceptAsEvaluator = event.source.checked;
                break;
            case 'Suitable for Proposal Review':
                this.expertEvaluator.expertEvaluatorBySsrc.suitability = this.expertEvaluator.expertEvaluatorBySsrc.suitability === undefined ? 'Suitable for Proposal Review' :
                    this.expertEvaluator.expertEvaluatorBySsrc.suitability + ',Suitable for Proposal Review';
                break;

            case 'Suitable for Research Evaluation':
                this.expertEvaluator.expertEvaluatorBySsrc.suitability = this.expertEvaluator.expertEvaluatorBySsrc.suitability === undefined ? 'Suitable for Research Evaluation' :
                    this.expertEvaluator.expertEvaluatorBySsrc.suitability + ',Suitable for Research Evaluation';
                break;
            case 'Promotional':
                this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds = this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds === undefined ? 'Promotional' :
                    this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds + ',Promotional';
                break;
            case 'MPhil':
                this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds = this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds === undefined ? 'MPhil' :
                    this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds + ',MPhil';
                break;
            case 'Phd':
                this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds = this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds === undefined ? 'Phd' :
                    this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds + ',Phd';
                break;
            case 'Fellowship':
                this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds = this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds === undefined ? 'Fellowship' :
                    this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds + ',Fellowship';
                break;
            case 'Institutional Research':
                this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds = this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds === undefined ? 'Institutional Research' :
                    this.expertEvaluator.expertEvaluatorBySsrc.researchCategoryIds + ',Institutional Research';
                break;
        }
    }

    openDialog(id: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.expertEvaluatorService.deleteDataById(id).subscribe(res => {
                    this.showSuccessResponse('Delete Successfully');
                    this.getListData();
                }, err => {
                    this.showSuccessResponse('Delete unSuccessfully');
                    console.log(err)
                    this.spinner = false;
                });
            }
            dialogRef.close(true);
        });


    }

    onSectorChange(event, index) {

        let sectorObj = this.sectors.find(element =>event.value == element.id);
        const sector: any = {sectorId: sectorObj.id, sectorName: sectorObj.fieldName};
        this.expertEvaluator.sectorSubSectors[index].sector = JSON.stringify(sector);

        this.getSubsectorBySector(event.value);
    }


    private onSubSectorChange(stSubSectorsIdsList: any, index) {
        let stSubSectorsList: any = [];
        stSubSectorsIdsList.forEach(subSectorId => {
            let subSector = this.subSectors.find(sub => subSectorId == sub.id);
            stSubSectorsList.push({stSubSectorsId: subSector.id, stSubSectorsName: subSector.subFieldName});
        })
        this.expertEvaluator.sectorSubSectors[index].subSector = JSON.stringify(stSubSectorsList);
    }

    baseUrl = environment.ibcs.rmsConfigurationBackend + 'api/common-type/';
    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getUserList() {
        this.userListService.getUserByType("Rms_Evaluator").subscribe(
            res => {
                this.userList = res;
            }
        );
    }

    selectUser(userName) {
        const userData = this.userList.find(user => user.name === userName);
        this.expertEvaluator.userId =userData.id;
        this.expertEvaluator.mobileNo=userData.mobileNumber;
        this.expertEvaluator.emailAddress=userData.emailId;
    }

    getCommonTypeList() {
        this.commonTypeService.findAllByActiveData(2).subscribe(
            res => {
                this.educationLevelList = res ? res : [];
            }
        );
        this.commonTypeService.findAllByActiveData(10).subscribe(
            res => {
                this.commonTypesList = res ? res : [];
            }
        );
    }


    addUser() {
        this.expertEvaluator.userId =null;
        this.expertEvaluator.mobileNo=null;
        this.expertEvaluator.emailAddress=null;
        this.modalForAddEvaluator();
    }


    modalForAddEvaluator(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH_EVALUATOR_MODAL;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.OTP};
        const dialogRef = this.dialog.open(AddEvaluatorModalComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res =>{
            if (res){
                dialogRef.close(true);
                this.getUserList();
            }

        } )

    }






    reloadCurrentRoute() {
        let currentUrl = this.route.url;
        this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.route.navigate([currentUrl]);
        });
    }

    viewDetails(element: any) {
        this.route.navigate(['/view-expert-evulator/'+element.id]);


    }

    addEvaluator() {
        this.dataservice.mode='add';
        this.route.navigate(['/expert-evaluator/add'])

    }

    back() {

    }
}
