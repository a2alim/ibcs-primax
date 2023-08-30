package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.trainninginstitute.enums.Gender;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantRequest {

    private Long proposalId;

    private String name;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String email;

    private String phoneNo;

    private String presentAddress;

    private String permanentAddress;

    private String howYouKnowThisProgram;

    private String facebookOrTwitterLink;

    private String ifOthers;

    private String organizationName;

    private String designation;

    private String organizationAddress;

    private Integer yearsOfExperience;

    private List<AcademicBackgroundRequest> academicBackgroundModels;

    private Long nidNo;

    private MinioAttachment image;

    private MinioAttachment nidImage;

    private Long fiscalYearId;

    private Boolean ifAnyJobInfo;
}
