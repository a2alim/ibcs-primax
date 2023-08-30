package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SectorDivisionRequest extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String sectorDivisionCode;
    private String sectorDivisionNameEn;
    private String sectorDivisionNameBn;
    private String description;
    private Boolean status;
}
