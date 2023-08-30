import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ReportCommonService {


    previewReport(response, formate) {
        let file = new Blob([response], { type: this.printFormat(formate) });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }

    printFormat(formatKey: string) {
        let reportFormatMap = new Map();
        reportFormatMap.set('JPG', 'image/jpg');
        reportFormatMap.set('PNG', 'image/png');
        reportFormatMap.set('JPEG', 'image/jpeg');
        reportFormatMap.set('PDF', 'application/pdf');
        reportFormatMap.set('XLSX', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        reportFormatMap.set('DOCX', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        return reportFormatMap.get(formatKey.toUpperCase());
    }
}
