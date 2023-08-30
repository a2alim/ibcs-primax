package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApprovalStatusResponse extends UuidHolderRequestBodyDTO {

    private String id;
    private String code;
    private String approvalStatusName;
    private String approvalStatusNameBng;
    private String description;
    private Boolean status;
}
