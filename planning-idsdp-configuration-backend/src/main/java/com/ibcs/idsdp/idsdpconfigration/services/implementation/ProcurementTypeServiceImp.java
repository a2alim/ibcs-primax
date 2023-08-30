package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProcurementType;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ProcurementTypeRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ProcurementTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ProcurementTypeRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.ProcurementTypeResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class ProcurementTypeServiceImp extends BaseService<ProcurementType, ProcurementTypeRequest> implements ProcurementTypeService {
    private final ProcurementTypeRepository procurementTypeRepository;

    public ProcurementTypeServiceImp(ProcurementTypeRepository procurementTypeRepository) {
        super(procurementTypeRepository);
        this.procurementTypeRepository = procurementTypeRepository;
    }

    /*
     * get Active Procurement Types
     * @return List<ProcurementTypeResponse>
     */

    @Override
    public ResponseEntity<List<ProcurementTypeResponse>> getActiveProcurementTypes() {
        return new ResponseEntity(procurementTypeRepository.findAllByStatusAndIsDeleted(TRUE, TRUE), HttpStatus.OK);
    }

    /*
     * generate Code Number
     * @param code
     * @return String
     */

    @Override
    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = procurementTypeRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }
}
