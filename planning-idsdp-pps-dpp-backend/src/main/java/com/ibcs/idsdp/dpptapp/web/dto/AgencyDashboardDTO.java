package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
public class AgencyDashboardDTO {

    private Long totalProjects;

    private Long approvedProjects;
    private Long runningProject;
    private Long sendToMinistryDivision;
    private Long sendToPlanningCommission;
    private Long ecnecProjects;

    private Long pecMeetingHeld;
    private Long dppNotPrepared;
    private Long dppPrepared;
    private Long pscMeetingHeld;
    private Long dppAtPC;

    private Long rtapp;
    private Long rdpp;
    private Long dpp;
    private Long tapp;
    private Long fsComplete;
    private Long fsNotComplete;

    private Long totalFs;

    Set<Long> ids;

    List<Long> pecProjectIds = new ArrayList<>();
    List<Long> pscProjectIds = new ArrayList<>();
    List<Long> atPCProjectIds = new ArrayList<>();
    List<Long> preparedIds = new ArrayList<>();
    List<Long> notPreparedIds = new ArrayList<>();
}
