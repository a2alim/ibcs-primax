package com.ibcs.idsdp.web.dto.response;


import com.ibcs.idsdp.enums.UserGroup;
import com.ibcs.idsdp.enums.UserType;
import com.ibcs.idsdp.model.domain.Role;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.util.List;

@Setter
@Getter
public class UserResponse {


    private Long id;

    private String userId;

    private String organigationName;

    private String name;

    private String emailId;

    private String dateOfBirth;

    private String designation;

    private String mobileNumber;

    private Boolean tfa_Enabled;

    private Boolean isActive;

    private Boolean isDelete;

    private String userType;

    private UserGroup userGroupId;

    private UserType dutyType;

    private List<Role> roles;

    private Boolean phoneIsVerified;

    private Integer phoneOtp;

    private UserType dutyTypeId;
    private String agencyName;
    private String ministryDivisionName;
}
