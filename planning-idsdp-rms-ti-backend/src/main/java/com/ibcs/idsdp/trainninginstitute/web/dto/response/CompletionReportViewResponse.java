package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;

import javax.persistence.*;

public class CompletionReportViewResponse {

    private String background;

    private String workshopObjectives;

    private String percentageOfAttendance;

    private String onlineAssessment;

    private String remarks;

    private ProposalModel proposalModel;

    private Boolean isFinalSubmitted;

    private Integer noOfSessions;

}
