package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class AddMemberInCommitteeRequest extends UuidIdHolderRequestBodyDTO {
    private Long stFiscalYearId;
    private Long stCommitteeTypeId;
    private Long userId;
    private Integer isChairman;
    private boolean active;
}
