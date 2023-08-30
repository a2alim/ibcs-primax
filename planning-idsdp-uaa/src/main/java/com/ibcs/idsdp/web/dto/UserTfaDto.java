package com.ibcs.idsdp.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserTfaDto {

    private Long id;
    private String name;
    private boolean tfa_enabled;

}
