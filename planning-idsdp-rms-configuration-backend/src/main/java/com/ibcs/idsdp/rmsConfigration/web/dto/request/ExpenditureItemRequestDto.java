package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.constants.ExpenditureItemEnum;
import lombok.Data;

@Data
public class ExpenditureItemRequestDto extends UuidIdHolderRequestBodyDTO {

    private String expItemsName;
    private String expItemsFor;
    private Boolean addByAdmin;
    private Boolean active;
}
