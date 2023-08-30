package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTabDetailsDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DppAnnualPhasingCostTabDetailsService {

    List<DppAnnualPhasingCostTabDetailsDTO> getByDppAnnualPhasingCostId(Long id);

    ResponseEntity<List<DppAnnualPhasingCostTabDetailsDTO>> getByProjectConceptIdAndIsBasisOrIsMajor(Long pcId, Boolean isBasis, Boolean isMajor);


}
