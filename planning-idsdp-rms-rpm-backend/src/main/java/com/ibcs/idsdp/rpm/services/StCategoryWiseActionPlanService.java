package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.StCategoryWiseActionPlan;
import com.ibcs.idsdp.rpm.web.dto.request.StCategoryWiseActionPlanRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.APIResponse;
import com.ibcs.idsdp.rpm.web.dto.response.StCategoryWiseActionPlanResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PathVariable;

public interface StCategoryWiseActionPlanService {

    Response saveActionPlanName(StCategoryWiseActionPlanRequestDto requestDto);

    Response deleteActionPlanName(Long actionPlanId);
    Response<StCategoryWiseActionPlanResponseDto> getActionPlanByCatId(Long stFiscalYearId, Long stResearchCatId);

    Page<StCategoryWiseActionPlan> getAll(int offset, int pageSize);
}
