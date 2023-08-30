import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { FuseConfigModule } from '@fuse/services/config';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { LayoutModule } from 'app/layout/layout.module';
import { mockApiServices } from 'app/mock-api';
import { MarkdownModule } from 'ngx-markdown';
import { NgxPrintModule } from "ngx-print";
import { appConfig } from './main/core/config/app.config';
import { CoreModule } from './main/core/core.module';
import { RpmModule } from './main/modules/rpm/rpm.module';
import { SettingsModule } from './main/modules/settings/settings.module';
import { TrainingInstituteModule } from "./main/modules/training-institute/training-institute.module";
import { SharedModule } from './main/shared/shared.module';
import { SubmitBillVoucherNewComponent } from './submit-bill-voucher-new/submit-bill-voucher-new.component';


const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules,
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
        SubmitBillVoucherNewComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        TranslateModule.forRoot(),

        // Fuse & Fuse Mock API
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core
        CoreModule,

        SharedModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,

        // Layout
        LayoutModule,

        // 3rd party modules
        MarkdownModule.forRoot({}),

        // Translator
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),

        // Test Module
        SettingsModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        RpmModule,
        TrainingInstituteModule,
        NgxPrintModule

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
