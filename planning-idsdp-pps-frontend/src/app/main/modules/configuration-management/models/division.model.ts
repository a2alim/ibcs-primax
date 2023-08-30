import {ZillaModel} from './zilla.model';

export class DivisionModel {
    id: number;
    uuid: string;
    nameEn: string;
    nameBn: string;
    description: string;
    geoCode: string;
    status: boolean;
    zillas: ZillaModel[];

}
