import {EconomicTypeModel} from './economic-code-model';

export class SubEconomicCodeModel {
    uuid: string;
    code: string;
    economicCodeId: EconomicTypeModel = new EconomicTypeModel();
    oldSubEconomicCodeEn: string;
    oldSubEconomicCodeBn: string;
    subEconomicCode: string;
    subEconomicCodeBng: string;
    subEconomicCodeName: string;
    subEconomicCodeNameBng: string;
    description: string;
    descriptionBn: string;
    status: boolean;
    id: number;
}

