package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SectorRequest extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String sectorCode;
    private String sectorNameEn;
    private String sectorNameBn;
    private String description;
    private Boolean status;
    private Long sectorDivisionId;
}
