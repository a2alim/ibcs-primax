package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SectorResponse extends UuidHolderRequestBodyDTO {

    private Long id;
    private String code;
    private String sectorCode;
    private String sectorNameEn;
    private String sectorNameBn;
    private String description;
    private Boolean status;
    private Long sectorDivisionId;
}
