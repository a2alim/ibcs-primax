export class ProposalEligibility {

    id: number;
    uuid: string;

    phdRegNo: string; //Fellowship, PHD
    mPhilRegNo: string; //Fellowship, MPHIL
    regYear: Date; //PHD, MPHIL
    researcherExperience: number; //Fellowship

    phd: number; //Institutional
    mphil: number; //Institutional
    masters: number; //Institutional
    infrastructureFacility: number; //Institutional
    empType: 1 | 2 | 0; //Promotional
    age: number; //Promotional
    isGraduate: boolean; //Promotional
    isPhd: boolean; //Promotional
    isMphil: boolean; //Promotional
}
