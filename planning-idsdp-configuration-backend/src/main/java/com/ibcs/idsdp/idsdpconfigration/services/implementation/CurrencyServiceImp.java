package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Currency;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Division;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.CurrencyRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.DivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.services.*;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.CurrencyRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DivisionRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class CurrencyServiceImp extends BaseService<Currency, CurrencyRequest> implements CurrencyService {

    private final CurrencyRepository currencyRepository;

    public CurrencyServiceImp(CurrencyRepository currencyRepository) {
        super(currencyRepository);
        this.currencyRepository = currencyRepository;
    }


    /**
     * Generate Code Number
     * @param versionNameEn
     * @return
     */
    @Override
    public String generateCodeNumber(String versionNameEn) {
        String versionNumber = versionNameEn.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = currencyRepository.findAll().size() + 1 + "";
        versionNumber = versionNumber + "-" + month + "-" + year + "-" + versionListSize;
        return versionNumber;
    }
}


