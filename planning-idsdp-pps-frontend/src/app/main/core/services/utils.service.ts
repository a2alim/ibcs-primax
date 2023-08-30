import { Injectable, ElementRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {
	constructor() { }

	uploadImageAsBase64(form, files: any, propertyName: string) {
		if (files.length === 0)
			return;
		var mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			let upFileBase64ImgUrl = reader.result;
			let data = form.value[propertyName] ? form.value[propertyName] : '';
			data += '<br><img src="' + upFileBase64ImgUrl + '">';
			form.patchValue({
				[propertyName]: data
			});
		}
	}

}
