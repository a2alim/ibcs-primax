package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

@Data
public class ChangePasswordRequestDto {

    private Long id;

    private String newPassword;

    private String oldPassword;

}
