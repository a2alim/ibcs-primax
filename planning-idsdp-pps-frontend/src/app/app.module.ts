import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExtraOptions, PreloadAllModules, RouterModule} from '@angular/router';
import {MarkdownModule} from 'ngx-markdown';
import {FuseModule} from '@fuse';
import {FuseConfigModule} from '@fuse/services/config';
import {FuseMockApiModule} from '@fuse/lib/mock-api';
import {mockApiServices} from 'app/mock-api';
import {LayoutModule} from 'app/layout/layout.module';
import {AppComponent} from 'app/app.component';
import {appRoutes} from 'app/app.routing';
import {SharedModule} from './main/shared/shared.module';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule} from '@angular/material-moment-adapter';
import {CoreModule} from './main/core/core.module';
import {appConfig} from './main/core/config/app.config';
import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DatePipe} from "@angular/common";
import {FlexLayoutModule} from '@angular/flex-layout';

const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules,//CustomPreloadingStrategy
    relativeLinkResolution: 'legacy'
};


// AoT requires an exported function for factories
// tslint:disable-next-line:typedef
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        TranslateModule.forRoot(),

        // Layout
        LayoutModule,
        FlexLayoutModule,

        // Fuse & Fuse Mock API
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        
        // Translator
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),

        // Core and share module
        CoreModule,
        SharedModule,

        // 3rd party modules
        MarkdownModule.forRoot({}),

        // PPS Modules
        //  ProjectConceptManagementModule,
        //  FeasibilityStudyManagementModule,

        // Dpp TAPP
        //  DppTappManagementModule,
        // RdppRtappManagementModule,
        //   ProjectManagementModule,

        // Query Management
        // QueryManagementModule,

        //Report Manageent
        //  ReportsManagementModule,

        //Configuration Management Module
        //SettingsModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [DatePipe,
        {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
    ]
})
export class AppModule {
}
