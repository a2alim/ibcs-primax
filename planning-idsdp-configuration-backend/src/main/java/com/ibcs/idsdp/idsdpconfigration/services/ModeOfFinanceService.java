package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ModeFinanceMoveRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ModeOfFinanceService {

    Page<ModeOfFinanceDTO> getActiveModeOfFinance(PageableRequestBodyDTO pageableRequestBodyDTO);

    Page<ModeOfFinanceDTO> getModeOfFinanceByOrderId(PageableRequestBodyDTO pageableRequestBodyDTO);

    void moveModeFinance(ModeFinanceMoveRequest modeFinanceMoveRequest);

    ResponseEntity<List<ModeOfFinanceDTO>> getActiveModeFinData(Boolean status, Boolean isDelete);
}
