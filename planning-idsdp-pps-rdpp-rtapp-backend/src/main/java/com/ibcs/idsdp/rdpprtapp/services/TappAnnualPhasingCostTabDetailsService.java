package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostTabDetailsDTO;

import java.util.List;

public interface TappAnnualPhasingCostTabDetailsService {

    List<TappAnnualPhasingCostTabDetailsDTO> getByTappAnnualPhasingCostId(Long id);

}
