package com.ibcs.idsdp.dpptapp.web.dto.response;


import java.util.List;

import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;

import lombok.Data;

@Data
public class DetailsEstimatedCostResponse {
    private List<EstimatedCostAnnexureDTO> dppAnnualPhasingCostDTOList;
    private DppAnnualPhasingCostTotalDTO grandTotalResponses;
    
    
    //    for report
   	private EstimatedCostAnnexureDTO revenue;
   	private EstimatedCostAnnexureDTO capital;
   	EstimatedCostAnnexureDTO contingency;
   	private Boolean isForeignAid;
}
