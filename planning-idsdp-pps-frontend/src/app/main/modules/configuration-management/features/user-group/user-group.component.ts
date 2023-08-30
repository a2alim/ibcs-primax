import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {UserGroup} from '../../models/user-group.model';
import {UserGroupService} from '../../services/user-group.service';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";
import {AgencyService} from '../../services/agency.service';
import {MinistryDivisionService} from '../../services/ministry-division.service';
import {UserListService} from '../../services/user-list.service';
import {SectorDivisionService} from "../../services/sector-division.service";
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
    selector: 'app-user-group',
    templateUrl: './user-group.component.html',
    styleUrls: ['./user-group.component.scss']
})
export class UserGroupComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChildren("checkboxes") checkboxes: QueryList<MatCheckbox>;

    formGroup: FormGroup;
    actionPermission = [];
    showUserGroupDiv: string;

    usergroup = [{id: 1, name: 'Agency'}, {id: 2, name: 'Ministry'}, {id: 3, name: 'Planning_Commission'}];
    agencyList = [];
    ministryList = [];
    userList = [];
    userGroupList: UserGroup[] = [];
    userGroupListTemp = [];
    selectedUserGroupList: UserGroup[] = [];
    selectedMinistry;
    selectedAgency;
    selectedSectorDivison;
    selectedPlanningMinister;
    selectedEcnec;
    sectorDivisonList = [];
    isSectorDivison: boolean = false;
    planningCommissionUsers = [{id:1, name: 'Sector_Divison'}, {id:2, name: 'Planning_Minister'}, {id:3, name: 'Ecnec'}];

    displayedColumns: string[] = ['sl', 'name', 'designation', 'userGroupId', 'dutyType', 'action'];
    dataSource: MatTableDataSource<UserGroup>;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService, private formBuilder: FormBuilder,
                private service: UserGroupService, private agencyService: AgencyService, private userListService: UserListService,
                private dialog: MatDialog, private ministryDivisionService: MinistryDivisionService, private userGroupService: UserGroupService,
                private snackbarHelper: SnackbarHelper, private sectorDivisionService: SectorDivisionService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.populateForm();
    }

    populateForm() {
        this.formGroup = this.formBuilder.group({
        });
    }

    getAllAgency() {
        this.agencyService.getList().subscribe(res => {
            console.log(res);
            this.agencyList = res;
        });
    }

    getAllMinisty() {
        this.ministryDivisionService.getList().subscribe(res => {
            this.ministryList = res;
        })
    }


    getAllSectorDivison() {
        this.sectorDivisionService.getList().subscribe(res => {
            this.sectorDivisonList = res;
        })
    }
    onChangePlanningUser(e) {
        if(e === 'Sector_Divison') {
            this.selectedEcnec = null;
            this.selectedPlanningMinister = null;
            this.isSectorDivison = true;
            this.getUserByGroup('Planning_Commission');
            this.getAllSectorDivison();
        } else if(e === 'Ecnec') {
            this.selectedPlanningMinister = null;
            this.selectedSectorDivison = null;
            this.isSectorDivison = false;
            this.getEcnecUser(e);
        } else if(e === 'Planning_Minister') {
            this.selectedEcnec = null;
            this.selectedSectorDivison = null;
            this.isSectorDivison = false;
            this.getPlanningMinisterUser(e);
        }
    }

    onUserGroupChange(e) {
        console.log(e.value)
        if (e.value == 1) {
            this.selectedEcnec = null;
            this.selectedPlanningMinister = null;
            this.selectedMinistry = null;
            this.selectedSectorDivison = null;

            this.isSectorDivison = false;
            this.showUserGroupDiv = 'agency';
            this.getAllAgency();
            this.getUserByGroup('Agency');
        } else if (e.value == 2) {
            this.selectedEcnec = null;
            this.selectedPlanningMinister = null;
            this.selectedAgency = null;
            this.selectedSectorDivison = null;

            this.isSectorDivison = false;
            this.showUserGroupDiv = 'ministry';
            this.getAllMinisty();
            this.getUserByGroup('Ministry');
        } else if (e.value == 3) {
            this.selectedEcnec = null;
            this.selectedPlanningMinister = null;
            this.selectedAgency = null;
            this.selectedSectorDivison = null;
            this.selectedMinistry = null;

            this.isSectorDivison = false;
            this.showUserGroupDiv = 'planning_Commission'
            this.getUserByGroup('Planning_Commission');
        }
    }


    /*Get Planning Minister User*/


    getPlanningMinisterUser(value) {
        console.log(value);
        this.selectedSectorDivison = null;
        this.selectedAgency = null;
        this.selectedMinistry = null;
        this.selectedEcnec = null;
        this.selectedPlanningMinister = value;
        this.selectedUserGroupList = [];
        this.userGroupService.getUserByPlanningMinister(value).subscribe(res => {
            console.log(res);
                this.userGroupList.forEach(userGroup => {
                    userGroup.checked = false;
                    if (res.userId === userGroup.user.id) {
                        userGroup.checked = true;
                        this.selectedUserGroupList.push(res);
                    }
                });
                this.getUserNotInPlanningMinister(this.selectedPlanningMinister);
        });
    }


    /*Get Ecnec User*/

    getEcnecUser(value) {
        this.selectedSectorDivison = null;
        this.selectedAgency = null;
        this.selectedMinistry = null;
        this.selectedPlanningMinister = null;
        this.selectedEcnec = value;
        this.selectedUserGroupList = [];
        this.userGroupService.getUserByEcnec(value).subscribe(res => {
                this.userGroupList.forEach(userGroup => {
                    userGroup.checked = false;
                    res.forEach( res => {
                        if (res.userId === userGroup.user.id) {
                            userGroup.checked = true;
                            this.selectedUserGroupList.push(res);
                            const existingIndex = this.selectedUserGroupList.findIndex(data => data.userId == res.userId);
                            const index = this.userGroupList.findIndex(data => data.user.id == res.userId);
                            this.selectedUserGroupList[existingIndex].dutyType = this.userGroupList[index]?.user.dutyType;
                        }
                    })
                });
                this.getUserNotInEcnec(this.selectedEcnec);
        })
    }

    onChangeMinistry(e) {
        console.log(e.value);
        this.selectedSectorDivison = null;
        this.selectedAgency = null;
        this.selectedMinistry = e.value;
        this.selectedUserGroupList = [];
        this.userGroupService.getAllUserByMinistry(e.value).subscribe(res => {
            console.log(res);
            this.userGroupList.forEach(userGroup => {
                userGroup.checked = false;
                res.forEach(r => {
                    if (r.userId === userGroup.user.id) {
                        userGroup.checked = true;
                        this.selectedUserGroupList.push(r);
                    }
                })
            });

            this.getNotInMinistry(this.selectedMinistry);
        })

    }

    onChangeAgency(e) {
        this.selectedMinistry = null;
        this.selectedSectorDivison = null;
        this.selectedAgency = e.value;
        this.selectedUserGroupList = [];
        this.userGroupService.getAllUserByAgency(e.value).subscribe(res => {
            this.userGroupList.forEach(userGroup => {
                userGroup.checked = false;
                res.forEach(r => {
                    if (r.userId === userGroup.user.id) {
                        userGroup.checked = true;
                        this.selectedUserGroupList.push(r);
                    }
                })
            });
            this.getNotInAgency(this.selectedAgency);
        })
    }

    onChangeSectorDivison(e) {
        this.selectedMinistry = null;
        this.selectedAgency = null;
        this.selectedSectorDivison = e.value;
        this.selectedUserGroupList = [];
        this.userGroupService.getAllUserBySectorDivison(e.value).subscribe(res => {
            console.log(res);
            this.userGroupList.forEach(userGroup => {
                userGroup.checked = false;
                res.forEach(r => {
                    if (r.userId === userGroup.user.id) {
                        userGroup.checked = true;
                        this.selectedUserGroupList.push(r);
                    }
                })
            });
            this.getNotInSectorDivison(this.selectedSectorDivison);
        })

    }

    /*Get user from uaa service*/

    getUserByGroup(value: string) {
        this.userListService.getAllUserListByUserGroup(value).subscribe(res => {
            this.userGroupList = [];
            res.forEach(element => {
                const usergroup: UserGroup = {
                    user: element,
                    checked: false,
                    agency: null,
                    ministry: null,
                    nameEn: null,
                    nameBn: null,
                    id: null,
                    uuid: null,
                    userId: null,
                    dutyType: null,
                };
                this.userGroupList.push(usergroup);
            });
            console.log(this.userGroupList);
            this.dataSource = new MatTableDataSource(this.userGroupList);

        })
    }

    onUserChecked(e, userGroup, index) {
        userGroup.ministry = this.selectedMinistry;
        userGroup.agency = this.selectedAgency;
        userGroup.sectorDivison = this.selectedSectorDivison;
        userGroup.ecnec = this.selectedEcnec;
        userGroup.planningMinister = this.selectedPlanningMinister;
        userGroup.checked = true;

        /* For Ecnec And Planning Minster User*/

        if (this.selectedEcnec || this.selectedPlanningMinister) {
            const existingIndex = this.selectedUserGroupList.findIndex(data => data.userId == userGroup.user.id);
            if (!e.checked && existingIndex != -1) {
                /*Remove User from db*/
                this.service.removeUserByUserId(this.selectedUserGroupList[existingIndex].userId).subscribe(res => {
                    console.log(res);
                });
                /*Remove User from selected Group List */
                this.selectedUserGroupList.splice(existingIndex, 1);
                return;
            }
            let findIndex;
            if(this.selectedUserGroupList.length > 0) {
                 findIndex = this.selectedUserGroupList.findIndex(data => data.dutyType == "Head");
            }


            if(this.selectedUserGroupList.length>0 && this.selectedUserGroupList[0].checked && this.selectedPlanningMinister) {
                setTimeout(()=>{e.source.checked = false}, 100/60);
                this.snackbarHelper.openWarnSnackBarWithMessage('You Can not Save Multiple Planning Minister User', 'OK');
                return;
            }


            if (this.selectedEcnec && this.selectedUserGroupList.length > 0 && findIndex != -1 && this.selectedUserGroupList[findIndex].checked && userGroup.user.dutyType == "Head" && e.checked) {
                setTimeout(()=>{e.source.checked = false}, 100/60);
                this.snackbarHelper.openWarnSnackBarWithMessage('You Can not Save Multiple Ecnec Head User', 'OK');
                console.log(this.selectedUserGroupList);
                return;
            } else {
                if(e.checked) {
                    const user = {
                        "userId": userGroup.user.id,
                        "dutyType": userGroup.user.dutyType,
                        "checked": true,
                        'ministry': userGroup.ministry,
                        'agency': userGroup.agency,
                        'sectorDivison': userGroup.sectorDivison,
                        'ecnec': userGroup.ecnec,
                        'planningMinister': userGroup.planningMinister,
                        'nameEn': null,
                        'nameBn': null,
                        'id': null,
                        'uuid': null,
                        'user': null
                    };
                    this.selectedUserGroupList.push(user);
                }
            }
            return;
        }


        /* For Agency , Ministry, and Sector Divison User*/

        const existingIndex = this.selectedUserGroupList.findIndex(data => data.userId == userGroup.user.id);

        if (e.checked) {
            const user = {
                "userId": userGroup.user.id,
                "dutyType": userGroup.user.dutyType,
                "checked": true,
                'ministry': userGroup.ministry,
                'agency': userGroup.agency,
                'sectorDivison': userGroup.sectorDivison,
                'ecnec': userGroup.ecnec,
                'planningMinister': userGroup.planningMinister,
                'nameEn': null,
                'nameBn': null,
                'id': null,
                'uuid': null,
                'user': null
            };
            if (existingIndex != -1) {
                this.selectedUserGroupList[existingIndex].checked = true;
            } else {
                this.selectedUserGroupList.push(user);
            }
        } else {
            if (existingIndex != -1) {
                /*Remove User from db*/
                this.service.removeUserByUserId(this.selectedUserGroupList[existingIndex].userId).subscribe(res => {
                    console.log(res);
                });
                /*Remove User from selected Group List */
                this.selectedUserGroupList.splice(existingIndex, 1);
            }
        }
    }


    onSubmit() {
        /*Save User*/
        this.userGroupService.createUserGroup(this.selectedUserGroupList).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage('Saved Successfully', 'OK');
        })
    }

    getNotInAgency(agencyId: number) {
        this.userGroupService.getNotInAgency(agencyId).subscribe(res => {
            this.userGroupListTemp = [...this.userGroupList];
            let userNotInAgencyList = res;
            let finalList : any  = [];
            this.userGroupListTemp.forEach((it,i)=> {
                const data = userNotInAgencyList.find(e=>it.user.id == e.userId);
                if(!data){
                    finalList.push(it);
                }
                this.dataSource = new MatTableDataSource(finalList);
            })
        })
    }

    getNotInMinistry(ministryId: number): any {
        this.userGroupService.getNotInMinistry(ministryId).subscribe(res => {
            this.userGroupListTemp = [...this.userGroupList];
            let userNotInMinistryList = res;
            let finalList : any  = [];
            this.userGroupListTemp.forEach((it,i)=> {
                const data = userNotInMinistryList.find(e=>it.user.id == e.userId);
                if(!data){
                    finalList.push(it);
                }
                this.dataSource = new MatTableDataSource(finalList);
            })

        })

    }


    getUserNotInEcnec(ecnec: any): any {
        this.userGroupService.getUserByNotInEcnec(ecnec).subscribe(res => {
            this.userGroupListTemp = [...this.userGroupList];
            let userNotInEcnecList = res;
            let finalList : any  = [];
            this.userGroupListTemp.forEach((it,i)=> {
                const data = userNotInEcnecList.find(e=>it.user.id == e.userId);
                if(!data){
                    finalList.push(it);
                };
                this.dataSource = new MatTableDataSource(finalList);
            })
        })
    }


    getUserNotInPlanningMinister(planningMinistry: any): any {
        this.userGroupService.getUserByNotInPlanningMinister(planningMinistry).subscribe(res => {
            this.userGroupListTemp = [...this.userGroupList];
            let userNotInMiniserList = res;
            let finalList : any  = [];
            this.userGroupListTemp.forEach((it,i)=> {
                const data = userNotInMiniserList.find(e=>it.user.id == e.userId);
                if(!data){
                    finalList.push(it);
                }
                console.log(finalList);
                this.dataSource = new MatTableDataSource(finalList);
            })

        })

    }



    getNotInSectorDivison(sectorDivisonId: number) {
        this.userGroupService.getNotInSectorDivison(sectorDivisonId).subscribe(res => {
            this.userGroupListTemp = [...this.userGroupList];
            let userNotInSectorDivisonList = res;
            let finalList : any  = [];
            this.userGroupListTemp.forEach((it,i)=> {
                const data = userNotInSectorDivisonList.find(e=>it.user.id == e.userId);
                if(!data){
                    finalList.push(it);
                }
                this.dataSource = new MatTableDataSource(finalList);
            })
        })
    }
}
