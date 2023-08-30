import {Component, OnInit} from '@angular/core';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {ProjectMovementService} from '../../../../configuration-management/services/project-movement.service';
import {ProjectSummaryService} from '../../../../project-concept-management/services/project-summary.service';
import {SectorDivisionService} from '../../../../configuration-management/services/sector-division.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {ProjectTypeService} from '../../../../configuration-management/services/project-type.service';
import {DppProjectSummeryHelperService} from "../../../services/dpp-project-summery-helper.service";
import {values} from "lodash-es";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent extends UnsubscribeAdapterComponent implements OnInit {

    projectType: string;
    isForeignAid: boolean;
    conceptId: string;
    projectTypeId: number;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectMovementService: ProjectMovementService,
                private projectSummaryService: ProjectSummaryService,
                private projectTypeService: ProjectTypeService,
                private sectorDivisionService: SectorDivisionService,
                private _router: Router,
                private route: ActivatedRoute,
                private dppHelperService: DppProjectSummeryHelperService) {
        super();
        this.conceptId = this.route.snapshot.params['id'];
        this.getProjectConceptById();
    }

    ngOnInit(): void {

    }

    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptId).subscribe(res => {
                this.setValuePcIdAndPcUuid(res.id, res.uuid);
                this.isForeignAid = res.isForeignAid;
                this.projectTypeId = res.projectTypeId;
                this.getProjectTypes();
            })
        );
    }

    setValuePcIdAndPcUuid(id: number, uuid: string) {
        this.dppHelperService.projectSummaryCreateId = id;
        this.dppHelperService.projectSummaryUuid = uuid;
    }

    private getProjectTypes() {
            this.projectTypeService.getList().subscribe(res => {
                res.forEach(value => {
                    // @ts-ignore
                    if (value.id === this.projectTypeId) {
                        this.projectType = value.nameEn;
                    }
                });

                // this.populateForm();
            });

    }

    loadProjectSummery() {
        this._router.navigate([`dpp-tapp/add-new/${this.conceptId}`]);
    }

    getAmortizationScheduleTotal() {
        this._router.navigate([`dpp-tapp/amortization_schedule/${this.conceptId}`]);
    }
    getProjectManagementSetup() {
        this._router.navigate([`dpp-tapp/project-management-setup/${this.conceptId}`]);
    }
    getLocationWiseCostBreakdown() {
        this._router.navigate([`dpp-tapp/location-wise-cost-breakdown/${this.conceptId}`]);
    }

    getReference() {
        this._router.navigate([`dpp-tapp/tpp-annexure-two/${this.conceptId}`]);
    }
    getConsultant() {
        this._router.navigate([`dpp-tapp/tpp-annexure-three/${this.conceptId}`]);

    }
    getProjectSummaryId(url){
        let routeUrl = "dpp-tapp/"+url+"/"+this.conceptId;
        this._router.navigate([routeUrl]);

    }

    getAnnexSix() {
        this._router.navigate([`/dpp-tapp/tpp-annexure-six/${this.conceptId}`]);

    }
}
