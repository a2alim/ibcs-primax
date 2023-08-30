package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.CurrencyConstant;
import com.ibcs.idsdp.idsdpconfigration.constants.DivisionConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Currency;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Division;
import com.ibcs.idsdp.idsdpconfigration.services.CurrencyService;
import com.ibcs.idsdp.idsdpconfigration.services.DivisionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.CurrencyRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DivisionRequest;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(CurrencyConstant.CURRENCY)
public class CurrencyController extends BaseController<Currency, CurrencyRequest> {

    private final CurrencyService currencyService;

    public CurrencyController(BaseService<Currency, CurrencyRequest> baseService, CurrencyService currencyService) {
        super(baseService);
        this.currencyService = currencyService;
    }


    /**
     * For create Currency
     * @param currencyRequest
     * @return
     */
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public CurrencyRequest create(@RequestBody CurrencyRequest currencyRequest) {
        currencyRequest.setGeneratedCode(currencyService.generateCodeNumber(currencyRequest.getNameEn()));
        return super.create(currencyRequest);
    }
}
