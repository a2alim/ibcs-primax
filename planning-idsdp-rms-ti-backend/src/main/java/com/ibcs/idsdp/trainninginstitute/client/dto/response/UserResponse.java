package com.ibcs.idsdp.trainninginstitute.client.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 12/2/21
 * @github `https://github.com/moniruzzamanrony`
 */

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

    private UserType dutyTypeId;
}
