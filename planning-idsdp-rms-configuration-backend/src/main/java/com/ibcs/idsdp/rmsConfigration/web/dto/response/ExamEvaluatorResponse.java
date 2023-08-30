package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ExamEvaluatorResponse extends UuidIdHolderRequestBodyDTO {
    private String name ;
    private Long userId;
    private String presentProfession ;
    private Long speciality;
    private String presentOfficeName ;
    private LocalDate dateOfBirth;
    private String mobileNo;
    private String emailAddress;
    private Boolean thesisGroup;
    private Integer totalResearchExpYear;
    private String researchExperienceDetail;
    private String otherExpertAreas;
    private String nidNumber;
    private String tinNumber;
    private String fileName;
    private Boolean isVarified;
    private Long varifiedBy;
    private Boolean active;
    private Boolean isDeleted;


    private List<ExpertEvaluatorEducationResponseDto> educations;
}
