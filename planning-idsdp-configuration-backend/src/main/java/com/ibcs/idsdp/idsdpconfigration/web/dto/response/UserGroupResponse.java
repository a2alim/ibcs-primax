package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import lombok.Data;

@Data
public class UserGroupResponse {
    private Long id;
    private Long userId;
    private Long ministry;
    private Long agency;
    private Boolean checked;
    private String ecnec;
    private String planningMinister;
}
