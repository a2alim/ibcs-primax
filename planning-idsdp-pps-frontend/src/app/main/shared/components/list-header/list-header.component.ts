import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-list-header',
    templateUrl: './list-header.component.html',
    styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit {

    @Input() title?: string;
    @Input() subTitle?: string;

    constructor() {
    }

    ngOnInit(): void {
    }

}
