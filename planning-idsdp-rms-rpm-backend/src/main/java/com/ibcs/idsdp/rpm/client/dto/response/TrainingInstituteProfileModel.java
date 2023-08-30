package com.ibcs.idsdp.rpm.client.dto.response;

import java.util.Date;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
public class TrainingInstituteProfileModel extends BaseEntity{

    private String userId;

    private String userType;   

    private String designation;   

    private Date dateOfBirth;
    
    private String trainingInstituteName;

    private String headOfInstituteName;

    private String mobileNumber;
    
    private String email;

    private String permanentAddress;

    private String nidNo;

    private String presentAddress;

    private Boolean audioVisual;
    private Boolean trainingRoom;
    private Boolean supportingStaff;

//    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
//    private MinioAttachment profileImage;

//    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
//    private MinioAttachment signImage;
}
