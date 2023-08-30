package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UpaZilla;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.UpaZillaRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ZillaRepository;
import com.ibcs.idsdp.idsdpconfigration.services.UpaZillaService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.UpaZillaRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;


@Slf4j
@Service
public class UpaZillaServiceImp extends BaseService<UpaZilla, UpaZillaRequest> implements UpaZillaService {

    private final UpaZillaRepository upaZillaRepository;
    private final ZillaServiceImp zillaServiceImp;
    private final ZillaRepository zillaRepository;

    public UpaZillaServiceImp(UpaZillaRepository upaZillaRepository, ZillaServiceImp zillaServiceImp, ZillaRepository zillaRepository) {
        super(upaZillaRepository);
        this.upaZillaRepository = upaZillaRepository;
        this.zillaServiceImp = zillaServiceImp;
        this.zillaRepository = zillaRepository;
    }

    /**
     * convertForRead for using base method
     * @param upaZilla
     * @return
     */
    @Override
    protected UpaZillaRequest convertForRead(UpaZilla upaZilla) {
        UpaZillaRequest upaZillaRequest = super.convertForRead(upaZilla);
        upaZillaRequest.setZilla(zillaServiceImp.getById(upaZilla.getZilla().getId()));
        return upaZillaRequest;
    }

    /**
     * convertForCreate for using base method
     * @param upaZillaRequest
     * @return
     */
    @Override
    protected UpaZilla convertForCreate(UpaZillaRequest upaZillaRequest) {
        UpaZilla upaZilla = super.convertForCreate(upaZillaRequest);
        upaZilla.setZilla(zillaRepository.findByIdAndIsDeleted(upaZillaRequest.getZillaId(), false).get());
        return upaZilla;
    }

    /**
     * convertForUpdate for using base method
     * @param upaZillaRequest
     * @param upaZilla
     */
    @Override
    protected void convertForUpdate(UpaZillaRequest upaZillaRequest, UpaZilla upaZilla) {
        upaZilla.setZilla(zillaRepository.findByIdAndIsDeleted(upaZillaRequest.getZillaId(), false).get());
        super.convertForUpdate(upaZillaRequest, upaZilla);
    }

    /**
     * Get Active UpaZilla
     * @return
     */
    @Override
    public ResponseEntity<List<UpaZillaRequest>> getActiveUpaZilla() {
        return new ResponseEntity(upaZillaRepository.findAllByStatusAndIsDeleted(true, false), HttpStatus.OK);
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
        String versionListSize = upaZillaRepository.findAll().size() + 1 + "";
        versionNumber = versionNumber + "-" + month + "-" + year + "-" + versionListSize;
        return versionNumber;
    }

    /**
     * Get By Zill Id
     * @param zillaId
     * @return
     */
    @Override
    public List<UpaZillaRequest> getByZillId(Long zillaId) {
        return convertForRead(upaZillaRepository.findAllByZillaIdAndStatusAndIsDeleted(zillaId, true, false));
    }

    /**
     * Get By Zill Ids
     * @param zillaIds
     * @return
     */
    @Override
    public List<UpaZillaRequest> getByZillIds(Set<Long> zillaIds) {
        return convertForRead(upaZillaRepository.findAllByZillaIdInAndStatusAndIsDeleted(zillaIds, true, false));
    }

    @Override
    public List<UpaZillaRequest> getByZillaGeoCode(String zillaGeoCode) {
        return convertForRead(upaZillaRepository.findAllByZillaGeoCodeAndStatusAndIsDeleted(zillaGeoCode, true, false));
    }
}


