import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "../../../layout/layout.component";
import {InitialDataResolver} from "../../../app.resolvers";
import {SpeakerEvaluationComponent} from './features/classroom/speaker-evaluation/speaker-evaluation.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            /*----------------- Speaker Evaluation --------------*/
            {path: 'speaker-evaluation', component: SpeakerEvaluationComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpeakerEvaluationRoutingModule {
}
