package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppProjectManagementSetupRequest{


    private String projectConceptUuid;
    private String projectConceptid;
    private String nameOfThePost;
    private Double quantity;
    private String qualification;
    private String modeOfRecruitment;
    private String scale_amount;
    private String payGrade;
    private String responsibility;
    private String remarks;
    private String types;
    private Boolean status;

}
