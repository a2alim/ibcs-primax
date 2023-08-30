package com.ibcs.idsdp.projectconcept.web.dto;

import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptMaster;
import com.ibcs.idsdp.projectconcept.web.dto.response.DppObjectiveCost;
import com.ibcs.idsdp.projectconcept.web.dto.response.DppObjectiveCostDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.TappObjectiveCost;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@ToString
public class AgencyDashboardDTO {

    private int totalProjects;

    private int approvedProjects;
    private int runningProject;
    private int sendToMinistryDivision;
    private int sendToPlanningCommission;
    private int ecnecProjects;

    private int pecMeetingHeld;
    private int dppNotPrepared;
    private int dppPrepared;
    private int pscMeetingHeld;
    private int dppAtPC;

    private int rtapp;
    private int rdpp;
    private int dpp;
    private int tapp;
    private int fsComplete;
    private int fsNotComplete;

    List<ProjectConceptMasterDTO> fsCompleteProjectList;
    List<ProjectConceptMasterDTO> fsNotCompleteProjectList;

    private int totalFs;

    Set<Long> ids;

    List<Long> pecProjectIds = new ArrayList<>();
    List<Long> pscProjectIds = new ArrayList<>();
    List<Long> atPCProjectIds = new ArrayList<>();
    List<Long> preparedIds = new ArrayList<>();
    List<Long> notPreparedIds = new ArrayList<>();

    List<ProjectConceptMaster> pecProjectList = new ArrayList<>();
    List<ProjectConceptMaster> pscProjectList = new ArrayList<>();
    List<ProjectConceptMaster> atPCProjectList = new ArrayList<>();
    List<ProjectConceptMaster> preparedProjectList = new ArrayList<>();
    List<ProjectConceptMaster> notPreparedProjectList = new ArrayList<>();

    List<DppObjectiveCost> rdppApprovedProjectList = new ArrayList<>();
    List<DppObjectiveCost> rdppNotApprovedProjectList = new ArrayList<>();
    List<TappObjectiveCost> rtappApprovedProjectList = new ArrayList<>();
    List<TappObjectiveCost> rtappNotApprovedProjectList = new ArrayList<>();
}
