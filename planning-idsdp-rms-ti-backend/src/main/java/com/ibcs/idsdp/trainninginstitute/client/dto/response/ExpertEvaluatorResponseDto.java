package com.ibcs.idsdp.trainninginstitute.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpertEvaluatorResponseDto  extends UuidIdHolderRequestBodyDTO {

    private String name;
    
    private Long userId;

    private String presentProfession;


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
    
    private UserResponse user;
}
