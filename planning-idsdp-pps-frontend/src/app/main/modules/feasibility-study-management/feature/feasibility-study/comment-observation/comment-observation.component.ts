import {Component, Inject, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {SnackbarHelper} from '../../../../../core/helper/snackbar.helper';
import {locale as lngEnglish} from '../../../../feasibility-study-management/feature/feasibility-study/comment-observation/i18n/en';
import {locale as lngBangla} from '../../../../feasibility-study-management/feature/feasibility-study/comment-observation/i18n/bn';
import {IComments} from '../../../models/comments';
import {CommentsService} from '../../../services/comments.service';

@Component({
  selector: 'app-comment-observation',
  templateUrl: './comment-observation.component.html',
  styleUrls: ['./comment-observation.component.scss']
})
export class CommentObservationComponent extends UnsubscribeAdapterComponent implements OnInit {

    observer: string;
    comments: IComments[] = [];
    form: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) data: any,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: CommentsService,
                private snackbarHelper: SnackbarHelper) {
        super();
        this.observer = (data === 'A') ? 'Agency' : (data === 'MD') ? 'Ministry Division' : '';
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.populateForm();
        this.getComments();
    }

    private populateForm() {
        this.form = new FormGroup({
            fspMasterId: new FormControl(1, [Validators.required]),
            comment: new FormControl('', [Validators.required]),
            observer: new FormControl(this.observer, [Validators.required]),
        });
    }

    private getComments() {
        this.subscribe$.add(
            this.service.getCommentsByObserver(this.observer).subscribe(res => {
                this.comments = res;
                this.form.patchValue({comment: ''});
            })
        );
    }

    save() {
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if (res){
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getComments();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }

}
