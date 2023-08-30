package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AssignEcnecMeetingListResponse extends UuidHolderRequestBodyDTO {

    private boolean isForeignAid;
    private String projectType;
    private String projectTitle;
    private String ministryDivision;
    private String implementingAgency;
    private String objectivesTargets;
    private Long concernedDivisionId;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private double totalAmount;
    private double gobAmount;
    private double gobFeAmount;
    private double paAmount;
    private double rpaAmount;
    private double ownFundAmount;
    private double ownFeFundAmount;
    private double otherAmount;
    private double otherFeAmount;
}
