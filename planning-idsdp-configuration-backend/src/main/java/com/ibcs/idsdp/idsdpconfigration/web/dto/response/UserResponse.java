package com.ibcs.idsdp.idsdpconfigration.web.dto.response;



import com.ibcs.idsdp.idsdpconfigration.enums.UserGroup;
import com.ibcs.idsdp.idsdpconfigration.enums.UserType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class UserResponse {

    private Long id;

    private String userId;

    private String name;

    private String emailId;

    private String designation;

    private String mobileNumber;

    private Boolean isActive;


    private UserGroup userGroupId;

    private UserType dutyTypeId;
}
