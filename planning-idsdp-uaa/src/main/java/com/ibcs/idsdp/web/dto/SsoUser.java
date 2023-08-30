package com.ibcs.idsdp.web.dto;

import com.ibcs.idsdp.model.domain.OfficeInfo;
import com.ibcs.idsdp.model.domain.UserData;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
@Setter
public class SsoUser extends User {
    UserData userData;
    public SsoUser(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

}
