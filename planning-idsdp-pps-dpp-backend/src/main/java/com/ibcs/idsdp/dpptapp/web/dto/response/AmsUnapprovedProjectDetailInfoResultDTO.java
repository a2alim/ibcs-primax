package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class AmsUnapprovedProjectDetailInfoResultDTO {
    private String status;
    private String message;
    private AmsUnapprovedProjectDetailInfoDTO data;
}
