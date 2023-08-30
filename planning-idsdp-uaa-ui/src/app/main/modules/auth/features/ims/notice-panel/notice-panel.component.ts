import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { NoticeModel } from '../../../model/notice-model.model';
import { NoticeReqModel } from '../../../model/notice-req.model';
import { NoticeService } from '../../../services/notice.service';

@Component({
    selector: 'app-notice-panel',
    templateUrl: './notice-panel.component.html',
    styleUrls: ['./notice-panel.component.scss'],
})
export class NoticePanelComponent implements OnInit {
    @ViewChild('noticeModal') noticeModal: TemplateRef<any>;

    form: FormGroup;

    noticeReqModel: NoticeReqModel = new NoticeReqModel();
    noticeModList: NoticeModel[] = new Array<NoticeModel>();
    dataSource = new MatTableDataSource(this.noticeModList);
    isSearch: boolean;
    noticeId: string = null;
    noticesList: any[] = [];
    noticeDialogRef: any;
    notice: any = {};

    fromDate: Date;
    toDate: Date;
    title: string;

    isLoading: boolean;
    spinner: boolean;
    searchText: string;
    summary: any;
    publishedDate: Date;
    fileBaseUrl: string;

    constructor(
        private noticeService: NoticeService,
        private _dialog: MatDialog,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
      this.fileBaseUrl = environment.ibcs.baseApiEndPoint+'api/';

        this.formCreate();
        this.getAllNoticeList(this.noticeReqModel);
    }

    formCreate() {
        this.form = this.formBuilder.group({
            fromDate: [''],
            toDate: [''],
            title: [''],
        });
    }

    // set Commencement Max Date
    completionDataChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.fromDate = new Date(
            value.getFullYear(),
            value.getMonth(),
            value.getDate()
        );
    }

    // set Completion Min Date
    commencementDataChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.toDate = new Date(
            value.getFullYear(),
            value.getMonth(),
            value.getDate()
        );
    }

    viewAttachment(fileUrl){
      window.open(this.fileBaseUrl+fileUrl);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getAllNoticeList(noticeReqModel: NoticeReqModel) {
        this.isLoading = true;
        this.noticeService.getAllNoticeList(noticeReqModel).subscribe(
            (res) => {
                if (res) {
                    this.noticeModList = res;
                    console.log('noticesList', res);
                }
                this.isLoading = false;
            },
            (err) => {
                console.log('getAllNoticeList : ', err);
                this.isLoading = false;
            }
        );
    }

    searchByCriteria() {
      this.isLoading = true;
        this.noticeService
            .getAllNoticeList(this.form.value)
            .subscribe((res) => {
                if (res) {
                    this.noticeModList = res;
                }
                this.isLoading = false;

            },
            (err) => {
                console.log('Not get All Notice List : ', err);
                this.isLoading = false;
            }
            );
    }

    openMarkDialog(notice) {
        this.notice = notice;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '80%';
        dialogConfig.height = 'auto';

        let modalRef = this._dialog.open(this.noticeModal, dialogConfig);
    }
    reset() {
      this.form.reset();
      this.form.patchValue({
          status: true
      })
  }

}
