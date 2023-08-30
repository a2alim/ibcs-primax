import {NgModule} from '@angular/core';

import {AuthGuard} from '../../core/auth/guards/auth.guard';
import {ApprovalStatus} from './features/approvalStatusMaster/ApprovalStatus.module';
import {DevelopmentPartner} from './features/developmentPartnerMaster/developmentPartner.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {MunicipalityComponent} from './features/municipality/municipality.component';
import {ProcurementMethodComponent} from './features/procurement-method/procurement-method.component';
import {ProcurementTypeComponent} from './features/procurement-type/procurement-type.component';
import {JustificationTypeComponent} from './features/justification-type/justification-type.component';
import {ScopeTaskTypeComponent} from './features/scope-task-type/scope-task-type.component';
import {ProjectTypeComponent} from './features/project-type/project-type.component';
import {ParipatraVersionComponent} from './features/paripatra-version/paripatra-version.component';
import {DivisionComponent} from './features/division/division.component';
import {ZillaComponent} from './features/zilla/zilla.component';
import {UpazillaComponent} from './features/upazilla/upazilla.component';
import {EconomicCodeModule} from './features/economicCode/economicCode.module';
import {SubEconomicCodeModule} from './features/subEconomicCode/subEconomicCode.module';
import {MinistryDivisionComponent} from './features/ministry-division/ministry-division.component';
import {AgencyComponent} from './features/agency/agency.component';
import {ModeOfFinanceComponent} from './features/mode-of-finance/mode-of-finance.component';
import {ListPageComponent} from './features/unit/list-page.component';
import {PriorityComponent} from './features/priority/priority.component';
import {PaSourceComponent} from './features/pa-source/pa-source.component';
import {MainCofogComponent} from './features/main-cofog/main-cofog.component';
import {OptionalCofogComponent} from './features/optional-cofog/optional-cofog.component';
import {DetailsCofogComponent} from './features/details-cofog/details-cofog.component';
import {SectorComponent} from './features/sector/sector.component';
import {SubSectorComponent} from './features/sub-sector/sub-sector.component';
import {SectorDivisionComponent} from './features/sector-division/sector-division.component';
import {ProjectMovementComponent} from './features/project-movement/project-movement.component';
import {UserGroupComponent} from './features/user-group/user-group.component';
import {DepartmentComponent} from './features/department/department.component';

import {SharedModule} from '../../shared/shared.module';

import {CurrencyComponent} from './features/currency/currency.component';
import {CategoryEnvironmentComponent} from "./features/category-environment/category-environment.component";
import {QuestionTypeComponent} from './features/question-type/question-type.component';
import {TaskDetailsComponent} from './features/task-details/task-details.component';
import {ApprovalValueSetupModule} from "./features/approvalValueSetup/approvalValueSetup.module";


@NgModule({
    declarations: [
        MunicipalityComponent,
        ProcurementMethodComponent,
        ProcurementTypeComponent,
        JustificationTypeComponent,
        ScopeTaskTypeComponent,
        ProjectTypeComponent,
        ParipatraVersionComponent,
        ProcurementTypeComponent,
        DivisionComponent,
        ZillaComponent,
        UpazillaComponent,
        MinistryDivisionComponent,
        AgencyComponent,
        ModeOfFinanceComponent,
        PriorityComponent,
        PaSourceComponent,
        SectorComponent,
        SubSectorComponent,
        SectorDivisionComponent,
        ProjectMovementComponent,
        MainCofogComponent,
        OptionalCofogComponent,
        DetailsCofogComponent,
        ListPageComponent,
        UserGroupComponent,
        DepartmentComponent,
        CurrencyComponent,
        CategoryEnvironmentComponent,
        QuestionTypeComponent,
        TaskDetailsComponent
    ],
    imports: [
        SharedModule,
        SettingsRoutingModule,
        ApprovalStatus,
        ApprovalValueSetupModule,
        EconomicCodeModule,
        SubEconomicCodeModule,
    ], providers: [AuthGuard]
})
export class SettingsModule {

}
