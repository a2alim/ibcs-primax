package com.ibcs.idsdp.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegistrationTIRequest {
    private String trainingInstituteName;

    private String headOfInstitute;

    private String designation;

    private String mobile;

    private String dateOfBirth;

    private String email;

    private String password;

    private String userType;

}
