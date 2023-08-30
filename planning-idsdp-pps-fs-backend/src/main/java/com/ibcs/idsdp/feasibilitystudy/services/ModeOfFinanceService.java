package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.model.domain.ModeOfFinance;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ModeOfFianceRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ModeOfFinanceService {
    Page<ModeOfFinanceDTO> getModeOfFinanceByFspMasterId(ModeOfFianceRequest request);

    List<ModeOfFinance> getModeOfFinanceListByFsMasterId(Long id);
}
