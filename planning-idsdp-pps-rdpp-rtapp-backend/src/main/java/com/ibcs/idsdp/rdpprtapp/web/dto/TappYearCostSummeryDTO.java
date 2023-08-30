package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TappYearCostSummeryDTO extends UuidIdHolderRequestBodyDTO {

    private String indicateIssues;
    private String indicateIssuesNotWork;
    private Long projectSummeryMasterId;;
    private Boolean status;
    private Long tappObjCostId;

}
