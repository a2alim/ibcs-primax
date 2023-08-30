export class FinancialAnalysis{
    lifeTime:number;
    discountingFactor1:number;
    discountingFactor2:number;
    data:CostingData[];
    npv:number;
    bcr:number;
    irr:number;
}

export class CostingData{
    investment:number;
    maintenance:number;
}