package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.exceptions.exception.ServiceExceptionHolder;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SubEconomicCode;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.SubEconomicCodeRepository;
import com.ibcs.idsdp.idsdpconfigration.services.SubEconomicCodeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SubEconomicCodeRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.EcCodeWithSubEcCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class SubEconomicCodeServiceImp extends BaseService<SubEconomicCode, SubEconomicCodeRequest> implements SubEconomicCodeService {

    private final SubEconomicCodeRepository subEconomicCodeRepository;
    private final EconomicCodeServiceImp economicCodeServiceImp;

    public SubEconomicCodeServiceImp(SubEconomicCodeRepository subEconomicCodeRepository, EconomicCodeServiceImp economicCodeServiceImp) {
        super(subEconomicCodeRepository);
        this.subEconomicCodeRepository = subEconomicCodeRepository;
        this.economicCodeServiceImp = economicCodeServiceImp;
    }

    @Override
    protected SubEconomicCodeRequest convertForRead(SubEconomicCode subEconomicCode) {
        SubEconomicCodeRequest subEconomicCodeRequest = super.convertForRead(subEconomicCode);
        subEconomicCodeRequest.setEconomicCodeDTO(economicCodeServiceImp.getById(subEconomicCode.getEconomicCodeId().getId()));
        return subEconomicCodeRequest;
    }

    @Override
    public ResponseEntity<List<SubEconomicCodeRequest>> getActiveSubEconomicCode() {
        return new ResponseEntity(subEconomicCodeRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
    }

    @Override
    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = subEconomicCodeRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }

    @Override
    public List<SubEconomicCodeRequest> getByEconomicCodeId(long economicCodeId) {
//        subEconomicCodeRepository.findAllByStatusAndIsDeleted(TRUE, FALSE);
        List<SubEconomicCodeRequest> subEconomicCodeRequests = new ArrayList<>();
        List<SubEconomicCode> subEconomicCodes = subEconomicCodeRepository.findAllByStatusAndIsDeleted(TRUE, FALSE);
        for (SubEconomicCode subEconomicCode : subEconomicCodes) {
            if (subEconomicCode.getEconomicCodeId().getId().equals(economicCodeId)) {
                SubEconomicCodeRequest subEconomicCodeRequest = new SubEconomicCodeRequest();
                BeanUtils.copyProperties(subEconomicCode, subEconomicCodeRequest);
                subEconomicCodeRequests.add(subEconomicCodeRequest);
            }

        }
        return subEconomicCodeRequests;
    }

    @Override
    public ResponseEntity<List<EcCodeWithSubEcCode>> getSubEconomicCodeByEconomicCodeSet(Set<Long> economicCodes) {
        System.out.println(economicCodes);
        if (economicCodes.isEmpty())
            throw new ServiceExceptionHolder.InvalidRequestException("No ID given");
        List<EcCodeWithSubEcCode> list = new ArrayList<>();
        economicCodes.forEach(e -> list.add(new EcCodeWithSubEcCode() {{
            setEconomicCodeId(e);
            setSubEconomicCodes(convertForRead(subEconomicCodeRepository.findAllByEconomicCodeIdAndIsDeleted(e, false)));
        }}));
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

}


