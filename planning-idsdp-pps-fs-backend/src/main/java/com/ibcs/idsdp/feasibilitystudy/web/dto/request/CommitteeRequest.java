package com.ibcs.idsdp.feasibilitystudy.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import lombok.Data;

@Data
public class CommitteeRequest {

    private PageableRequestBodyDTO pageableRequestBodyDTO;

    private Long fspMasterId;
}