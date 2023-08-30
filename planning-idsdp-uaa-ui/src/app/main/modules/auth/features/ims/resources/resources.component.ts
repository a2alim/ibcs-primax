import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FaqService} from '../../../services/faq.service';
import {environment} from '../../../../../../../environments/environment';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

    @ViewChild('resourceDetailsModal') resourceDetailsModal: TemplateRef<any>;
    resource: any = {};
    categoryListAll: any [] = [];
    yearListAll: any [] = [];
    monthListAll: any [] = [];
    categoryList: any [] = [];
    yearList: any [] = [];
    monthList: any [] = [];
    resourceList: any [] = [];
    resourceForm: FormGroup;
    fileBaseUrl: string;

    constructor(
      private formBuilder: FormBuilder,
      private faqService: FaqService,
      private _dialog: MatDialog,
    ) { }

  ngOnInit(): void {
      this.fileBaseUrl = environment.ibcs.baseApiEndPoint+'api/';
      this.initForm();
      this.getFilterList();
      this.getList();
  }

  initForm() {
      this.resourceForm = this.formBuilder.group({
          category: [''],
          year: [''],
          month: ['']
      });
  }

  getList() {
      this.faqService.getResourceActiveList().subscribe(res => {
          this.resourceList = res;
      })
  }

    getFilterList() {
        this.faqService.getResourceFilterList().subscribe(res => {
            this.categoryListAll = res.categoryList;
            this.yearListAll = res.yearList;
            this.monthListAll = res.monthList;
            this.categoryList = res.categoryList;
            this.yearList = res.yearList;
            this.monthList = res.monthList;
        })
    }

    submitData() {
      if (this.resourceForm.value.category || this.resourceForm.value.year || this.resourceForm.value.month) {
          this.searchResources()
      } else {
          this.getList();
      }
      // this.resourceForm.value ? this.searchResources() : this.getList();
    }

    searchResources() {
      this.faqService.searchResources(this.resourceForm.value).subscribe(res => {
          this.resourceList = res;
      })
  }

  getYearByCategory(category: string) {
      if (category) {
          this.faqService.getResourceYearListByCategory(category).subscribe(res => {
              this.yearList = res;
          })
      } else {
          this.yearList = this.yearListAll;
      }
      this.submitData();
  }

  getMonthByYear(year: string) {
      if (year) {
          this.faqService.getResourceMonthListByYear(year).subscribe(res => {
              this.monthList = res;
          })
      } else {
          this.monthList = this.monthListAll;
      }
      this.submitData();
  }

    viewAttachment(fileUrl){
        window.open(this.fileBaseUrl+fileUrl);
    }

    openDetailsDialog(resource) {
        this.resource = resource;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '80%';
        dialogConfig.height = 'auto';
        dialogConfig.data = this.resource;

        let modalRef = this._dialog.open(this.resourceDetailsModal, dialogConfig);
    }

}
