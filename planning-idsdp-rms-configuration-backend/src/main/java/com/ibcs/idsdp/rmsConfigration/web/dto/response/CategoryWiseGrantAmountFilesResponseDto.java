package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmountFiles;
import lombok.Data;

import java.util.List;

@Data
public class CategoryWiseGrantAmountFilesResponseDto extends UuidIdHolderRequestBodyDTO {
    private String fileName;
    //private Long categoryWiseGrantAmountId;
    private Boolean active;
}
