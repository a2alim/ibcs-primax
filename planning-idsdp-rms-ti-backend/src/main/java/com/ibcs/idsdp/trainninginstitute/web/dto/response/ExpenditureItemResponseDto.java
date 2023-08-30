package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ExpenditureItemResponseDto extends UuidIdHolderRequestBodyDTO {
    private String expItemsName;
    private String expItemsFor;
    private Boolean active;
}
