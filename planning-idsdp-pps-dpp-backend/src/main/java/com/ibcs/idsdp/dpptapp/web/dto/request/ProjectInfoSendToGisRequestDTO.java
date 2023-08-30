package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectInfoToGisDTO;
import lombok.Data;

@Data
public class ProjectInfoSendToGisRequestDTO {
    private String access_token;
    private String doptor_token;
    private ProjectInfoToGisDTO data;
}
