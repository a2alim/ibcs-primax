package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class PimsProjectDetailInfoResultDTO {
    private String status;
    private String message;
    private PimsApprovedProjectDetailInfoDTO data;
}
