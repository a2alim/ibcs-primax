package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ProcurementTypeResponse extends UuidHolderRequestBodyDTO {
    private String code;
    private String procurementMethodFor;
    private String nameEn;
    private String namBn;
    private String description;
    private Boolean status;
}
