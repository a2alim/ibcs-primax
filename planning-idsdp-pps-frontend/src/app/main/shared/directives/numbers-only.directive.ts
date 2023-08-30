import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[NumbersOnly]'
})
export class NumberDirective {

    constructor(private _el: ElementRef) {
    }

    @HostListener('input', ['$event']) onInputChange(event) {
        if (event.srcElement.type === 'number') {
            const initialValue = this._el.nativeElement.value;
            this._el.nativeElement.value = initialValue.replace(/\D/g, '');
            if (initialValue !== this._el.nativeElement.value) {
                event.stopPropagation();
            }
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.key === '.') {
            event.preventDefault();
        }
    }

}
