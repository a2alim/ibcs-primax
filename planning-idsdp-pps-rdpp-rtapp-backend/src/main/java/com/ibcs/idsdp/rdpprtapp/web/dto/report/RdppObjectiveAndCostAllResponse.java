package com.ibcs.idsdp.rdpprtapp.web.dto.report;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppObjectiveCostResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.GrandTotalDifferenceResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.LocationAndCostResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.LogFrameResponse;
import lombok.Data;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Data
public class RdppObjectiveAndCostAllResponse {

    private List<DppAnnualPhasingCostTotalDTO> estimatedCost;

    private List<FiscalYearResponseDto> fiscalYearList;

    private PartAItemWIseCumulativeDto partAItemWIseCumulative;

    private LocationAndCostResponse dppLocation;

    private LocationAndCostResponse rdppLocation;

    private DppObjectiveCostResponse dppObjectAndCost;

    private DppObjectiveCostDTO rdppObjectAndCostCurrentVersion;

    private GrandTotalDifferenceResponse economicCodeWise;

    private ResponseWithResults logFrame;
}
