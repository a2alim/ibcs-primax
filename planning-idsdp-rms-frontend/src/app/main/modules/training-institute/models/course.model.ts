import {CourseScheduleModel} from "./course-schedule.model";

export class CourseModel {
    id: number;
    comment:         string;
    courseSchedules: CourseScheduleModel[];
    // courseTitle:     string;
    fiscalYearId:    number;
    totalHours: number;
    programDuration: String;
    proposalId: number;
}

