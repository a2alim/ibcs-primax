import { CalFinancialAnalysis } from "./cal-financial-analysis.model";

export class CalFinancialAnalysisParent {

  uuid: string;

  projectConceptMasterId: number;

  projectLifeTime: number;
  discFac1: number;
  discFac2: number;

  discFac1Npv: number = 0;
  discFac1Bcr: number = 0;
  discFac1Irr: number = 0;

  discFac2Npv: number = 0;
  discFac2Bcr: number = 0;
  discFac2Irr: number = 0;

  isSelectDiscFactor1: boolean = false;
  isSelectDiscFactor2: boolean = false;

  calculationType: string;

  financialAnalysisList: CalFinancialAnalysis[] = [];

}