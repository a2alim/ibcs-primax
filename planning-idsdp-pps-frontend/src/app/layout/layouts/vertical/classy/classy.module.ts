import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {FuseNavigationModule} from '@fuse/components/navigation';
import {MessagesModule} from 'app/layout/common/messages/messages.module';
import {NotificationsModule} from 'app/layout/common/notifications/notifications.module';
import {SearchModule} from 'app/layout/common/search/search.module';
import {ShortcutsModule} from 'app/layout/common/shortcuts/shortcuts.module';
import {UserMenuModule} from 'app/layout/common/user-menu/user-menu.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ClassyLayoutComponent} from 'app/layout/layouts/vertical/classy/classy.component';
import {SharedModule} from '../../../../main/shared/shared.module';
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
    declarations: [
        ClassyLayoutComponent
    ],
    imports: [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatButtonToggleModule,
        FuseNavigationModule,
        MessagesModule,
        NotificationsModule,
        SearchModule,
        ShortcutsModule,
        UserMenuModule,
        SharedModule,
        FlexLayoutModule
    ],
    exports     : [
        ClassyLayoutComponent
    ]
})
export class ClassyLayoutModule
{
}
