export class PmWorkPlanModel {

    id: number;
    uuid: string;
    dppTappMasterId: number;
    dppTappMasterUuid: string;

    taskDetails: string;
    itemName: string;
    startDate: string;
    endDate: string;
    status: string;

    qtr1: boolean;
    qtr2: boolean;
    qtr3: boolean;
    qtr4: boolean;

}