import {UpazillaModel} from './upazilla.model';
import {DivisionModel} from './division.model';

export class ZillaModel {
    id: number;
    uuid: string;
    nameEn: string;
    nameBn: string;
    description: string;
    geoCode: string;
    divisionId: number;
    status: boolean;
    division: DivisionModel;
    upaZillas: UpazillaModel[];
}
