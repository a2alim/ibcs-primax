package com.ibcs.idsdp.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.ibcs.idsdp.enums.UserGroup;
import com.ibcs.idsdp.enums.UserType;

import javax.persistence.*;

import static com.ibcs.idsdp.constants.TableNameConstants.USER_TABLE_NAME;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = USER_TABLE_NAME)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "ORGATIGATION_Name")
    private String organigationName;

    @Column(name = "NAME")
    private String name;

    @Column(name = "EMAIL_ID", nullable = false, length = 255, unique = true)
    private String emailId;

    @Column(name = "DATE_OF_BIRTH")
    private String dateOfBirth;

    @JsonIgnore
    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "DESIGNATION")
    private String designation;

    @Column(name = "MOBILE_NUMBER", nullable = false, length = 20, unique = true)
    private String mobileNumber;

    @Column(name = "IS_TFA_ENABLE", columnDefinition = "boolean default false")
    private Boolean tfa_Enabled;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "IS_DELETE")
    private Boolean isDelete;

    @Column(name = "USER_TYPE", columnDefinition = "varchar(255) default 'SYSTEM'")
    private String userType;

    @Column(name = "USER_GROUP_ID")
    private UserGroup userGroupId;


    @Column(name = "DUTY_TYPE")
    private UserType dutyType;


    @Column(name = "phone_is_verified", columnDefinition = "boolean default false")
    private Boolean phoneIsVerified;

    @Column(name = "phone_otp")
    private Integer phoneOtp;
    
    @Column(name = "IS_INSTITUTIONAL")
    private Boolean isInstitutional;

}
