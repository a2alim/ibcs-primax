package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompletionReportRequest {

    private String background;

    private String workshopObjectives;

    private String percentageOfAttendance;

    private String onlineAssessment;

    private String remarks;

    private Long proposalId;

    private Boolean isFinalSubmitted;
}
