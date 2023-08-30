import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, dataNotFount, deleteFailed, deleteSuccess, editIcon, nextIcon, previousIcon, refreshIcon, saveFailed, saveIcon, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { CourseScheduleModel } from 'app/main/modules/training-institute/models/course-response.model';
import { CourseModel } from 'app/main/modules/training-institute/models/course.model';
import { CourseService } from 'app/main/modules/training-institute/services/course.service';
import { TrainersService } from 'app/main/modules/training-institute/services/trainers.service';
import moment from "moment";
import { ToastrService } from 'ngx-toastr';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { ProposalModel } from 'app/main/modules/training-institute/models/proposal.model';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';

@Component({
  selector: 'app-add-new-course-schedule',
  templateUrl: './add-new-course-schedule.component.html',
  styleUrls: ['./add-new-course-schedule.component.scss']
})
export class AddNewCourseScheduleComponent implements OnInit, OnChanges {

  @Input() brodCastChange: BehaviorSubject<any>;
  @Output() nextStep = new EventEmitter<boolean>();
  @Output() backPrevious = new EventEmitter<boolean>();
  @Input() existingProposal: ProposalModel;

  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

  canSave: boolean;
  existingProposalId: number;

  // @Input() newCourseModel: CourseModel;
  // @Input() isEditable: boolean = false;
  // @Input() courseId: number;

  newCourseModel: CourseModel;
  isEditable: boolean = false;
  courseId: number;


  courseScheduleId: any;
  saveSuccess = saveSuccess;
  saveFailed = saveFailed;
  updateSuccess = updateSuccess;
  updateFailed = updateFailed;
  deleteSuccess = deleteSuccess;
  deleteFailed = deleteFailed;
  sentSuccess = sentSuccess;
  dataNotFount = dataNotFount;
  editIcon = editIcon;

  spinner: boolean;
  spinner1: boolean;
  spinner2: boolean;
  spinner3: boolean;
  spinner4: boolean;
  spinner5: boolean;

  /*-----*/
  displayedColumns: string[] = ['session', 'speaker', 'topic', 'date', 'day', 'time', 'action'];
  dataSource: any;
  total: number;


  /*----Button---*/
  refreshIcon = refreshIcon;
  saveIcon = saveIcon;
  previousIcon = previousIcon;
  addNewIcon = addNewIcon;
  nextIcon = nextIcon;
  /*----/Button---*/
  form: FormGroup;
  uuid: string;

  courseSchedules: CourseScheduleModel[] = [];

  courseSchedule: CourseScheduleModel = new CourseScheduleModel();
  toppings = new FormControl();
  speakerList: { id: number, name: string }[] = [];


  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;

  constructor(private route: Router,
    private dateAdapter: DateAdapter<Date>,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _toastrService: ToastrService,
    private _trainersService: TrainersService,
    private _courseService: CourseService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy    
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      "id": [""],
      "session": ["", {
        validators: [Validators.required]
      }], "speakers": ["", {
        validators: [Validators.required]
      }], "topic": ["", {
        validators: [Validators.required]
      }], "date": ["", {
        validators: [Validators.required]
      }], "day": ["", {
        validators: [Validators.required]
      }], "time": ["", {
        validators: [Validators.required]
      }],
      "uuid": [""]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'existingProposal': {
            if (this.existingProposal.id) {
              this.canSave = true;
              this.existingProposalId = this.existingProposal.id;
              this.getTrainerList();
              this.getByProposalId();
            }
            break;
          }
          case 'brodCastChange': {
            this.brodCastChange.subscribe(res => {
              if (res && (res.id && !res.msg)) {
                this.canSave = true;
                this.existingProposalId = res.id;
                this.getTrainerList();
                this.getByProposalId();
              }
              if (res && (res.id && (res.msg == 'delete_success_fully'))) {
                this.getTrainerList();
              }
            });
            break;
          }
        }
      }
    }
  }

  // addSchedule() {
  //   let modale = new CourseScheduleModel();
  //   let formD = Object.assign(modale, this.form.value);
  //   if (!this.courseSchedule.id) {
  //     this.courseSchedule.id = this.courseSchedules.length + 1;
  //     formD.id = this.courseSchedule.id;
  //     this.courseSchedules.push(formD);
  //   } else {
  //     // edit
  //     let index = this.courseSchedules.findIndex(d => d.id === formD.id);
  //     this.courseSchedules[index] = formD;
  //   }
  //   this.courseSchedule = new CourseScheduleModel();
  //   this.dataSource = new MatTableDataSource(this.courseSchedules);
  //   this.form.reset();
  // }

  deleteSchedule(id) {
    let index = this.courseSchedules.findIndex(d => d.id === id);
    this.courseSchedules.splice(index, 1)
    console.log(index)
    this.dataSource = new MatTableDataSource(this.courseSchedules);
  }


  openDialog(rowUuid) {
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
        this.deleteRow(rowUuid);
      }
      dialogRef.close(true);
    });
  }

  deleteRow(i) {
    this.spinner5 = true;
    this._courseService.deleteCourseSchedule(i).subscribe(
      response => {
        if (response.success) {
          this.spinner5 = false;
          this._toastrService.success(deleteSuccess, "Success", this.config);
          this.getByProposalId();
        }
      },
      error => {
        this.spinner5 = false;
        console.log('error ===== >>>>> ', error);
      }
    );
  }


  editSchedule(id: number) {
    let index = this.courseSchedules.findIndex(d => d.id === id);
    this.courseSchedule = this.courseSchedules[index];
    this.form.setValue({
      id: this.courseSchedule.id,
      session: this.courseSchedule.session,
      speakers: this.courseSchedule.speakers,
      topic: this.courseSchedule.topic,
      date: this.courseSchedule.date,
      day: this.courseSchedule.day,
      time: this.courseSchedule.time,
      uuid: this.courseSchedule.uuid,
    });
  }

  convertDate(date: string) {
    return moment(date).format("DD-MM-YYYY");
  }

  onSubmit(f) {

    if (f.invalid) {
      this._toastrService.warning("Please enter the required information !.", "", this.config);
      return;
    }

    let modale = new CourseScheduleModel();
    let formD = Object.assign(modale, this.form.value);
    formD.proposalId = this.existingProposalId;
    if (formD.id) {
      this.onUpdate(formD);
    } else {
      this.onSave(formD);
    }
    this.form.reset();
    this.courseSchedule = new CourseScheduleModel();
  }

  onSave(data: any) {
    this.spinner = true;
    this._courseService.saveCourseSchedule(data).subscribe(
      response => {
        if (response.success) {
          this._toastrService.success(response.message, "Success", this.config);
          this.getByProposalId();
        }
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        this._toastrService.error(error.message, "Success", this.config);
      }
    );
  }

  onUpdate(data: any) {
    this.spinner = true;
    this._courseService.updateCourseSchedule(data).subscribe(
      response => {
        if (response.success) {
          this._toastrService.success(response.message, "Success", this.config);
          this.getByProposalId();
        }
        this.spinner = false;
      },
      error => {
        this._toastrService.error(error.message, "Success", this.config);
        this.spinner = false;
      }
    )
  }

  getByProposalId() {
    if (!this.existingProposalId) {
      return;
    }
    this.spinner3 = true;
    this._courseService.getListData(this.pageSize, this.page, this.existingProposalId).subscribe(
      res => {
        this.totalElements = res.totalItems;
        this.courseSchedules = res.data;
        for (let i = 0; i < this.courseSchedules.length; i++) {
          let speakers: any[] = this.courseSchedules[i].speakers;
          for (let z = 0; z < this.courseSchedules[i].speakers.length; z++) {
            this.courseSchedules[i].speakers[z] = speakers[z].id;
          }
        }
        this.dataSource = new MatTableDataSource(this.courseSchedules);
        this.spinner3 = false;
      },
      error => {
        this.courseSchedules = [];
        this.spinner3 = false;
        this.dataSource = new MatTableDataSource(this.courseSchedules);
      }
    );
  }

  //Pagination Page Change onChangeClick
  onChangePage(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getByProposalId()
  }

  // search data by filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSpeakers(speakers: number[]) {
    let trainers: string[] = []
    speakers.map(sp => {
      let speaker = this.speakerList.find(spk => spk.id === sp)
      if (speaker)
        trainers.push(speaker.name)
    })
    let text = "";
    trainers.forEach(data => {
      text += data + "<br/>"
    })
    return text;
  }

  getTrainerList() {
    if (!this.existingProposalId) {
      return;
    }
    this.spinner4 = true;
    this._trainersService.getTrainersList(0, 2000, this.existingProposalId).subscribe(
      res => {
        this.speakerList = [];
        res.content.forEach(result => {
          this.speakerList.push({ id: result.id, name: result.name });
        });
        this.spinner4 = false;
      });
  }

  nextTab() {
    this.nextStep.emit(true);
  }

  previousTab(): void {
    this.backPrevious.emit(true);
  }

  reseat() {
    this.courseSchedule = new CourseScheduleModel();
  }

  onDateChange() {
    console.log(new Date(this.form.value.date).getDay());
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.form.setValue({ ...this.form.value, day: days[new Date(this.form.value.date).getDay()] });
  }

}
