package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.MainFeaturesRevisionDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappObjectiveCostDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface TappObjectiveCostService {

    ResponseWithResults createObjectiveCost(TappObjectiveCostDTO tappObjectiveCostDTO);

    ResponseWithResults updateObjectiveCost(TappObjectiveCostDTO tappObjectiveCostDTO);

    ResponseWithResults getByPcUuid(Long id);

    ResponseEntity<ResponseStatus> deleteRow(String pcUuid);


    List<TappObjectiveCostDTO> getObjectiveCostList();

    TappObjectiveCostDTO getObjectiveCostByPcUuid(String pcUuid, Long id);

    Page<TappObjectiveCostDTO> getRtappList(PageableRequestBodyDTO pageableRequestBodyDTO);

    String checkCurrentVersion(Long id);

    Optional<TappObjectiveCost> findById(Long id);

    Optional<TappObjectiveCost> findByReferenceId(Long referenceId);

    Optional<TappObjectiveCost> findByReferenceIdAndAgencyId(Long referenceId, Long agencyId);

    Optional<TappObjectiveCost> findByProjectConceptId(Long projectConceptId);

    TappObjectiveCostDTO getByReferenceUuid(String referenceUuid);

    ResponseWithResults getObjectiveCostByUuid(String uuid);

    TappObjectiveCostDTO getByRtappMasterId(Long rtappMasterId);

    String getCumulativeDate(Long rtappMasterId, String pcUuid);

    List<DppAnnualPhasingCostTotalDTO> getEstimatedCost(String pcUuid);

    TappObjectiveCostDTO updateMainFeaturesRevision(MainFeaturesRevisionDTO request);
}
