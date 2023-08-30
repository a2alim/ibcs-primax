package com.ibcs.idsdp.projectconcept.web.dto.response;

import lombok.Data;


@Data
public class AmsUnapprovedProjectResponseDTO {
    private String status;
    private String message;
    private AmsResponseDTO data;
}
