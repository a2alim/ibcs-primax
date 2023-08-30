package com.ibcs.idsdp.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LoggedUserDto {
    private String id;
    private String userName;
    private String user_name;
    private String name;
}
