import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProcurementMethodComponent} from './features/procurement-method/procurement-method.component';
import {ProcurementTypeComponent} from './features/procurement-type/procurement-type.component';
import {MunicipalityComponent} from './features/municipality/municipality.component';
import {MinistryDivisionComponent} from './features/ministry-division/ministry-division.component';
import {AgencyComponent} from './features/agency/agency.component';
import {JustificationTypeComponent} from './features/justification-type/justification-type.component';
import {ParipatraVersionComponent} from './features/paripatra-version/paripatra-version.component';
import {ScopeTaskTypeComponent} from './features/scope-task-type/scope-task-type.component';
import {ProjectTypeComponent} from './features/project-type/project-type.component';
import {DivisionComponent} from './features/division/division.component';
import {UpazillaComponent} from './features/upazilla/upazilla.component';
import {ZillaComponent} from './features/zilla/zilla.component';
import {ListPageComponent} from './features/unit/list-page.component';
import {ModeOfFinanceComponent} from './features/mode-of-finance/mode-of-finance.component';
import {MainCofogComponent} from './features/main-cofog/main-cofog.component';
import {OptionalCofogComponent} from './features/optional-cofog/optional-cofog.component';
import {DetailsCofogComponent} from './features/details-cofog/details-cofog.component';
import {ProjectMovementComponent} from './features/project-movement/project-movement.component';
import {SectorDivisionComponent} from './features/sector-division/sector-division.component';
import {SectorComponent} from './features/sector/sector.component';
import {SubSectorComponent} from './features/sub-sector/sub-sector.component';
import {PriorityComponent} from './features/priority/priority.component';
import {PaSourceComponent} from './features/pa-source/pa-source.component';
import {UserGroupComponent} from './features/user-group/user-group.component';
import {DepartmentComponent} from './features/department/department.component';
import {DevelopmentPartnerComponent} from './features/developmentPartnerMaster/development-partner/development-partner.component';
import {CurrencyComponent} from './features/currency/currency.component';
import {CategoryEnvironmentComponent} from "./features/category-environment/category-environment.component";
import {QuestionTypeComponent} from "./features/question-type/question-type.component";


const routes: Routes = [
    {path: 'justification-type', component: JustificationTypeComponent},
    {path: 'department', component: DepartmentComponent},
    {path: 'user-group', component: UserGroupComponent},
    {path: 'project-type', component: ProjectTypeComponent},
    {path: 'scope-task-type', component: ScopeTaskTypeComponent},
    {path: 'paripatra-version', component: ParipatraVersionComponent},
    {path: 'procurement-method', component: ProcurementMethodComponent},
    {path: 'procurement-type', component: ProcurementTypeComponent},
    {path: 'municipality', component: MunicipalityComponent},
    {path: 'ministry-division', component: MinistryDivisionComponent},
    {path: 'agency', component: AgencyComponent},
    {path: 'division', component: DivisionComponent},
    {path: 'zilla', component: ZillaComponent},
    {path: 'upazila', component: UpazillaComponent},
    {path: 'unit', component: ListPageComponent},
    {path: 'mode-of-finance', component: ModeOfFinanceComponent},
    {path: 'main-cofog', component: MainCofogComponent},
    {path: 'optional-cofog', component: OptionalCofogComponent},
    {path: 'details-cofog', component: DetailsCofogComponent},
    {path: 'project-movement', component: ProjectMovementComponent},
    {path: 'sector-division', component: SectorDivisionComponent},
    {path: 'sector', component: SectorComponent},
    {path: 'sub-sector', component: SubSectorComponent},
    {path: 'priority', component: PriorityComponent},
    {path: 'paSource', component: PaSourceComponent},
    {path: 'development', component: DevelopmentPartnerComponent},
    {path: 'currency', component: CurrencyComponent},
    {path: 'category', component: CategoryEnvironmentComponent},
    {path: 'question-type', component: QuestionTypeComponent}
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class SettingsRoutingModule {
}
