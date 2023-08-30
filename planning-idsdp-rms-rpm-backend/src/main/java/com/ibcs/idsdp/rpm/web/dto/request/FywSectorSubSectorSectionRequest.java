package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FywSectorSubSectorSectionRequest extends UuidIdHolderRequestBodyDTO {
    private Long stFiscalYearId;
    private Long stSectorTypeId;
    private String stSubSectorId;
    private Boolean isEditable;
}
