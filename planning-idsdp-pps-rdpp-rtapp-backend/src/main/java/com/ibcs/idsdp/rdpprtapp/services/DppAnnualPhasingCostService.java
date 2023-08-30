package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnualPhasingCost;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppAnnualPhasingCostWithChildRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DppAnnualPhasingCostService {

    ResponseEntity<IdentityResponse> saveAnnualPhasing(DppAnnualPhasingCostDTO dppAnnualPhasingCostDTO);

    ResponseEntity<List<DppAnnualPhasingCost>> getAnnualPhasing();

    ResponseEntity<DppGrandTotalResponse> getGrandTotalAnnualPhasingById(String conceptId);

    ResponseEntity<List<DppContingencyResponse>> getContingency(String conceptId);

    List<DppAnnualPhasingCost> getAllByPCUuid(String projectConceptUuid);

    DppAnnualPhasingCost getAnnualPhasingCostByPCUuidAndComponentType(String projectConceptUuid, String type);

    ResponseEntity<DppAnnualPhasingCostWithChildResponse> saveWithChild(DppAnnualPhasingCostWithChildRequest dppAnnualPhasingCostWithChildRequest);

    ResponseEntity<DppAnnualPhasingCostWithChildResponse> updateWithChild(DppAnnualPhasingCostWithChildRequest dppAnnualPhasingCostWithChildRequest);

    ResponseEntity<DppAnnualPhasingCostWithChildResponse> getByProjectConceptIdAndComponentName(ProjectConceptIdAndComponentNameRequest request);

    ResponseEntity<List<DppAnnualPhasingCostEconomicCodeWise>> getAllByProjectConceptIdArrangedEconomicCodeWise(Long projectConceptId);

    ResponseEntity<List<FiscalYearResponse>>  getByProjectConceptIdForGettingFiscalYear(Long projectConceptId);

    ResponseEntity<List<GrandTotalResponse>> getGrandTotalByRdppMasterId(Long rdppMasterId);

    ResponseEntity<List<YearWisePhysicalAndFinancialTarget>> getYearWisePhysicalAndFinancialTargetByProjectConceptId(Long conceptId);

    DetailsEstimatedCostResponse getDetailsEstimatedCost(Long id);

    ResponseEntity<GrandTotalDifferenceResponse> getGrandTotalByMasterId(Long rdppMasterId);
    ResponseEntity<List<GrandTotalResponse>> getYearWiseEstimatedCost(String pcUuid);
}
