import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {ProjectMovementModel} from '../../models/project-movement.model';
import {ProjectMovementService} from '../../services/project-movement.service';
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from '../../../../core/constants/constant';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {UserGroup} from '../../models/user-group.model';
import {UserGroupService} from '../../services/user-group.service';
import {ModuleService} from '../../services/module.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";

@Component({
    selector: 'app-project-movement',
    templateUrl: './project-movement.component.html',
    styleUrls: ['./project-movement.component.scss'],
})
export class ProjectMovementComponent extends UnsubscribeAdapterComponent implements OnInit {

    formGroup: FormGroup;
    displayedColumns: string[] = ['sl', 'movementTitleEn', 'movementTitleBn', 'status', 'action'];
    dataSource: MatTableDataSource<ProjectMovementModel>;
    userGroupList: Array<UserGroup> = new Array<UserGroup>();
    moduleList: any;
    statusButtonPosition = new FormControl();
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ProjectMovementService, private userGroupService: UserGroupService,
                private moduleService: ModuleService, private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    // init form data
    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.getUserGroupList();
        this.getModuleList();
        this.getProjectMovementList();
        this.populateForm();
    }

    // for get UserGroup List
    private getUserGroupList() {
        this.subscribe$.add(
            this.userGroupService.getActiveUserGroup(this.page, MAX_PAGE_SIZE).subscribe(res => {
                this.userGroupList = res.content;
            })
        );
    }

    // for get ModuleList
    private getModuleList() {
        this.subscribe$.add(
            this.moduleService.getModuleList().subscribe(res => {
                this.moduleList = res;
            })
        );
    }

    // init form data
    private populateForm() {
        this.formGroup = new FormGroup({
            uuid: new FormControl(''),
            orderId: new FormControl(''),
            statusButtonPosition: new FormControl(''),
            editable: new FormControl('false'),
            movementTitleEn: new FormControl('', [Validators.required]),
            movementTitleBn: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            moduleId: new FormControl(''),
            userGroupId: new FormControl(''),
            status: new FormControl('true')
        });

    }

    onSubmit() {
        (this.formGroup.value.uuid) ? this.update() : this.create();
    }

    // for get ProjectMovement List
    private getProjectMovementList() {
        this.subscribe$.add(
            this.service.getProjectMovementByOrderId(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
                this.total = res.totalElements;
            })
        );
    }

    // for create ProjectMovement
    private create() {
        if (this.statusButtonPosition.value == null || this.statusButtonPosition.value.length === 0) {
            console.log('empty');
        } else {
            let statusButtonPosition = '';
            const len = this.statusButtonPosition.value.length;
            for (let i = 0; i < len; i++) {
                statusButtonPosition += this.statusButtonPosition.value[i] + ':';
            }
            statusButtonPosition = statusButtonPosition.substring(0, statusButtonPosition.length - 1);
            this.formGroup.patchValue({
                statusButtonPosition: statusButtonPosition
            });
            this.subscribe$.add(
                this.service.create(this.formGroup.value).subscribe(res => {
                    if (res.uuid) {
                        this.snackbarHelper.openSuccessSnackBar();
                        this.getProjectMovementList();
                        this.reset();
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                })
            );
        }
    }

    // for update ProjectMovement
    private update() {
        if (this.statusButtonPosition.value == null || this.statusButtonPosition.value.length === 0) {
            console.log('empty');
        } else {
            let statusButtonPosition = '';
            const len = this.statusButtonPosition.value.length;
            for (let i = 0; i < len; i++) {
                statusButtonPosition += this.statusButtonPosition.value[i] + ':';
            }
            statusButtonPosition = statusButtonPosition.substring(0, statusButtonPosition.length - 1);
            this.formGroup.patchValue({
                statusButtonPosition: statusButtonPosition
            });
            this.subscribe$.add(
                this.service.update(this.formGroup.value).subscribe(res => {
                    if (res.uuid) {
                        this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Updated', 'OK');
                        this.getProjectMovementList();
                        this.reset();
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                })
            );
        }
    }

    // edit form data
    edit(row: ProjectMovementModel) {
        this.disableDelete = true;
        this.formGroup.patchValue({
            uuid: row.uuid,
            orderId: row.orderId,
            moduleId: row.moduleId,
            userGroupId: row.userGroupId,
            editable: row.editable.toString(),
            movementTitleEn: row.movementTitleEn,
            movementTitleBn: row.movementTitleBn,
            description: row.description,
            status: row.status.toString()
        });
        this.statusButtonPosition.setValue(row.statusButtonPosition.split(':'));
    }

    // delete ProjectMovement
    delete(row: ProjectMovementModel) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Deleted', 'OK');
                    this.getProjectMovementList();
                }
                this.reset();
            })
        );
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
        this.getProjectMovementList();
    }

    // drag and drop table row
    drop(event: CdkDragDrop<ProjectMovementModel>) {
        const previousIndex = this.dataSource.data.findIndex(row => row === event.item.data);
        moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
        this.dataSource.data = this.dataSource.data.slice();

        const projectIds = [];
        this.dataSource.data.forEach((item, j) => {
            projectIds.push(item.id);
        });
        this.service.moveProject(projectIds).subscribe();
    }

    // reset form data
    reset() {
        this.disableDelete = false;
        this.formGroup.reset();
        this.formGroup.patchValue({
            editable: 'false'
        });
        this.formGroup.patchValue({
            status: 'true'
        });
        this.statusButtonPosition.setValue('');
    }

    private openDialog(row: ProjectMovementModel) {
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
                this.delete(row);
                dialogRef.close(true);
            }else{
                dialogRef.close(true);
            }
        });
    }
}
