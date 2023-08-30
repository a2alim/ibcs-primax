package com.ibcs.idsdp.web.dto;

import com.ibcs.idsdp.web.dto.request.IUuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class HelpDTO implements IUuidIdHolderRequestBodyDTO {
    private Long id;
    private String uuid;
    private String firstName;
    private String lastName;
    private String email;
    private String message;
    private String additionalDetails;
}
