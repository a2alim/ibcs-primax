package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappAnnualPhasingCost;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TappAnnualPhasingCostWithChildRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TappAnnualPhasingCostService {

    ResponseEntity<IdentityResponse> saveAnnualPhasing(TappAnnualPhasingCostDTO tappAnnualPhasingCostDTO);

    ResponseEntity<List<TappAnnualPhasingCost>> getAnnualPhasing();

    ResponseEntity<TappGrandTotalResponse> getGrandTotalAnnualPhasingById(String conceptId);

    ResponseEntity<List<TappContingencyResponse>> getContingency(String conceptId);

    List<TappAnnualPhasingCost> getAllByPCUuid(String projectConceptUuid);

    TappAnnualPhasingCost getAnnualPhasingCostByPCUuidAndComponentType(String projectConceptUuid, String type);

    ResponseEntity<TappAnnualPhasingCostWithChildResponse> saveWithChild(TappAnnualPhasingCostWithChildRequest tappAnnualPhasingCostWithChildRequest);

    ResponseEntity<TappAnnualPhasingCostWithChildResponse> updateWithChild(TappAnnualPhasingCostWithChildRequest tappAnnualPhasingCostWithChildRequest);

    ResponseEntity<TappAnnualPhasingCostWithChildResponse> getByProjectConceptIdAndComponentName(ProjectConceptIdAndComponentNameRequest request);

    ResponseEntity<List<FiscalYearResponse>>  getByProjectConceptIdForGettingFiscalYear(Long projectConceptId);

    ResponseEntity<List<GrandTotalResponseTapp>> getGrandTotalByProjectConceptId(Long projectConceptId);

    DetailsEstimatedCostResponse getDetailsEstimatedCost(Long id);

    ResponseEntity<TappGrandTotalDifferenceResponse> getGrandTotalByMasterId(Long rtappMasterId);

    ResponseEntity<List<GrandTotalResponseTapp>> getYearWiseEstimatedCost(String pcUuid);

}
