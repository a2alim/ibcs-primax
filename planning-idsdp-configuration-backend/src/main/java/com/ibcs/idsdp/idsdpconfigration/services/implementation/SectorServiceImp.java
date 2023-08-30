package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Sector;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.SectorDivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.SectorRepository;
import com.ibcs.idsdp.idsdpconfigration.services.SectorService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SectorRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SectorResponse;
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
public class SectorServiceImp extends BaseService<Sector, SectorRequest> implements SectorService {

    private final SectorRepository sectorRepository;
    private final SectorDivisionRepository sectorDivisionRepository;

    public SectorServiceImp(SectorRepository sectorRepository, SectorDivisionRepository sectorDivisionRepository) {
        super(sectorRepository);
        this.sectorRepository = sectorRepository;
        this.sectorDivisionRepository = sectorDivisionRepository;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Create
    @Override
    protected Sector convertForCreate(SectorRequest sectorRequest) {
        Sector sector = super.convertForCreate(sectorRequest);
        sector.setSectorDivision(sectorDivisionRepository.findByIdAndIsDeleted(sectorRequest.getSectorDivisionId(), false).get());
        return sector;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Edit
    @Override
    protected void convertForUpdate(SectorRequest sectorRequest, Sector sector) {
        sector.setSectorDivision(sectorDivisionRepository.findByIdAndIsDeleted(sectorRequest.getSectorDivisionId(), false).get());
        super.convertForUpdate(sectorRequest, sector);
    }

    /**
     * For get active sector
     */
    @Override
    public ResponseEntity<List<SectorResponse>> getActiveSector() {
        return new ResponseEntity(sectorRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
    }

    @Override
    public List<SectorRequest> getBySectorDivisionId(Long sectorDivisionId) {
        return convertForRead(sectorRepository.findBySectorDivisionIdAndStatusAndIsDeleted(sectorDivisionId,true,false));
    }

    /**
     * For generate code
     * @param sectorNameEn
     * @return sectorNameEn
     */
    @Override
    public String generateCode(String sectorNameEn) {
        String code = sectorNameEn.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = sectorRepository.findAll().size() + 1 + "";
        code = code + "-" + month + "-" + year + "-" + versionListSize;
        return code;
    }
}
