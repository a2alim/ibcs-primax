import { ElementRef, Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor() {
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    public exportAsPdfFile(_pdfTable: Element, reportName: string): void {
        const options = {
            // margin:       [10, 2, 2, 2],
            // fileName:"test.pdf",
            // image:{type: 'jpeg'},
            // html2canvas: {},
            // jsPDF: {orientation: 'portrait'}

            margin: [30, 0, 30, 0],
            filename: reportName,
            image: { type: 'jpeg', quality: 0.99 },
            html2canvas: { dpi: 300, scale: 1, scrollX: 0, scrollY: 0, backgroundColor: '#FFF' },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'p' },
            pagebreak: { after: '.page-break', avoid: 'img' }

        };

        html2pdf()
            .from(_pdfTable)
            .set(options)
            .save();
    }

}
