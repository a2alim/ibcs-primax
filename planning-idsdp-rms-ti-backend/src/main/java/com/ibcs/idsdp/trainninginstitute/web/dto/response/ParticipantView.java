package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.trainninginstitute.enums.Gender;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParticipantView {

    private String courseTitle;

    private Long courseId;

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

    private Long nidNo;

    private List<AcademicBackGroundView> academicBackGroundViews;
    private MinioAttachment image;
    private MinioAttachment nidImage;
}
