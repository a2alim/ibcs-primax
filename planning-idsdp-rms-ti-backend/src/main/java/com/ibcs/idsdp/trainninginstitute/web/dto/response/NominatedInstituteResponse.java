package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import java.sql.Date;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.enums.ProposalStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NominatedInstituteResponse {

    private Long id;

    private String uuid;

    private String trainingName;

    private String instituteName;

    private Integer trainingDuration;

    private Date programDate;

    private Long fiscalYearId;

    private boolean isEditable;

    private boolean isSubmitted;

    private String trainingInstituteName;

    private String trainingInstituteNameDetails;

    private ProposalStatus proposalStatus;
    
    private Integer proposalStatusInt;

    private Boolean isShortListed;

    private Boolean isCompletionReportSubmitted; 

    private String headOfInstituteName;

    private String mobileNumber;
    
    private String email;
    
    private String userId;
    
    private Long approvalStatus;    
    
    private PageableRequestBodyDTO pageableRequestBodyDTO;
    
    private Long  profileId;
    
    private Long  proposalId;
    
    private Long completionReportId;
    
    private Boolean isFinalSubmitted;
   
}
