import {ZillaModel} from './zilla.model';
import {MunicipalityModel} from './municipality.model';

export class UpazillaModel {
    id: number;
    uuid: string;
    nameEn: string;
    nameBn: string;
    description: string;
    geoCode: string;
    zillaId: number;
    status: boolean;
    zilla: ZillaModel;
    municipalitys: MunicipalityModel[];

}
