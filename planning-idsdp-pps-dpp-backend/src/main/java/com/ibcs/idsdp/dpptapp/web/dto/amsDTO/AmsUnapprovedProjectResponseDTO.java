package com.ibcs.idsdp.dpptapp.web.dto.amsDTO;

import lombok.Data;


@Data
public class AmsUnapprovedProjectResponseDTO {
    private String status;
    private String message;
    private AmsResponseDTO data;
}
