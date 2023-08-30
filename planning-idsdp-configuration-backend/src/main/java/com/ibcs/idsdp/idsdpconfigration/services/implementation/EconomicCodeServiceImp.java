package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.constants.EconomicCodeFor;
import com.ibcs.idsdp.idsdpconfigration.model.domain.EconomicCode;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.EconomicCodeRepository;
import com.ibcs.idsdp.idsdpconfigration.services.EconomicCodeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.EconomicCodeRequest;
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
public class EconomicCodeServiceImp extends BaseService<EconomicCode, EconomicCodeRequest> implements EconomicCodeService {

    private final EconomicCodeRepository economicCodeRepository;

    public EconomicCodeServiceImp(EconomicCodeRepository economicCodeRepository) {
        super(economicCodeRepository);
        this.economicCodeRepository = economicCodeRepository;
    }

    @Override
    public ResponseEntity<List<EconomicCodeRequest>> getActiveEconomicCode() {
        return new ResponseEntity(economicCodeRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
    }

    @Override
    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = economicCodeRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }
}


