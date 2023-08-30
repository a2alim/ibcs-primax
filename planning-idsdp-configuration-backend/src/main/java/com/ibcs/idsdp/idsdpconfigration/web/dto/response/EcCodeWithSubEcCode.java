package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SubEconomicCodeRequest;
import lombok.Data;

import java.util.List;

@Data
public class EcCodeWithSubEcCode {

    private Long economicCodeId;

    private List<SubEconomicCodeRequest> subEconomicCodes;
}
