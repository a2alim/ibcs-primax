package com.ibcs.idsdp.dpptapp.client.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class MinistryDivisionDTO extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String entryCode;
    private String nameEn;
    private String nameBn;
    private String shortName;
    private String description;
    private boolean status;
}
