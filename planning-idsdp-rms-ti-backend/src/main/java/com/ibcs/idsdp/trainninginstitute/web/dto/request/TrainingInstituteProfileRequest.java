package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.Data;

import java.util.Date;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class TrainingInstituteProfileRequest {

    private String userId;

    private String userType;

    private String trainingInstituteName;

    private String headOfInstituteName;

    private String designation;

    private String mobileNumber;

    private Date dateOfBirth;

    private String email;

    private String permanentAddress;

    private String nidNo;

    private String presentAddress;

    private MinioAttachment profileImage;

    private MinioAttachment signImage;

    private Boolean audioVisual;
    private Boolean trainingRoom;
    private Boolean supportingStaff;
    
   // Telephone number, Bank Name, Account Name, Account number, Routing number 
    
    private String telephoneNumber;
    private String bankName;
    private String accountName;
    private String accountNumber;
    private String routingNumber;
}
