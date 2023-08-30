package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class AgencyDashboardDTO extends UuidIdHolderRequestBodyDTO {

    private Long totalProjects;

    private Long approvedProjects;
    private Long runningProject;
    private Long sendToMinistryDivision;
    private Long sendToPlanningCommission;

    private Long rtapp;
    private Long rdpp;
    private Long dpp;
    private Long tapp;
    private Long fsComplete;
    private Long fsNotComplete;

    private Long totalFs;

    List<Long> ids;
}
