import {GreenPageMinistryModel} from "./green-page-ministry.model";
import {GreenPageAgencyModel} from "./green-page-agency.model";

export class GreenPageModel {
    _project_id: number;
    _fiscal_year_name: string;
    project_title: string;
    project_tiltle_bn: string;
    project_type: number;
    projectTypeId: number;
    projectType: string;
    project_code: string;
    priority_id: number;
    objectives: string;
    objectives_bn: string;
    isOnlyGob: string;
    total: number;
    gob: number;
    pa: number;
    own_fund: number;
    other: number;
    date_of_commencement: Date;
    date_of_completion: Date;
    is_foreign_aid: number;

    ministry: GreenPageMinistryModel;
    agency: GreenPageAgencyModel;
}
