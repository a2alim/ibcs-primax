import {UpazillaModel} from './upazilla.model';

export class MunicipalityModel {
    id: number;
    uuid: string;
    nameEn: string;
    nameBn: string;
    description: string;
    geoCode: string;
    upazilaId: number;
    status: boolean;
    upaZilla: UpazillaModel;

}
