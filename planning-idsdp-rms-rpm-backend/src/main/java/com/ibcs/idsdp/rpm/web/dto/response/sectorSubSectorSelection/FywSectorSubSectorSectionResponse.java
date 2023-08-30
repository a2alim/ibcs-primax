package com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection;

import lombok.Data;

@Data
public class FywSectorSubSectorSectionResponse {
    private String uuid;
    private Long stFiscalYearId;
    private Long stSectorTypeId;
    private String stSubSectorId;
    private Boolean isEditable;
}
