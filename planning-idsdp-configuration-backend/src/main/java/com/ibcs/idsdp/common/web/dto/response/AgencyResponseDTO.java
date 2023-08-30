package com.ibcs.idsdp.common.web.dto.response;

import lombok.Data;

@Data

public class AgencyResponseDTO<d> {
    private Long id;
    private String nameEn;
    private String nameBn;
    private Boolean status;
    private Long ministryDivisionId;
    private String code;
}
