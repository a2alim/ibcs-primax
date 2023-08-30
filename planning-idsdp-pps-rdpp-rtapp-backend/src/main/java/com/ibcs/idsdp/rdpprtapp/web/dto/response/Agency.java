package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class Agency extends UuidIdHolderRequestBodyDTO {

    private MinistryDivision ministryDivision;

    private String code;

    private String entryCode;

    private String nameEn;

    private String nameBn;

    private String shortName;

    private String description;

    private Boolean status;
}
