import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon, pdfIcon, saveIcon} from 'app/main/modules/rpm/constants/button.constants';
import {EvaluatorsGrantAmountLetter} from 'app/main/modules/rpm/models/EvaluatorsGrantAmountLetter';
import {RmsEvaluatorsGrantAmountLetterService} from 'app/main/modules/rpm/services/rms-evaluators-grant-amount-letter.service';
import {ParticipantService} from 'app/main/modules/training-institute/services/participant.service';
import {ToastrService} from "ngx-toastr";
import {ParticipantModel} from "../../../../models/participant.model";
import {ProposalService} from "../../../../services/proposal.service";
import {AuthService} from "../../../../../auth/services/auth.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-participant-list',
    templateUrl: './participant-list.component.html',
    styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'participantName', 'courseTitle', 'sex', 'mobileNo', 'email','completeStatus', 'action'];
    dataSource: MatTableDataSource<any>;
    fiscalYearsList: any[];

    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    addNewIcon = addNewIcon;
    saveIcon = saveIcon;
    pdfIcon = pdfIcon;

    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;

    participants: ParticipantModel[] = []
    courses: { id: number, name: string }[] = [];
    trainingInstitutes: any[] = [];
    selectedInstitute: string;
    userType: string = this._authService.getLoggedUserType();

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private route: Router,
                private _toastService: ToastrService,
                private _participantService: ParticipantService,
                private dialog: MatDialog,
                private _authService: AuthService,
                private _proposalService: ProposalService
    ) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getAllTrainersInstitutesList();
        this.getFiscalYears();
        this.getCourseList();
        this.getParticipantList(this.size, this.page);

    }

    getParticipantList(size: number, page: number) {
        this._participantService.getParticipantList(size, page).subscribe(
            res => {
                this.total = res.totalItems;

                //Check User
               const participantListByLoggedUser: any[] = new Array();
                res.data.forEach(res=>{
                    participantListByLoggedUser.push(res);

                })



                this.dataSource = new MatTableDataSource<ParticipantModel>(participantListByLoggedUser);
                this.participants = participantListByLoggedUser
                console.log(res);

                let data: any[] = this.participants;
                data.map(ps => {

                    ps.courseTitle = this.getCourseTitle(ps.courseId)
                    ps.completed = ps.isCompleted ? 'Yes' : 'No';
                    ps.trainingName = ps.proposalModel.trainingName
                })
                console.log(data[0].createdBy)
                this.dataSource = new MatTableDataSource<any>(data)
            },
            error => {
                console.log("Error: " + error);
                this.spinner = false;
            }
        )
    }

    filterByInstitute() {
        const filterValue = this.selectedInstitute;

        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        }

        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onChangePage(event: PageEvent) {

        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getParticipantList(this.size, this.page);
    }

     // dialog before status chnage
     onCheckBoxChange(checked: boolean, id){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: 'Are you sure that you want change the status?'};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.changeCompleteStatus(checked, id);
            }
            dialogRef.close(true);
        });
    }

    changeCompleteStatus(checked: boolean, id) {
        console.log(checked)
        this._participantService.changeCompleteStatus(id, checked).subscribe(
            res => {
                this._toastService.success("Complete Status Changed", "Success");
                this.getParticipantList(this.size,this.page);
            },
            error => {
                console.log("Error: " + error);
            }
        );
    }

    /*---- For open popup dialog box----*/
    openDialog(rowUuid) {
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
                this.delete(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    delete(id) {
        this._participantService.deleteParticipant(id).subscribe(
            () => {
                this._toastService.success(deleteSuccess, "Success");
                this.getParticipantList(this.size, this.page);
            },
            error => {
                this._toastService.error(deleteFailed, "Error");
                console.log("Error: " + error);
            }
        );
    }

    uploadFile() {

    }

    onChangeFiscalYear() {
        //   this.fiscalYearId ? this.getListByFiscalYear() : this.getList();
    }

    viewDetails(uuid: string) {
        this.route.navigate(['participant-list/' + uuid + '/' + 'view']);
    }

    edit(id: string) {
        this.route.navigate(['participant-list/add/' + id]);
    }

    download(letter: EvaluatorsGrantAmountLetter) {
        this.service.downloadFile(letter.uploadSignatureFile).subscribe(
            _ => {
            }
        );
    }

    getCourseTitle(courseTitle: any) {
        let selectedCourse = this.courses.find(course => course.id == courseTitle);

        if (selectedCourse)
            return selectedCourse.name;
        else
            return "XYZ Course";
    }

    private getAllTrainersInstitutesList() {
        this._authService.getAllUser().subscribe(result => {
            result.forEach(ti => {
                if (ti.userType === 'Rms_Training_Institute') {
                    this.trainingInstitutes.push(ti);
                }
            })

            console.log(this.trainingInstitutes)
        })
    }

    private getCourseList(){
        this._proposalService.getProposals(2000, 0).subscribe(res => {
            console.log(res)
            res.data.forEach(course => {
                this.courses.push({id: course.id, name: course.trainingName})
            })
        })
    }

    private getFiscalYears() {

    }
}

