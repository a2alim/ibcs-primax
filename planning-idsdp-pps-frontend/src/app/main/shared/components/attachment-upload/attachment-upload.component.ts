import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

class FileEntry {
}

@Component({
    selector: 'app-attachment-upload',
    templateUrl: './attachment-upload.component.html',
    styleUrls: ['./attachment-upload.component.scss']
})
export class AttachmentUploadComponent implements OnInit {


    @ViewChild('fileInput', {static: true}) fileInput: any;

    public selectedFiles: FileList;
    public subscription: Subscription;

    @Input() selectedFile: File;
    @Input() labelName: string;

    @Output() file: EventEmitter<File> = new EventEmitter<File>();

    private progress: { percentage: number } = {percentage: 0};

    constructor() {
    }

    ngOnInit(): void {
    }

    onFileSelected(event): void {
        this.selectedFiles = event.target.files;
        if (!this.selectedFiles) {
            return;
        } else if (!this.selectedFiles.length) {
            return;
        } else if (this.selectedFiles.item(0).type !== 'application/pdf') {
            this.selectedFiles = null;
            return;
        } else {
            this.selectedFile = this.selectedFiles.item(0);
            this.file.emit(this.selectedFile);
        }
    }

    private addFile(file: File): void {
        if (file) {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('tag', 'Acc');
            formData.append('title', file.name);
            formData.append('description', 'File Upload For Account');
            formData.append('createdBy', 'Acc');
            // formData.append('oid', this.oid);
            // this.uploadFileAttachment(formData, file);
        }
    }

    // private uploadFileAttachment(formData: FormData, file: File) {
    //     if (formData) {
    //         this._fileCommonService.uploadAttachment(file, formData).subscribe(event => {
    //             if (event.type === HttpEventType.DownloadProgress) {
    //                 this.progress.percentage = Math.round(100 * event.loaded / event.total);
    //             } else if (event instanceof HttpResponse) {
    //                 if (event.status === 200) {
    //                     const fileEntry: FileEntry = {} as FileEntry;
    //                     fileEntry.fileOid = event['body']['data'][0].fileOid;
    //                     fileEntry.fileName = event['body']['data'][0].fileName;
    //                     this.selectedSavedFileList.push({fileEntry: fileEntry, file: file});
    //                     this.saveFileListChanged.emit(this.selectedSavedFileList);
    //                 }
    //             }
    //         });
    //     }
    // }
}
