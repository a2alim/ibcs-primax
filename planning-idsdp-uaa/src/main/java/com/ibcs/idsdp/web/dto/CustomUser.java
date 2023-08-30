package com.ibcs.idsdp.web.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.userdetails.User;

import java.util.Set;

@Setter
@Getter
public class CustomUser extends User {

    private String id;
    private String name;
    private Set<String> appAccess;

    public CustomUser(UserDto userDto) {
        super(userDto.getEmailId(), userDto.getPassword(), userDto.getGrantedAuthoritiesList());
        this.id = String.valueOf(userDto.getId());
        this.name = userDto.getName();
        this.appAccess=userDto.getAppAccess();
    }


}
