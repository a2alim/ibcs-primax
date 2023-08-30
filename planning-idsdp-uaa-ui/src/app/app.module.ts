import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';

import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { SharedModule } from './main/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CoreModule } from './main/core/core.module';
import { appConfig } from './main/core/config/app.config';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ComponentsNavigationModule } from './main/modules/components-navigation/components-navigation.module';
import { SsoComponent } from './main/modules/sso/sso.component';
import { SsoModule } from './main/modules/sso/sso.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from "@angular/material/input";
import { UserMenuModule } from "./layout/common/user-menu/user-menu.module";
import { UserVerificationComponent } from './main/modules/auth/features/rms/user-verification/user-verification.component';
import { TiSignInComponent } from './main/modules/auth/features/rms-ti/ti-sign-in/ti-sign-in.component';
import { OtpComponent } from './main/modules/auth/features/otp/otp.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';

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
        UserVerificationComponent,
        AppComponent,
        OtpComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        TranslateModule.forRoot(),

        // Fuse & Fuse Mock API
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core
        CoreModule,

        SharedModule,

        ComponentsNavigationModule,
        SsoModule,

        // Material
        MatButtonModule,
        MatIconModule,

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
        FlexLayoutModule,
        MatCardModule,       
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatInputModule,
        UserMenuModule,
        MatDialogModule, 
        MatSelectModule,
        MatTableModule,       
        MatCardModule,
        MatSnackBarModule,
        NativeDateModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatPaginatorModule,
        MatButtonModule,
        MatTableModule,
        MatDatepickerModule,
        MatTooltipModule,
        MatRadioModule,
        MatAutocompleteModule,
        CommonModule,
        MatButtonModule,       
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
        FlexLayoutModule,
        MatCardModule,
        MatRadioModule,
        MatAutocompleteModule,
        TranslateModule,
        TranslateModule.forRoot(),
        FuseCardModule,
        ReactiveFormsModule,
        FormsModule,
        // DragDropModule,
        MatGridListModule,
        MatSelectModule,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
