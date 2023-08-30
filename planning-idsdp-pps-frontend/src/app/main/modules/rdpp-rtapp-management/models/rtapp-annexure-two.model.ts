export class ImplementationWorkScheduleModel {

    id: number;
    uuid: string;
    rtappMasterId: number;

    taskDetails: string;
    itemName: string;
    startDate: string;
    endDate: string;
    status: string;
    groupId: number;
    selectedQuarter: string;

    qtr1: boolean;
    qtr2: boolean;
    qtr3: boolean;
    qtr4: boolean;

    fiscalYearList:any[] = [];

}
