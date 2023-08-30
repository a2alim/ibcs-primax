package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.constants.ExpenditureItemEnum;
import lombok.Data;

@Data
public class ExpenditureItemResponseDto extends UuidIdHolderRequestBodyDTO {
    private String expItemsName;
    private String expItemsFor;
    private Boolean active;
}
