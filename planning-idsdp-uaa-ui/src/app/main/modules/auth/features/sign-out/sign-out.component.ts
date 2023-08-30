import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { environment } from 'environments/environment';
import {Subject, timer} from 'rxjs';
import {finalize, takeUntil, takeWhile, tap} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';


@Component({
    selector     : 'auth-sign-out',
    templateUrl  : './sign-out.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AuthSignOutComponent implements OnInit, OnDestroy
{
    countdown: number = 0;
    countdownMapping: any = {
        '=1'   : '# second',
        'other': '# seconds'
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private activateRoute: ActivatedRoute
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this._authService.signOut();

        // Redirect after the countdown
        timer(0, 0)
            .pipe(
                finalize(() => {
                     // Sign out
                    let type = this.activateRoute.snapshot.paramMap.get('roleType')

                    /*
                    if(type != "" && type == 'researcher'){
                        this._router.navigate(['rms/researcher/sign-in']);
                    }
                    else if(type != "" && type == 'training'){
                        this._router.navigate(['rms/training-institution/sign-in']);
                    }
                    else if(type != "" && type == 'evaluator'){
                        this._router.navigate(['rms/researcher/sign-in']);
                    }
                    else{
                        this._router.navigate(['sign-in']);
                    }
                    */

                    if((type != "" && type == 'researcher') || (type != "" && type == 'training') || (type != "" && type == 'evaluator')){
                        // For Localhost and IBCS Server
                        //this._router.navigate(['rms/researcher/sign-in']); 

                        // For Planning Server
                        window.location.href = environment.ibcs.mainDomainName + '/rms/researcher/sign-in';
                    }
                    else{
                         // For Localhost and IBCS Server
                        this._router.navigate(['sign-in']);
                    }

                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
