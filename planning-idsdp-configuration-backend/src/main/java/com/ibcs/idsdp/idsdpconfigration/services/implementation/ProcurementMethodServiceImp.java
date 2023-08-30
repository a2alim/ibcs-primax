package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProcurementMethod;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ProcurementMethodRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ProcurementMethodService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ProcurementMethodRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.ProcurementMethodResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class ProcurementMethodServiceImp extends BaseService<ProcurementMethod, ProcurementMethodRequest> implements ProcurementMethodService {
    private final ProcurementMethodRepository procurementMethodRepository;

    public ProcurementMethodServiceImp(ProcurementMethodRepository procurementMethodRepository) {
        super(procurementMethodRepository);
        this.procurementMethodRepository = procurementMethodRepository;
    }

    /*
     * get Active Procurement Methods
     * @return List<ProcurementMethodResponse>
     */

    @Override
    public ResponseEntity<List<ProcurementMethodResponse>> getActiveProcurementMethods() {
        return new ResponseEntity(procurementMethodRepository.findAllByStatusAndIsDeleted(TRUE, TRUE), HttpStatus.OK);
    }

    /*
     * generate Code Number
     * @param code
     * @return
     */

    @Override
    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = procurementMethodRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }
}
