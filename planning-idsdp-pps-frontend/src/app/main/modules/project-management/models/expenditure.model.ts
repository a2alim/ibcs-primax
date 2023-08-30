export class ExpenditureModel {

  id: number;  
  dppTappMasterId: number;
  dppTappMasterUuid: string;
  uuid: string;
  economicCode: number;
	economicCodeDescription: string;
	economicSubCode: number;
	expenditureDate: Date;
	remarks: string;
	expenditureAmount: number;
  attachedFile: File;
  attachmentName: string;
  attachment: any;

}