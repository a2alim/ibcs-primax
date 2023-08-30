package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class SpimsProjectDetailInfoResultDTO {
    private String status;
    private String message;
    private SpimsApprovedProjectDetailInfoDTO data;
}
