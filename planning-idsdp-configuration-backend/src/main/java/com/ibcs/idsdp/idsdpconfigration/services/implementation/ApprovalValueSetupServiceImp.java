package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ApprovalValueSetup;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Division;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ApprovalValueSetupRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ApprovalValueSetupRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ApprovalValueSetupService;
import com.ibcs.idsdp.idsdpconfigration.services.DivisionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ApprovalValueSetupRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DivisionRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class ApprovalValueSetupServiceImp extends BaseService<ApprovalValueSetup, ApprovalValueSetupRequest> implements ApprovalValueSetupService {

    private final ApprovalValueSetupRepository approvalValueSetupRepository;

    public ApprovalValueSetupServiceImp(ApprovalValueSetupRepository approvalValueSetupRepository) {
        super(approvalValueSetupRepository);
        this.approvalValueSetupRepository = approvalValueSetupRepository;
    }


    @Override
    public ResponseEntity<List<ApprovalValueSetupRequest>> getActiveApprovalValueSetup() {
        return new ResponseEntity(approvalValueSetupRepository.findAllByStatus(TRUE), HttpStatus.OK);
    }

    @Override
    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = approvalValueSetupRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }

}


