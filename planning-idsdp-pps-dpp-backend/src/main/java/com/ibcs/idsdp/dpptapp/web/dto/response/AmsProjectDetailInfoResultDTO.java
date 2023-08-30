package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class AmsProjectDetailInfoResultDTO {
    private String status;
    private String message;
    private AmsApprovedProjectDetailInfoDTO data;
}
