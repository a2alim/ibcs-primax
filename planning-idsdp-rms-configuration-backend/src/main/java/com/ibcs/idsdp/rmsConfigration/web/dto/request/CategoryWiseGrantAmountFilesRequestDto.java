package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmountFiles;
import lombok.Data;

import javax.persistence.Column;
import java.util.List;

@Data
public class CategoryWiseGrantAmountFilesRequestDto extends UuidIdHolderRequestBodyDTO {

    private String fileName;
   // private Long categoryWiseGrantAmountId;
    private Boolean active;
}
