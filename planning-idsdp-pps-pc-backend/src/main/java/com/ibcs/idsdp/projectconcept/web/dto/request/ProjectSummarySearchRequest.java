package com.ibcs.idsdp.projectconcept.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import lombok.Data;

@Data
public class ProjectSummarySearchRequest{
    private PageableRequestBodyDTO pageableRequestBodyDTO;
    private Long projectType;
    private Long sectorDivision;
}
