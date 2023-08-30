package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

@Data
public class ResearchFinalSubmissionResponseDto extends UuidIdHolderRequestBodyDTO {

    private Long m1ResearcherProfilePersonalInfoId;
    private Long m1ResearcherProposalId;
    private Date submissionDate;
    private String objectSummary;
    private String introduction;
    private String background;
    private String methodFollowedInTheResearch;
    private String findings;
    private String discussion;
    private String policy;
    private String generalRecommendation;
    private String hashTag;
    private String hashTagBn;
    private String Conclusion;
    private String status;
    private Boolean isFinalSubmit;

}
