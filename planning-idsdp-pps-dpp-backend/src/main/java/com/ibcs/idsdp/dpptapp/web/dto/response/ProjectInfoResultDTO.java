package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class ProjectInfoResultDTO {
    private String status;
    private String message;
    private ProjectInfoDTO data;
}
