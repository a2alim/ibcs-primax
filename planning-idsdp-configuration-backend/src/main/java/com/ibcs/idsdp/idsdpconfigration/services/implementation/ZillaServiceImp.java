package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Zilla;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.DivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ZillaRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ZillaService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DivisionRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ZillaRequest;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class ZillaServiceImp extends BaseService<Zilla, ZillaRequest> implements ZillaService {

    private final ZillaRepository zillaRepository;
    private final DivisionServiceImp divisionServiceImp;
    private final DivisionRepository divisionRepository;

    public ZillaServiceImp(ZillaRepository zillaRepository, @Lazy DivisionServiceImp divisionServiceImp,
                           DivisionRepository divisionRepository) {
        super(zillaRepository);
        this.zillaRepository = zillaRepository;
        this.divisionServiceImp = divisionServiceImp;
        this.divisionRepository = divisionRepository;
    }

    /**
     * convertForRead for using base method
     * @param zilla
     * @return
     */
    @Override
    protected ZillaRequest convertForRead(Zilla zilla) {
        ZillaRequest zillaRequest = super.convertForRead(zilla);
        zillaRequest.setDivision(new ModelMapper().map(zilla.getDivision(), DivisionRequest.class));
        return zillaRequest;
    }

    /**
     * convertForCreate for using base method
     * @param zillaRequest
     * @return
     */
    @Override
    protected Zilla convertForCreate(ZillaRequest zillaRequest) {
        Zilla zilla = super.convertForCreate(zillaRequest);
        zilla.setDivision(divisionRepository.findByIdAndIsDeleted(zillaRequest.getDivisionId(), false).get());
        return zilla;
    }

    /**
     * convertForUpdate for using base method
     * @param zillaRequest
     * @param zilla
     */
    @Override
    protected void convertForUpdate(ZillaRequest zillaRequest, Zilla zilla) {
        zilla.setDivision(divisionRepository.findByIdAndIsDeleted(zillaRequest.getDivisionId(), false).get());
        super.convertForUpdate(zillaRequest, zilla);
    }

    /**
     * Get Active Zilla
     * @return
     */
    @Override
    public ResponseEntity<List<ZillaRequest>> getActiveZilla() {
        return new ResponseEntity(zillaRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
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
        String versionListSize = zillaRepository.findAll().size() + 1 + "";
        versionNumber = versionNumber + "-" + month + "-" + year + "-" + versionListSize;
        return versionNumber;
    }

    /**
     * Get By Division Id
     * @param divisionId
     * @return
     */
    @Override
    public List<ZillaRequest> getByDivisionId(Long divisionId) {
        return  convertForRead(zillaRepository.findAllByDivisionIdAndStatusAndIsDeleted(divisionId, true, false));
    }

    /**
     * getBy Division Ids
     * @param divisionIds
     * @return
     */
    @Override
    public List<ZillaRequest> getByDivisionIds(Set<Long> divisionIds) {
        return  convertForRead(zillaRepository.findAllByDivisionIdInAndStatusAndIsDeleted(divisionIds, true, false));
    }

    @Override
    public List<ZillaRequest> getByDivisionGeoCode(String divisionGeoCode) {
        return  convertForRead(zillaRepository.findAllByDivisionGeoCodeAndStatusAndIsDeleted(divisionGeoCode, true, false));
    }
}


