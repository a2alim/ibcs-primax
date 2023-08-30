package com.ibcs.idsdp.rmsConfigration.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.CategoryWiseDeskOfficerConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseDeskOfficer;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.services.CategoryWiseDeskOfficerService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CategoryWiseDeskOfficerRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CategoryWiseDeskOfficerResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(CategoryWiseDeskOfficerConstant.CATEGORY_WISE_DESK_OFFICER)
public class CategoryWiseDeskOfficerController extends BaseController<CategoryWiseDeskOfficer, CategoryWiseDeskOfficerRequestDto, CategoryWiseDeskOfficerResponseDto> {

	private final CategoryWiseDeskOfficerService categoryWiseDeskOfficerService;

	public CategoryWiseDeskOfficerController(BaseService<CategoryWiseDeskOfficer, CategoryWiseDeskOfficerRequestDto, CategoryWiseDeskOfficerResponseDto> service,
			CategoryWiseDeskOfficerService categoryWiseDeskOfficerService) {

		super(service);
		this.categoryWiseDeskOfficerService = categoryWiseDeskOfficerService;

	}

	@PostMapping(path = CategoryWiseDeskOfficerConstant.CREATE_CATEGORY_WISE_DESK_OFFICER, produces = "application/json")
	public Response<ResearchCategoryTypeResponseDto> createCategoryWiseDeskOfficer(@RequestBody CategoryWiseDeskOfficerRequestDto categoryWiseDeskOfficerRequestDto) {
		
		
		return categoryWiseDeskOfficerService.createCategoryWiseDeskOfficer(categoryWiseDeskOfficerRequestDto);
	}

	@PutMapping(path = CategoryWiseDeskOfficerConstant.UPDATRE_CATEGORY_WISE_DESK_OFFICER, produces = "application/json")
	public Response<ResearchCategoryTypeResponseDto> updateCategoryWiseDeskOfficer(@RequestBody CategoryWiseDeskOfficerRequestDto categoryWiseDeskOfficerRequestDto) {

		return categoryWiseDeskOfficerService.updateCategoryWiseDeskOfficer(categoryWiseDeskOfficerRequestDto);
	}
	
	@GetMapping(path = CategoryWiseDeskOfficerConstant.GET_ACTIVE_LIST, produces = "application/json")
	public Response<ResearchCategoryType> findAllByActive() {
		return categoryWiseDeskOfficerService.findAllByActive(false,true);
	}

}
