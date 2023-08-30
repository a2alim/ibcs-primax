package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SectorDivision;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.SectorDivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.services.SectorDivisionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SectorDivisionRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SectorDivisionResponse;
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
public class SectorDivisionServiceImp extends BaseService<SectorDivision, SectorDivisionRequest> implements SectorDivisionService {
    private final SectorDivisionRepository sectorDivisionRepository;

    public SectorDivisionServiceImp(SectorDivisionRepository sectorDivisionRepository) {
        super(sectorDivisionRepository);
        this.sectorDivisionRepository = sectorDivisionRepository;
    }

    /**
     * For get active sector division
     */
    @Override
    public ResponseEntity<List<SectorDivisionResponse>> getActiveSectorDivision() {
        return new ResponseEntity(sectorDivisionRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
    }

    /**
     * For code generate
     * @param sectorDivisionNameEn
     * @return sectorDivisionNameEn
     */
    @Override
    public String generateCode(String sectorDivisionNameEn) {
        String versionCode = sectorDivisionNameEn.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = sectorDivisionRepository.findAll().size() + 1 + "";
        versionCode = versionCode + "-" + month + "-" + year + "-" + versionListSize;
        return versionCode;
    }

}
