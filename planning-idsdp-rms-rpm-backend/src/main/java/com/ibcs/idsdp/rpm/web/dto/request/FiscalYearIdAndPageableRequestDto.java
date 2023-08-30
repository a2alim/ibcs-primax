package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import lombok.Data;

@Data
public class FiscalYearIdAndPageableRequestDto {

    private Long fiscalYearId;

    private PageableRequestBodyDTO pageable;
}
