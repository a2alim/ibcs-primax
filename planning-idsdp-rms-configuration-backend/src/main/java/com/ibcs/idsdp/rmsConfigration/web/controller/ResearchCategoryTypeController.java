package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.ResearchCategoryTypeConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.services.ResearchCategoryTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ResearchCategoryTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(ResearchCategoryTypeConstant.RESEARCH_CATEGORY_TYPE)
public class ResearchCategoryTypeController extends BaseController<ResearchCategoryType, ResearchCategoryTypeRequestDto, ResearchCategoryTypeResponseDto> {

	private final ResearchCategoryTypeService researchCategoryTypeService1;

	public ResearchCategoryTypeController(BaseService<ResearchCategoryType, ResearchCategoryTypeRequestDto, ResearchCategoryTypeResponseDto> service, ResearchCategoryTypeService researchCategoryTypeService1) {
		super(service);
		this.researchCategoryTypeService1 = researchCategoryTypeService1;
	}

	@PostMapping(path = ResearchCategoryTypeConstant.CREATE_RESEARCH_CATEGORY_TYPE, produces = "application/json")
	public Response<ResearchCategoryTypeResponseDto> createResearchCategoryType(@RequestBody ResearchCategoryTypeRequestDto researchCategoryTypeRequestDto) {

		return researchCategoryTypeService1.createResearchCategoryType(researchCategoryTypeRequestDto);
	}

	@PutMapping(path = ResearchCategoryTypeConstant.UPDATE_RESEARCH_CATEGORY_TYPE, produces = "application/json")
	public Response<ResearchCategoryTypeResponseDto> updateResearchCategoryType(@RequestBody ResearchCategoryTypeRequestDto researchCategoryTypeRequestDto) {

		return researchCategoryTypeService1.updateResearchCategoryType(researchCategoryTypeRequestDto);
	}

	@GetMapping(path = ResearchCategoryTypeConstant.GET_ACTIVE_LIST, produces = "application/json")
	public Response<ResearchCategoryType> findAllByActiveDatas() {
		return researchCategoryTypeService1.findAllByActive(false, true);
	}
	
	
}
