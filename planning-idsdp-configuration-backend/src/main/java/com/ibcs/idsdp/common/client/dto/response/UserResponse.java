package com.ibcs.idsdp.common.client.dto.response;



import com.ibcs.idsdp.common.client.enums.UserGroup;
import com.ibcs.idsdp.common.client.enums.UserType;
import lombok.Getter;
import lombok.Setter;

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
}
