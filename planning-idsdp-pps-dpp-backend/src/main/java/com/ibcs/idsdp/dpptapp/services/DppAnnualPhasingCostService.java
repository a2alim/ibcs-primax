package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCost;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppAnnualPhasingCostWithChildRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
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

    ResponseEntity<List<GrandTotalResponse>> getGrandTotalByProjectConceptId(Long projectConceptId);

    ResponseEntity<List<YearWisePhysicalAndFinancialTarget>> getYearWisePhysicalAndFinancialTargetByProjectConceptId(Long conceptId);

    DetailsEstimatedCostResponse getDetailsEstimatedCost(String projectConceptUuid);
}
