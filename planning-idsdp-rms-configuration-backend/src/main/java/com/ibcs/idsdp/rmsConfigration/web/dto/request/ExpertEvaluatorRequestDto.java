package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ExpertEvaluatorRequestDto{
    private String name;
    private String presentProfession;
    private Long userId;
    private String presentOfficeNameAddress;
    private long stSpecialityTypeId;
    private LocalDate dateOfBirth;
    private String mobileNo;
    private String emailAddress;
    private Boolean thesisGroup;
    private Integer totalResearchExpYear;
    private String researchExperienceDetail;
    private String otherExpertAreas;
    private String nidNumber;
    private String tinNumber;
    private Integer evaluatortype;
    private Integer nationalPublicationsNumber;
    private Integer internationalPublicationsNumber;

    private ExpertEvaluatorBySsrcRequestDto expertEvaluatorBySsrc;

    private List<ExpertEvaluatorEducationRequestDto> educations = new ArrayList<>();

    private List<ExpertEvaluatorSectorSubSectorRequestDto> sectorSubSectors;

}
