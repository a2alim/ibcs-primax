package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class IntroductionDTO extends UuidIdHolderRequestBodyDTO {
    private String project_background;
    private String obj_of_fs_study;
    private String approach_methodology_fs_study;
    private String org_fs_study;
    private Long fsrMasterId;
}
