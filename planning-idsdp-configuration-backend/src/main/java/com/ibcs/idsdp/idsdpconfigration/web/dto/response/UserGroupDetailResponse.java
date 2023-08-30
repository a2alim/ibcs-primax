package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserGroupDetailResponse {
    private Long userId;
    private String name;
    private String designation;
    private Long agency;
    private Long ministry;
    private Long sectorDivision;
}
