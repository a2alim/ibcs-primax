package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.model.domain.ExpenditureCost;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ExpenditureCostDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ExpenditureCostRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ExpenditureCostService {
      Page<ExpenditureCostDTO> getExpenditureCostByFspMasterId(ExpenditureCostRequest request);

      List<ExpenditureCost> getByPsMasterId(Long id);
}
