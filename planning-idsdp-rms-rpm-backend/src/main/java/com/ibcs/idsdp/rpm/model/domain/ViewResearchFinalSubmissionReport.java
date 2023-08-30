package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Table(name = "view_research_final_submission_report")
@Entity
@Data

public class ViewResearchFinalSubmissionReport {

    /*  from m1_researcher_proposal table  */
    @Id
    private Long id;

    private String uuid;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;

    private Long stFiscalYearId;
    private String fiscalYear;

    private Long stResearchCatTypeId;
    private Long stSectorTypeId;
    private Long stSubSectorsId;

    private String researchTitle;

    @Column(name = "division_id", columnDefinition = "Text")
    private String divisionId;

    @Column(name = "district_id", columnDefinition = "Text")
    private String districtId;

    @Column(name = "upzila_id", columnDefinition = "Text")
    private String upzilaId;

    @Column(name = "division_name", columnDefinition = "Text")
    private String divisionName;

    @Column(name = "district_name", columnDefinition = "Text")
    private String districtName;

    @Column(name = "upzila_name", columnDefinition = "Text")
    private String upzilaName;

    /* --------- from m2_research_final_submission table --------- */
    @Column(name = "m1_researcher_profile_personal_info_id", nullable = false)
    private Long m1ResearcherProfilePersonalInfoId;

    @Column(name = "m1_researcher_proposal_id", nullable = false)
    private Long m1ResearcherProposalId;

    @Column(name = "submission_date", nullable = false)
    private Date submissionDate;

    @Column(name = "object_summary", columnDefinition = "text", nullable = false)
    private String objectSummary;

    @Column(name = "introduction", columnDefinition = "Text", nullable = false)
    private String introduction;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "background", columnDefinition = "Text", nullable = false)
    private String background;

    @Column(name = "method_followed_in_the_research", columnDefinition = "Text", nullable = false)
    private String methodFollowedInTheResearch;

    @Column(name = "findings", columnDefinition = "Text")
    private String findings;

    @Column(name = "discussion", columnDefinition = "Text")
    private String discussion;

    @Column(name = "policy", columnDefinition = "Text")
    private String policy;

    @Column(name = "general_recommendation", columnDefinition = "Text")
    private String generalRecommendation;

    @Column(name = "hash_tag", columnDefinition = "Text")
    private String hashTag;

    @Column(name = "conclusion", columnDefinition = "Text", nullable = false)
    private String conclusion;

    @Column(name = "status")
    private String status;

    @Transient
    private UserResponse userDto;

//    @Transient
//    private SectorTypeResponseDto sectorTypeResponseDto;

    @Transient
    private SubSectorResponseDto subSectorResponseDto;

    @Transient
    private PageableRequestBodyDTO pageableRequestBodyDTO;
}
