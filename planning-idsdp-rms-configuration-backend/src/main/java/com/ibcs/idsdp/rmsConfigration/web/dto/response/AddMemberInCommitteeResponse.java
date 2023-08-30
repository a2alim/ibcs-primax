package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class AddMemberInCommitteeResponse extends UuidIdHolderRequestBodyDTO {
    private Long stFiscalYearId;
    private Long stCommitteeTypeId;
    private Long userId;
    private Integer isChairman;
    private boolean active;
}
