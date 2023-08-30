package com.ibcs.idsdp.rpm.web.dto.request.eNothi;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class PagableRequestDto extends UuidIdHolderRequestBodyDTO {
    private Long stFiscalYearId;
    private Long stResearchCategoryTypeId;
    private String dataFor;
    private PageableRequestBodyDTO  pageableRequestBodyDTO;
}
