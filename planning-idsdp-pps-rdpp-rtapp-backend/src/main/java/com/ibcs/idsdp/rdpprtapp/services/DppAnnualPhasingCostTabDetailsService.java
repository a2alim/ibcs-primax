package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTabDetailsDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DppAnnualPhasingCostTabDetailsService {

    List<DppAnnualPhasingCostTabDetailsDTO> getByDppAnnualPhasingCostId(Long id);

    ResponseEntity<List<DppAnnualPhasingCostTabDetailsDTO>> getByProjectConceptIdAndIsMajor(Long pcId, Boolean isMajor);


}
