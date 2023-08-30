package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SubSector;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.SubSectorRepository;
import com.ibcs.idsdp.idsdpconfigration.services.SubSectorService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SubSectorRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SubSectorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class SubSectorServiceImp extends BaseService<SubSector, SubSectorRequest> implements SubSectorService {

    private final SubSectorRepository subSectorRepository;

    public SubSectorServiceImp(SubSectorRepository subSectorRepository) {
        super(subSectorRepository);
        this.subSectorRepository = subSectorRepository;
    }

    /**
     * Get active sub sector
     */
    @Override
    public ResponseEntity<List<SubSectorResponse>> getActiveSubSector() {
        return new ResponseEntity(subSectorRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
    }

    /**
     * For generate code
     * @param subSectorNameEn
     * @return subSectorNameEn
     */
    @Override
    public String generateCode(String subSectorNameEn) {
        String code = subSectorNameEn.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = subSectorRepository.findAll().size() + 1 + "";
        code = code + "-" + month + "-" + year + "-" + versionListSize;
        return code;
    }

    /**
     * For sub sector by sector id
     * @param sectorId
     * @return sectorId
     */
    @Override
    public List<SubSectorRequest> getBySectorId(long sectorId) {
        return convertForRead(subSectorRepository.findAllBySectorIdAndStatusAndIsDeleted(sectorId, true, false));
    }

    @Override
    public Optional<SubSectorRequest> getBySubSectorNameEn(String subSectorNameEn) {
        Optional<SubSector> subSector = subSectorRepository.findBySubSectorNameEnAndIsDeleted(subSectorNameEn, false);
        if (subSector.isPresent()) {
            SubSectorRequest subSectorDTO = convertForRead(subSector.get());
            return Optional.of(subSectorDTO);
        }

        return Optional.empty();
    }

    @Override
    public Optional<SubSectorRequest> getBySubSectorCode(String subSectorCode) {
        Optional<SubSector> subSector = subSectorRepository.findBySubSectorCodeAndIsDeleted(subSectorCode, false);
        if (subSector.isPresent()) {
            SubSectorRequest subSectorDTO = convertForRead(subSector.get());
            return Optional.of(subSectorDTO);
        }
        return Optional.empty();
    }
}
