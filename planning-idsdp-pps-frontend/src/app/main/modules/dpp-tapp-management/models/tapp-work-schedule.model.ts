export class TappWorkScheduleModel {

    id: number;
    uuid: string;
    tappMasterId: number;

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
