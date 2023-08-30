package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import lombok.Data;

@Data
public class NotifyUserRequest {
    private String type;
    private Long agencyId;
    private Long ministryDivisionId;
    private Long sectorDivisionId;

}
