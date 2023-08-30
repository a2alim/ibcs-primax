package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SubSectorResponse extends UuidHolderRequestBodyDTO {

    private String code;
    private String subSectorCode;
    private String subSectorNameEn;
    private String subSectorNameBn;
    private String description;
    private Boolean status;
    private Long sectorId;
}
