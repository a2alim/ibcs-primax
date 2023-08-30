import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {UserMenuModule} from '../../../layout/common/user-menu/user-menu.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
    declarations: [NavigationComponent],
    imports: [

        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        FlexLayoutModule,
        UserMenuModule,
        MatSnackBarModule
    ]
})
export class ComponentsNavigationModule {
}
