package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserGroupStatusResponse {
    private String groupStatus;
    private Long userId;

}
