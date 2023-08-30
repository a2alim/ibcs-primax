import { Route } from '@angular/compiler/src/core';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { EducationInfoFormModel } from 'app/main/modules/rpm/models/EducationInfoFormModel';
import { SignatureUploadModel } from 'app/main/modules/rpm/models/SignatureUploadModel';
import { AgreementWithResearcherServiceService } from 'app/main/modules/rpm/services/agreement-with-researcher-service.service';
import {ToastrService} from 'ngx-toastr';
@Component({
    selector: 'app-agreement-upload-signature-files',
    templateUrl: './agreement-upload-signature-files.component.html',
    styleUrls: ['./agreement-upload-signature-files.component.scss']
})
export class AgreementUploadSignatureFilesComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    signatureUploadModelList: SignatureUploadModel[] = new Array();
    signatureList: File[]= new Array();
    id:any;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    constructor( private agreementWithResearcher: AgreementWithResearcherServiceService,
        private _toastrService: ToastrService,
        private _router: Router,
        private activatedRoute: ActivatedRoute,
        ) {
    }

    ngOnInit(): void {
        this.id= this.activatedRoute.snapshot.paramMap.get('id');
        this.intFrom();
    }

    /*
   * Bottom Default Tab Options
   * */

    save(){

        this.agreementWithResearcher.saveTabFiveData(this.signatureUploadModelList, this.signatureList).subscribe(
         res=>{

            if(res.success){
                this._toastrService.success(res.message, "Success!", this.config);
             this.signatureList=[];
             this.previousTab();

            }else{
                console.log("save failed");
            }


         });

        }


        //add one form in init

        intFrom(){
            this.signatureUploadModelList.push(
                {
                    agreementId:this.id,
                    fileTitle:'',
                    isEditable: false
                }
            )
        }

    

    addNewForm() {
        this.signatureUploadModelList.push(
            {
                agreementId:this.id,
                fileTitle:'',
                isEditable: false
            }
        )
        console.log(this.signatureUploadModelList)
    }

    deleteFormByIndex(index: number) {
        this.signatureUploadModelList.splice(index,1)
        //if from deleted also delete it from pushed files
        this.signatureList.splice(index,1)
    }

    handleFileInput(file: FileList,index:number) {
        this.signatureList.push(file.item(0))
        console.log(this.signatureList)
        console.log(index)
    }


    saveAndNext() {
        this.save();
        this.nextTab();
    }
    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this._router.navigate(['/agreement-process']);
    }



}
