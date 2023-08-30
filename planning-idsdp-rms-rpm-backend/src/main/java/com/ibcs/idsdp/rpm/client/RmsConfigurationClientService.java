package com.ibcs.idsdp.rpm.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.request.ExpenditureItemRequestDto;
import com.ibcs.idsdp.rpm.client.dto.response.CommonTypesResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.DivisionResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ExpenditureItemResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ZillaResponse;
import com.ibcs.idsdp.rpm.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.FiscalYearResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.InstallmentTypeResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SectorTypeResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SubSectorResponse;
import com.ibcs.idsdp.util.Response;

//@FeignClient(value = "planning-idsdp-rms-configuration-backend", url = "http://localhost:8081/rms-configuration/api/")
@FeignClient(value = "planning-idsdp-rms-configuration-backend", url = "${feign.client.rms-configuration}")
public interface RmsConfigurationClientService {

	@GetMapping("fiscal-year/get-by-id/{id}")
	@ResponseBody
	Response<FiscalResponseDto> getByFiscalYearId(@PathVariable Long id);

	@PostMapping("fiscal-year/get-by-id-set")
	@ResponseBody
	Response<FiscalResponseDto> getByFiscalYearIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("sector-type/get-by-id/{id}")
	@ResponseBody
	Response<SectorTypeResponseDto> getBySectorTypeId(@PathVariable Long id);

	@PostMapping("sector-type/get-by-id-set")
	@ResponseBody
	Response<SectorTypeResponseDto> getBySectorTypeByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("sub-sector/get-by-id/{id}")
	@ResponseBody
	Response<SubSectorResponseDto> getBySubSectorId(@PathVariable Long id);

	@GetMapping("get-sub-sectors/{subsectorId}}")
	@ResponseBody
	Response<SubSectorResponseDto> getBySectorId(@PathVariable("subsectorId") Long subsectorId);

	@PostMapping("sub-sector/get-by-id-set")
	@ResponseBody
	Response<SubSectorResponseDto> getBySubSectorByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("research-category-type/get-by-id/{id}")
	@ResponseBody
	Response<ResearchCategoryTypeResponseDto> getByResearchCategoryTypeId(@PathVariable Long id);

	@PostMapping("research-category-type/get-by-id-set")
	@ResponseBody
	Response<ResearchCategoryTypeResponseDto> getByResearchCategoryTypeByIdSet(
			@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("expenditure-item/get-by-id/{id}")
	@ResponseBody
	Response<ExpenditureItemResponseDto> getByExpenditureItemId(@PathVariable Long id);

	@PostMapping("expenditure-item/get-by-id-set")
	@ResponseBody
	Response<ExpenditureItemResponseDto> getByExpenditureItemIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("fiscal-year/get-active-list")
	@ResponseBody
	Response<FiscalYearResponse> getActiveFiscalYears();

	@GetMapping("sector-type/get-active-list")
	@ResponseBody
	Response<SectorTypeResponse> getActiveSectorTypes();

	@PostMapping("sector-type/get-by-id-set")
	@ResponseBody
	Response<SectorTypeResponseDto> getBySectorTypeIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("sub-sector/get-active-list")
	@ResponseBody
	Response<SubSectorResponse> getActiveSubSectors();

	@GetMapping("expert-evaluator/get-list/{id}")
	@ResponseBody
	Response<ExpertEvaluatorResponseDto> getByExpertEvaluatorId(@PathVariable Long id);

	@PostMapping("expert-evaluator/get-by-id-set")
	@ResponseBody
	Response<ExpertEvaluatorResponseDto> getByExpertEvaluatorIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("installment-type/get-by-id-set")
	@ResponseBody
	Response<InstallmentTypeResponseDto> getInstallmentType(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("common-type/get-by-id-set")
	@ResponseBody
	Response<CommonTypesResponseDto> getCommonTypeByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("installment-type/get-list")
	@ResponseBody
	Response<InstallmentTypeResponseDto> getAllInstallmentType();

	@GetMapping("division/activeDivision")
	@ResponseBody
	Response<DivisionResponse> getActiveDivision();

	@GetMapping(value = "zilla/find-by-division-id/{divisionId}")
	@ResponseBody
	Response<ZillaResponse> findByDivision(@PathVariable("divisionId") Long divisionId);

	@GetMapping(value = "upazilla/find-by-zilla-id/{zillaId}", produces = "application/json")
	@ResponseBody
	Response<UpaZillaResponse> findByZilla(@PathVariable("zillaId") Long zillaId);

	@GetMapping("division/get-by-id/{id}")
	@ResponseBody
	Response<DivisionResponse> findByDivisionId(@PathVariable("id") Long id);

	@GetMapping(value = "zilla/get-by-id/{id}")
	@ResponseBody
	Response<ZillaResponse> findByZillaId(@PathVariable("id") Long id);

	@GetMapping(value = "upazilla/get-by-id/{id}")
	@ResponseBody
	Response<UpaZillaResponse> findByUpazillaId(@PathVariable("id") Long id);

	@PostMapping("division/get-by-id-set")
	@ResponseBody
	Response<DivisionResponse> findByDivisionIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@PostMapping(value = "zilla/get-by-id-set")
	@ResponseBody
	Response<ZillaResponse> findByZillaIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@PostMapping(value = "upazilla/get-by-id-set")
	@ResponseBody
	Response<UpaZillaResponse> findByUpazillaIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

	@GetMapping("installment-type/getbyid/{id}")
	public @ResponseBody Response<InstallmentTypeResponseDto> getInstallmentTypeById(@PathVariable Long id);

	@GetMapping("fiscal-year/getbyid/{id}")
	public @ResponseBody Response<FiscalYearResponse> getFiscalYearById(@PathVariable Long id);

	@GetMapping("template-type/getbyid/{id}")
	public @ResponseBody Response<TemplateTypeResponseDto> getTemplateTypeById(@PathVariable Long id);

	@GetMapping("predefine-template/get-by-template-type-id/{id}")
	public @ResponseBody Response<PredefineTemplateResponseDto> getPredefinedTempalteByTemplateTypeId(
			@PathVariable Long id);

	@GetMapping("predefine-template/getbyid/{id}")
	public @ResponseBody Response<PredefineTemplateResponseDto> getPredefinedTempalteById(@PathVariable Long id);

	@GetMapping("research-category-type/get-list")
	@ResponseBody
	Response<ResearchCategoryTypeResponseDto> getAllResearchCategory();

	@PostMapping("expenditure-item/create-expenditure-item-unique")
	@ResponseBody
	Response<ExpenditureItemResponseDto> saveExpenditureItem(@RequestBody ExpenditureItemRequestDto requestBodyDTO);

	@GetMapping( "expenditure-item/find-by-expenditure-items-name/{itemsName}")
	@ResponseBody
	Response<ExpenditureItemResponseDto> findByExpenditureName(@PathVariable String itemsName);

	@GetMapping("sub-sector/get-sub-sector-by-id/{id}")
	@ResponseBody
	Response<SubSectorResponseDto> getSubSectorById(@PathVariable Long id);
}
