package com.ibcs.idsdp.web.dto.response;

import lombok.Data;


@Data
public class UserGroupDTO {
    private Long id;
    private String uuid;
    private Long userId;
    private String planningMinister;
    private String ecnec;
    private Boolean checked;
    private AgencyDTO agency;
    private MinistryDivisionDTO ministryDivision;
//    private SectorDivision sectorDivision;
}
