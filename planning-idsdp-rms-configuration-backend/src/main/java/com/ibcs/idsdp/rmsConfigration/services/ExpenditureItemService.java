package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.ExpenditureItem;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpenditureItemRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ExpenditureItemResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ExpenditureItemService {

    Response<ExpenditureItemResponseDto> createExpenditureItem(ExpenditureItemRequestDto expenditureItemRequestDto);

    Response<ExpenditureItemResponseDto> updateExpenditureItem(ExpenditureItemRequestDto expenditureItemRequestDto);

    Response<ExpenditureItem> getActiveExpenditureItem();
    
    Response<ExpenditureItemResponseDto> findByExpenditureName(String itemsName);

    Response<ExpenditureItemResponseDto> findByAdminIdOrCreatedById();
}
