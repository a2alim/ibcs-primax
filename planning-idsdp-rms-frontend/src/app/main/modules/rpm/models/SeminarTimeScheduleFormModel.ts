export class SeminarTimeScheduleFormModel {
    id: number;
    uuid: string;
    seminarId: number = 0;
    proposalId: number = 0;
    startTime: string = '';
    positionInSeminar: string = '';
    scheduleName: string = '';
    concernedPersonUserId: number = 0;
    reviewTime: string;
    mobile: string;
    emailAddress: string;
    designation: string;
    name: string;
}
