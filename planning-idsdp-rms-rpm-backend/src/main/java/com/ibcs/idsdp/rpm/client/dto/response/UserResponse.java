package com.ibcs.idsdp.rpm.client.dto.response;


import lombok.Getter;
import lombok.Setter;

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

    private String userType;

//    private List<Role> roles;
//
//    private UserGroup userGroupId;
//
//    private UserType dutyTypeId;


    /*Added By Rakib For Report*/

    private String divisionDto;
    private String districtDto;
    private String upzilaDto;
    private String preDivisionDto;
    private String preDistrictDto;
    private String preUpzilaDto;
    private String anotherDetails;
    private String preAnotherDetails;
    private String instAddress;
}
