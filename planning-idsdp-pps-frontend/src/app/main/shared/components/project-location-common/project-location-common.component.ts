import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FuseTranslationLoaderService} from '../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {DivisionService} from '../../../modules/configuration-management/services/division.service';
import {UnsubscribeAdapterComponent} from '../../../core/helper/unsubscribeAdapter';
import {DivisionModel} from '../../../modules/configuration-management/models/division.model';
import {MunicipalityModel} from '../../../modules/configuration-management/models/municipality.model';
import {UpazillaModel} from '../../../modules/configuration-management/models/upazilla.model';
import {ZillaModel} from '../../../modules/configuration-management/models/zilla.model';
import {Subscription} from 'rxjs';
import {LocationHelperService} from '../../services/location-helper.service';
import {IProjectConcept} from "../../../modules/project-concept-management/models/project-concept";
import {ProjectSummaryService} from "../../../modules/project-concept-management/services/project-summary.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-project-location-common',
    templateUrl: './project-location-common.component.html',
    styleUrls: ['./project-location-common.component.scss']
})
export class ProjectLocationCommonComponent extends UnsubscribeAdapterComponent implements OnInit {

    @Input() showGis: boolean = false;
    @Input() conceptUuid: string;
    @Input() locations: { divisions: DivisionModel[], zillas: ZillaModel[], upazilas: UpazillaModel[], municipalitys: MunicipalityModel[] };
    @Output() sendData: EventEmitter<{ divisions: number[], zilla: number[], upazilla: number[], municipality: number[] }> = new EventEmitter();

    dataList = [];
    data = [];
    // uuid: string;
    selectedDivisions = [];
    selectedZilla = [];
    selectedUpazilla = [];
    selectedMunicipality = [];

    projectSummary: IProjectConcept;

    onlyChecked: boolean;
    zillaPanelOpenState = false;
    upaZilaPanelOpenState = false;
    municipalityPanelOpenState = false;
    clickEventSubscription: Subscription;
    show: boolean;
    spinner: boolean;
    allDivision = false;
    isEnLabel: boolean;
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private divisionService: DivisionService,
                private route: ActivatedRoute,
                private projectSummaryService: ProjectSummaryService,
                private locationHelperService: LocationHelperService,
                private _translateService: TranslateService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.clickEventSubscription = this.locationHelperService.getProjectLocationEvent().subscribe(() => {
            this.setSelectedLocation();
            this.data = this.dataList.map(m => ({
                ...m,
                checked: this.locations ? !!this.locations.divisions.find(f => f.id === m.id) : false
            }));
        });
    }

    ngOnInit(): void {
        this.show = true;
        if (this.conceptUuid) {
            this.getProjectSummary();
        }
        this.getAllData();
        this.isEnLabel = this._translateService.currentLang === 'en';
    }

    // for get ProjectSummary
    private getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.projectSummary = res;
        });
    }

    // For getting all active Division list
    private getAllData() {
        this.subscribe$.add(
            this.divisionService.getAllActiveDivisionWithZillaUpazillaAndMunicipalty().subscribe(res => {

                if (this.projectSummary === undefined || this.projectSummary === null || this.projectSummary.isForeignAid) {
                    res.sort((a, b) => a.nameEn.localeCompare(b.nameEn))
                        .map(d => {
                            d.zillas.sort((a, b) => a.nameEn.localeCompare(b.nameEn))
                                .map(z => {
                                    z.upaZillas.sort((a, b) => a.nameEn.localeCompare(b.nameEn))
                                        .map(u => {
                                            u.municipalitys.sort((a, b) => a.nameEn.localeCompare(b.nameEn))
                                        })
                                })
                        });
                } else {
                    res.sort((a, b) => a.nameBn.localeCompare(b.nameBn))
                        .map(d => {
                            d.zillas.sort((a, b) => a.nameBn.localeCompare(b.nameBn))
                                .map(z => {
                                    z.upaZillas.sort((a, b) => a.nameBn.localeCompare(b.nameBn))
                                        .map(u => {
                                            u.municipalitys.sort((a, b) => a.nameBn.localeCompare(b.nameBn))
                                        })
                                })
                        });
                }
                this.dataList = this.arrangeData(res);
                this.data = this.arrangeData(res);
                this.setSelectedLocation();
                this.show = false;
            })
        );
    }


    // arranging data after getting data
    private arrangeData(res: DivisionModel[]) {
        return res.map(d => ({
            ...d,
            checked: this.locations ? !!this.locations.divisions.find(f => f.id === d.id) : false,
            zillaList: d.zillas.map(z => ({
                ...z,
                checked: this.locations ? !!this.locations.zillas.find(f => f.id === z.id) : false,
                upaZillaList: z.upaZillas.map(u => ({
                    ...u,
                    checked: this.locations ? !!this.locations.upazilas.find(f => f.id === u.id) : false,
                    municipalityList: u.municipalitys.map(m => ({
                        ...m,
                        checked: this.locations ? !!this.locations.municipalitys.find(f => f.id === m.id) : false,
                    }))
                }))
            }))
        }));
    }

    // set location patch value for update
    private setSelectedLocation() {
        if (this.locations) {
            this.selectedDivisions = this.locations.divisions ?
                this.locations.divisions.map(m => ({
                    ...m,
                    checked: (m['zillaList'].length > 0) ? m['zillaList'].every(e => e['checked']) : false
                })) : [];
            this.selectedZilla = this.locations.zillas ?
                this.locations.zillas.map(m => ({
                    ...m,
                    checked: (m['upaZillaList'].length > 0) ? m['upaZillaList'].every(e => e['checked']) : false
                })) : [];
            this.selectedUpazilla = this.locations.upazilas ?
                this.locations.upazilas.map(m => ({
                    ...m,
                    checked: (m['municipalityList'].length > 0) ? m['municipalityList'].every(e => e['checked']) : false
                })) : [];
            this.selectedMunicipality = this.locations.municipalitys ? this.locations.municipalitys : [];
        }
        if (this.data.length === this.locations?.divisions.length) {
            this.allDivision = true;
        }
    }

    // For showing only checked item
    onlyCheckedChanged(checked: boolean) {
        this.onlyChecked = checked;
    }


    // For selecting all under any division, zilla, upazilla, municipalty
    checkedAll(checked: boolean, data: any, type: 'd' | 'z' | 'u' | 'm', index: number): void {
        if (type === 'd') {
            if (checked) {
                this.data = this.dataList.map(m => ({...m, checked: true}));
                this.selectedDivisions = this.dataList;
                this.sendLocationData();
            } else {
                this.data = this.dataList.map(m => ({...m, checked: false}));
                this.selectedDivisions = [];
                this.selectedZilla = [];
                this.selectedUpazilla = [];
                this.sendLocationData();
            }
        } else if (type === 'z') {
            if (checked && this.selectedDivisions[index].zillaList?.length > 0) {
                this.selectedDivisions[index].zillaList.forEach(e => {
                    if (this.selectedZilla.length === 0) {
                        this.selectedZilla.push({...e, checked: false});
                        this.sendLocationData();
                    } else if (this.selectedZilla.find(f => f.id !== e.id)) {
                        this.selectedZilla.push({...e, checked: false});
                        this.sendLocationData();
                    }
                    e['checked'] = checked;
                });
            } else {
                if (this.selectedDivisions[index].zillaList?.length > 0) {
                    this.selectedDivisions[index].zillaList.forEach(e => {
                        this.selectedZilla.splice(this.selectedZilla.findIndex(i => i.id === e.id), 1);
                        e['checked'] = checked;
                        this.sendLocationData();
                    });
                }
            }
        } else if (type === 'u') {
            if (checked && this.selectedZilla[index].upaZillaList?.length > 0) {
                this.selectedZilla[index].upaZillaList.forEach(e => {
                    if (this.selectedUpazilla.length === 0) {
                        this.selectedUpazilla.push({...e, checked: false});
                        this.sendLocationData();
                    } else if (this.selectedUpazilla.find(f => f.id !== e.id)) {
                        this.selectedUpazilla.push({...e, checked: false});
                        this.sendLocationData();
                    }
                    e['checked'] = checked;
                    this.sendLocationData();
                });
            } else {
                if (this.selectedZilla[index].upaZillaList?.length > 0) {
                    this.selectedZilla[index].upaZillaList.forEach(e => {
                        this.selectedUpazilla.splice(this.selectedUpazilla.findIndex(i => i.id === e.id), 1);
                        e['checked'] = checked;
                        this.sendLocationData();
                    });
                }
            }
        } else if (type === 'm') {
            if (checked && this.selectedUpazilla[index].municipalityList?.length > 0) {
                this.selectedUpazilla[index].municipalityList.forEach(e => {
                    if (this.selectedMunicipality.length === 0) {
                        this.selectedMunicipality.push({...e, checked: false});
                        this.sendLocationData();
                    } else if (this.selectedMunicipality.find(f => f.id !== e.id)) {
                        this.selectedMunicipality.push({...e, checked: false});
                        this.sendLocationData();
                    }
                    e['checked'] = checked;
                });
                this.sendLocationData();
            } else {
                if (this.selectedUpazilla[index].municipalityList?.length > 0) {
                    this.selectedUpazilla[index].municipalityList.forEach(e => {
                        this.selectedMunicipality.splice(this.selectedMunicipality.findIndex(i => i.id === e.id), 1);
                        e['checked'] = checked;
                        this.sendLocationData();
                    });
                    this.sendLocationData();
                }
            }
        }
    }

    selectAllOverBangladesh(checked: boolean) {
        this.allDivision = checked;
        this.selectedDivisions = []
        this.selectedZilla = [];
        this.selectedUpazilla = [];
        this.selectedMunicipality = [];
        if (checked) {
            this.data.forEach(d => {
                d.checked = true;
                this.selectedDivisions.push({...d, checked: true});
                this.sendLocationData();
                d.zillaList.forEach(z => {
                    z.checked = true;
                    this.selectedZilla.push({...z, checked: true});
                    this.sendLocationData();
                    z.upaZillaList.forEach(u => {
                        u.checked = true;
                        this.selectedUpazilla.push({...u, checked: true})
                        this.sendLocationData();
                    })
                });
            });
        } else {
            this.data.forEach(d => {
                d.checked = false;
                this.sendLocationData();
                d.zillaList.forEach(z => {
                    z.checked = false;
                    this.sendLocationData();
                    z.upaZillaList.forEach(u => {
                        u.checked = false;
                        this.sendLocationData();
                    })
                });
            });
        }
    }

    // For calling during a check changed
    checkedChanged(checked: boolean, data: any, type: 'd' | 'z' | 'u' | 'm'): void {
        if (checked) {
            if (type === 'd') {
                this.data[this.data.findIndex(f => f.id === data.id)].checked = checked;
                this.selectedDivisions.push({...data, checked: false});
                this.sendLocationData();
            }
            if (type === 'z') {
                const p = this.selectedDivisions.findIndex(f => f.id === data.division.id);
                this.selectedDivisions[p].zillaList[this.selectedDivisions[p].zillaList.findIndex(f => f.id === data.id)].checked = checked;
                if (this.selectedZilla.length === 0) {
                    this.selectedZilla.push({...data, checked: false});
                    this.sendLocationData();
                } else {
                    if (this.selectedZilla.find(f => f.id !== data.id)) {
                        this.selectedZilla.push({...data, checked: false});
                        this.sendLocationData();
                    }
                }
            }
            if (type === 'u') {
                const p = this.selectedZilla.findIndex(f => f.id === data.zilla.id);
                this.selectedZilla[p].upaZillaList[this.selectedZilla[p].upaZillaList.findIndex(f => f.id === data.id)].checked = checked;
                if (this.selectedUpazilla.length === 0) {
                    this.selectedUpazilla.push({...data, checked: false});
                    this.sendLocationData();
                } else {
                    if (this.selectedUpazilla.find(f => f.id !== data.id)) {
                        this.selectedUpazilla.push({...data, checked: false});
                        this.sendLocationData();
                    }
                }
            }
            if (type === 'm') {
                const p = this.selectedUpazilla.findIndex(f => f.id === data.upaZilla.id);
                this.selectedUpazilla[p].municipalityList[this.selectedUpazilla[p].municipalityList.findIndex(f => f.id === data.id)].checked = checked;
                if (this.selectedMunicipality.length === 0) {
                    this.selectedMunicipality.push({...data, checked: true});
                    this.sendLocationData();
                } else {
                    if (this.selectedMunicipality.find(f => f.id !== data.id)) {
                        this.selectedMunicipality.push({...data, checked: true});
                        this.sendLocationData();
                    }
                }
            }
        } else {
            if (type === 'd') {
                this.data[this.data.findIndex(f => f.id === data.id)].checked = checked;
                const i = this.selectedDivisions.findIndex(f => f.id === data.id);
                this.selectedDivisions[i].zillaList?.forEach(z => {
                    z.checked = false;
                    this.selectedZilla.splice(this.selectedZilla.findIndex(f => f.id === z.id), 1);
                    this.sendLocationData();
                    z.upaZillaList?.forEach(u => {
                        u.checked = false;
                        this.selectedUpazilla.splice(this.selectedUpazilla.findIndex(f => f.id === u.id), 1);
                        this.sendLocationData();
                        u.municipalityList?.forEach(m => {
                            m.checked = false;
                            this.selectedMunicipality.splice(this.selectedMunicipality.findIndex(f => f.id === m.id), 1);
                            this.sendLocationData();
                        });
                    });
                });
                this.selectedDivisions.splice(i, 1);
                this.sendLocationData();
            }
            if (type === 'z') {
                const i = this.selectedZilla.findIndex(f => f.id === data.id);
                this.selectedZilla[i].upaZillaList?.forEach(u => {
                    u.checked = false;
                    this.selectedUpazilla.splice(this.selectedUpazilla.findIndex(f => f.id === u.id), 1);
                    this.sendLocationData();
                    u.municipalityList?.forEach(m => {
                        m.checked = false;
                        this.selectedMunicipality.splice(this.selectedMunicipality.findIndex(f => f.id === m.id), 1);
                        this.sendLocationData();
                    });
                });
                this.selectedZilla.splice(i, 1);
                this.sendLocationData();
            }
            if (type === 'u') {
                let i = this.selectedUpazilla.findIndex(f => f.id === data.id);
                this.selectedUpazilla[i].municipalityList?.forEach(m => {
                    m.checked = false;
                    this.selectedMunicipality.splice(this.selectedMunicipality.findIndex(f => f.id === m.id), 1);
                    this.sendLocationData();
                });
                this.selectedUpazilla.splice(i, 1);
                this.sendLocationData();
            }
            if (type === 'm') {
                this.selectedMunicipality.splice(this.selectedMunicipality.findIndex(f => f.id === data.id), 1);
                this.sendLocationData();
            }
        }
    }


    //  Filtering checked data
    getData(data: any) {
        if (data !== undefined && data.length > 0) {
            return data.filter(f => f.checked);
        } else {
            return [];
        }
    }

    // Send to child location
    sendLocationData() {
        this.sendData.emit({
            divisions: this.selectedDivisions,
            zilla: this.selectedZilla,
            upazilla: this.selectedUpazilla,
            municipality: this.selectedMunicipality
        });
    }
}
