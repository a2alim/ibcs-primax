import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { Component, OnInit } from '@angular/core';
import { MatStepper } from "@angular/material/stepper";
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { FuseTranslationLoaderService } from "../../../../core/services/translation-loader.service";
import { locale as lngBangla } from "../profiles/i18n/bn";
import { locale as lngEnglish } from "../profiles/i18n/en";

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.scss']
})
export class ProfileTabComponent implements OnInit {

  constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private breakpointObserver: BreakpointObserver,
      private _authService: AuthService
  ) {
      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

      breakpointObserver.observe([
          Breakpoints.XSmall,
          Breakpoints.Small
      ]).subscribe(result => {

          var screenSize = result.matches;
          this.smallScreen = screenSize;
          localStorage.setItem('smallScreen', (screenSize) ? '1' : '0' );
      });
  }

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    smallScreen: boolean;

    profileid:number;
    userType: string = this._authService.getLoggedUserType();

  ngOnInit(): void {
  }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();

    }

    selectionChanged($event: StepperSelectionEvent) {
        if ($event.selectedIndex === 1) {

        }
    }

    goBackToHome() {
        window.history.back();
    }

}
