import {ExpertEvaluatorSubsectorSubField} from "./expert-evaluator-subsector-sub-field";

export class ExpertEvaluatorSectorSubSector{
    id:number
    stSectorTypeId: number;
    stSubSectorsIds: string;
    categoryName: string;
    stSubSectorList: ExpertEvaluatorSubsectorSubField[] = [];
    sector: any;
    subSector: any;
    sectorId: number;
    subSectorIds: number[]=[];
    sectorName: string;
}
