package com.ibcs.idsdp.web.dto.response;

import com.ibcs.idsdp.model.domain.Role;
import lombok.*;

import java.util.List;

@Setter
@Getter
public class NothiUserResponse {
    private Long id;
    private String nothiId;
    private String name;
    private String designation;
    private String section;
    private String mobileNumber;
    private Boolean isActive;
    private Boolean isDelete;
    private List<Role> roles;

    @Override
    public String toString() {
        return "NothiUserResponse{" +
                "id=" + id +
                ", nothiId='" + nothiId + '\'' +
                ", name='" + name + '\'' +
                ", designation='" + designation + '\'' +
                ", section='" + section + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", isActive=" + isActive +
                ", isDelete=" + isDelete +
                ", roles=" + roles +
                '}';
    }
}
