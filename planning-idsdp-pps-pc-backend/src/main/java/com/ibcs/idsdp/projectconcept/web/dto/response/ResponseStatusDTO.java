package com.ibcs.idsdp.projectconcept.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseStatusDTO {
    private String status;
    private String message;
}
