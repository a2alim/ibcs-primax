package com.ibcs.idsdp.web.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;

@Setter
@Getter
public class UserDto {

    private String id;

    private String name;

    private String emailId;

    private String password;

    private String designation;

    private String mobileNumber;

    private Boolean tfa_Enabled;

    private Boolean isActive;

    private Boolean isDelete;

    private Set<String> appAccess;

    private Collection<GrantedAuthority> grantedAuthoritiesList = new ArrayList<>();

    @Override
    public String toString() {
        return "UserDto{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", emailId='" + emailId + '\'' +
                ", password='" + password + '\'' +
                ", designation='" + designation + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", tfa_Enabled=" + tfa_Enabled +
                ", isActive=" + isActive +
                ", isDelete=" + isDelete +
                ", grantedAuthoritiesList=" + grantedAuthoritiesList +
                '}';
    }
}
