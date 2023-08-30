package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class ProjectDetailInfoResultDTO {
    private String status;
    private String message;
    private ProjectDetailInfoDTO data;
}
