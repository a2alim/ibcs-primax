package com.ibcs.idsdp.rpm.web.dto.response.configurationResponse;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FiscalYearResponse extends UuidIdHolderRequestBodyDTO {
    private String fiscalYear;
}
