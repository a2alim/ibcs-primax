package com.ibcs.idsdp.trainninginstitute.client;

import com.ibcs.idsdp.trainninginstitute.web.dto.response.FiscalResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ibcs.idsdp.trainninginstitute.client.dto.response.ExpenditureItemRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ExpenditureItemResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;

//@FeignClient(value = "planning-idsdp-rms-configuration-backend", url = "http://localhost:8081/rms-configuration/api/")
@FeignClient(value = "planning-idsdp-rms-configuration-backend", url = "${feign.client.rms-configuration}")
public interface RmsConfigurationClientService {	

	@PostMapping("expenditure-item/create-expenditure-item-unique")
	@ResponseBody
	Response<ExpenditureItemResponseDto> saveExpenditureItem(@RequestBody ExpenditureItemRequestDto requestBodyDTO);

	@GetMapping( "expenditure-item/find-by-expenditure-items-name/{itemsName}")
	@ResponseBody
	Response<ExpenditureItemResponseDto> findByExpenditureName(@PathVariable String itemsName);
	
	
	@GetMapping("template-type/getbyid/{id}")
	public @ResponseBody Response<TemplateTypeResponseDto> getTemplateTypeById(@PathVariable Long id);

	@GetMapping("predefine-template/get-by-template-type-id/{id}")
	public @ResponseBody Response<PredefineTemplateResponseDto> getPredefinedTempalteByTemplateTypeId(@PathVariable Long id);

	@GetMapping("predefine-template/getbyid/{id}")
	public @ResponseBody Response<PredefineTemplateResponseDto> getPredefinedTempalteById(@PathVariable Long id);

	@GetMapping("fiscal-year/get-by-id/{id}")
	@ResponseBody
	Response<FiscalResponseDto> getByFiscalYearId(@PathVariable Long id);
}
