import { Component, OnInit } from '@angular/core';
import {InstallmentProcessService} from "../../services/installment-process.service";

@Component({
  selector: 'app-tes',
  templateUrl: './tes.component.html',
  styleUrls: ['./tes.component.scss']
})
export class TesComponent implements OnInit {

  constructor(
      private service:InstallmentProcessService
  ) { }

  ngOnInit(): void {
  }

    genPdf() {
        this.service.getPDF().subscribe((response)=>{
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        })

    }
}
