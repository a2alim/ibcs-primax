import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
    closeEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    otpPayload: any = new Array<{
        status: boolean,
        car1: string,
        car2: string,
        car3: string,
        car4: string,
        cl: boolean,
        rs: boolean;
    }>();

    otp1: any;
    otp2: any;
    otp3: any;
    otp4: any;

    timerOn: boolean = true;
    resendOtp: boolean = false;

    ngOnInit(): void {

        this.timer(120);
    }

    confirm(value: boolean, cl: boolean): void {
        this.otpPayload.push({
            status: value,
            car1: this.otp1,
            car2: this.otp2,
            car3: this.otp3,
            car4: this.otp4,
            cl: cl,
            rs: false,
        });
        this.closeEventEmitter.emit(this.otpPayload);
        this.otpPayload = [];
    }

    // tslint:disable-next-line:typedef
    timer(remaining) {
        let m: string | number = Math.floor(remaining / 60);
        let s: string | number = remaining % 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;

        document.getElementById('countdown').innerHTML = `Time left: ${m} : ${s}`;
        remaining -= 1;
        if (remaining >= 0 && this.timerOn) {

            setTimeout(() => {
                this.timer(remaining);
            }, 1000);

            this.resendOtp = false;
            return;
        }

        if (!this.timerOn) {
            return;
        }
        this.resendOtp = true;
        this.otp1 = '';
        this.otp2 = '';
        this.otp3 = '';
        this.otp4 = '';
    }

    // tslint:disable-next-line:typedef
    reSend(data: number) {

        this.otpPayload.push({
            status: false,
            car1: this.otp1,
            car2: this.otp2,
            car3: this.otp3,
            car4: this.otp4,
            cl: false,
            rs: true,
        });
        this.closeEventEmitter.emit(this.otpPayload);

        this.timer(data);
        this.otpPayload = [];
    }

    // tslint:disable-next-line:typedef
    focus($event: KeyboardEvent) {
        alert(KeyboardEvent);

    }
}
