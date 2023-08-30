package com.ibcs.idsdp.projectconcept.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import lombok.Data;

@Data
public class ModeOfFianceRequest {
    private PageableRequestBodyDTO pageableRequestBodyDTO;
    private Long projectConceptMasterId;
}
