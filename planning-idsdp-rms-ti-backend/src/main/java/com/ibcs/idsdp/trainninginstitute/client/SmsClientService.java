package com.ibcs.idsdp.trainninginstitute.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ibcs.idsdp.trainninginstitute.client.dto.response.ExpenditureItemRequestDto;
import com.ibcs.idsdp.trainninginstitute.client.dto.response.SmsDto;
import com.ibcs.idsdp.util.Response;

@FeignClient(value = "planning-idsdp-rms-rpm-backend", url = "http://localhost:8081/rms-rpm/")
public interface SmsClientService {
    @GetMapping(path = "api/sms/send", produces = "application/json")
    Response sendSms(@RequestBody SmsDto smsDto);
    
    
    @PostMapping("expenditure-item/create-expenditure-item-unique")
	@ResponseBody
	Response saveExpenditureItem(@RequestBody ExpenditureItemRequestDto requestBodyDTO);

	@GetMapping( "expenditure-item/find-by-expenditure-items-name/{itemsName}")
	@ResponseBody
	Response findByExpenditureName(@PathVariable String itemsName);
}
