package com.ibcs.idsdp.rdpprtapp.web.dto.report;

import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppObjectiveCostResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class DppResponse<d> {
    private Integer status;
    private String message;
    private DppObjectiveCostResponse res;
}
