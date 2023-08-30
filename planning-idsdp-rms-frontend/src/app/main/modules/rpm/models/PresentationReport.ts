import { CreateSeminar } from "./CreateSeminar";
import { ResearcherPresentation } from "./ResearcherPresentation";

export class PresentationReport {

    id: number;
    uuid: string;
    createSeminarUuid: string;
    subject: string;
    firstContent: string;
    lastContent: string;
    isEditable: boolean;
    createSeminar: CreateSeminar;
}
