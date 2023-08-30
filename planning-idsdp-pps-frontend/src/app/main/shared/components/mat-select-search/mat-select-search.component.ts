import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ReplaySubject, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {IOption} from '../../model/option';

@Component({
    selector: 'mat-select-search',
    templateUrl: './mat-select-search.component.html',
})

export class MatSelectSearchComponent implements OnInit, OnChanges {

    @Input() formGroup: FormGroup;
    @Input() data: IOption[];
    @Input() isReadonly: boolean;
    @Input() required: boolean;
    @Input() controlName: string;
    @Output() selectionChange = new EventEmitter<any>();


    public matSelectSearch: FormControl = new FormControl();
    protected _onDestroy = new Subject<void>();
    filteredData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    ngOnInit(): void {
        // this.data.forEach(d => {
        //     if (d.nameBn) d.name = d.nameBn;
        // })
        this.filteredData.next(this.data.slice())
        this.matSelectSearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.filterData();
        })
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    private filterData() {
        if (!this.data) return;
        let search = this.matSelectSearch.value;
        if (!search) {
            this.filteredData.next(this.data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredData.next(
            this.data.filter(d => d.name.toString().toLowerCase().includes(search)
                || (d.nameEn && d.nameEn.toString().toLowerCase().includes(search))
                || (d.nameBn && d.nameBn.toString().toLowerCase().includes(search)))
        );
    }

    onSelectionChange(value: any) {
        this.selectionChange.emit(value);
    }

    getValueForSelectionControl(): string | null {
        if (!this.isReadonly) {
            return null;
        }
        const selectedOption = this.data.find(option => option.value === this.formGroup.controls[this.controlName].value);
        return selectedOption && selectedOption.name;
    }

    ngOnChanges(): void {
        // this.data.forEach(d => {
        //     if (d.nameBn) d.name = d.nameBn;
        // })
        this.filteredData.next(this.data?.slice())
        this.matSelectSearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.filterData();
        })
    }

}
