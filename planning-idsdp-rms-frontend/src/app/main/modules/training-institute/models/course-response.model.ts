export class CourseResponse {
    id: number;
    uuid: null;
    isDeleted: boolean;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: null;
    courseTitle: string;
    totalHours: number;
    programDuration: String;
    fiscalYearId: number;
    comment: string;
    courseScheduleModels?: CourseScheduleModel[];
}

export class CourseScheduleModel {
    id: number;
    uuid: null;
    isDeleted: boolean;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: null;
    session: string;
    speakers: number[];
    topic: string;
    date: Date;
    day: string;
    time: string;
}
