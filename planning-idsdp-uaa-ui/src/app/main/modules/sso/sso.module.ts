import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SsoRouting} from './sso.routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {authSignOutRoutes} from "../auth/features/sign-out/sign-out.routing";
import {SsoComponent} from "./sso.component";


@NgModule({
    declarations: [SsoComponent],
    imports: [
        CommonModule,
        BrowserModule,
        SsoRouting,
        RouterModule.forChild(authSignOutRoutes)
    ]
})
export class SsoModule {
}
