package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FiscalResponseDto extends UuidIdHolderRequestBodyDTO {
    private String fiscalYear;
}
