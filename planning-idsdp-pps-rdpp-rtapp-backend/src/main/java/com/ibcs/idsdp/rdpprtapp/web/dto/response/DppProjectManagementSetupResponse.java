package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppProjectManagementSetupResponse extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String nameOfPost;
    private long quantity;
    private String qualification;
    private String modOfRequirement;
    private long scale_amount;
    private String payGrade;
    private String responsibility;
    private String remarks;
    private String types;

}
