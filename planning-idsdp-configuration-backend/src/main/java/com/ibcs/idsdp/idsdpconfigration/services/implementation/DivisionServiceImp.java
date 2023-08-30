package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Division;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.DivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.MunicipalityRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.UpaZillaRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ZillaRepository;
import com.ibcs.idsdp.idsdpconfigration.services.DivisionService;
import com.ibcs.idsdp.idsdpconfigration.services.MunicipalityService;
import com.ibcs.idsdp.idsdpconfigration.services.UpaZillaService;
import com.ibcs.idsdp.idsdpconfigration.services.ZillaService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DivisionRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ZillaRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class DivisionServiceImp extends BaseService<Division, DivisionRequest> implements DivisionService {

    private final DivisionRepository divisionRepository;
    private final ZillaService zillaService;
    private final UpaZillaService upaZillaService;
    private final MunicipalityService municipalityService;

    public DivisionServiceImp(DivisionRepository divisionRepository, ZillaService zillaService, UpaZillaService upaZillaService,
                              MunicipalityService municipalityService) {
        super(divisionRepository);
        this.divisionRepository = divisionRepository;
        this.zillaService = zillaService;
        this.upaZillaService = upaZillaService;
        this.municipalityService = municipalityService;
    }

    /**
     * Get Active Division
     * @return
     */
    @Override
    public ResponseEntity<List<DivisionRequest>> getActiveDivision() {
        return new ResponseEntity(divisionRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
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
        String versionListSize = divisionRepository.findAll().size() + 1 + "";
        versionNumber = versionNumber + "-" + month + "-" + year + "-" + versionListSize;
        return versionNumber;
    }

    /**
     * Get All Active Division With Zilla Upazilla And Municipalty
     * @return
     */
    @Override
    public List<DivisionRequest> getAllActiveDivisionWithZillaUpazillaAndMunicipalty() {
        List<DivisionRequest> list = convertForRead(divisionRepository.findAllByStatusAndIsDeleted(true, false));

        list.forEach(d -> {
            d.setZillas(zillaService.getByDivisionId(d.getId()));
            d.getZillas().forEach(z -> {
                z.setUpaZillas(upaZillaService.getByZillId(z.getId()));
                z.getUpaZillas().forEach(u -> {
                    u.setMunicipalitys(municipalityService.getMunicipalityByUpazilaId(u.getId()));
                });
            });
        });

        return list;
    }

    @Override
    public ResponseEntity<DivisionZillaUpazilaMunicipalityResponse> getAllActiveDivisionZillaUpazillaMunicipality() {
        DivisionZillaUpazilaMunicipalityResponse response = new DivisionZillaUpazilaMunicipalityResponse();
        response.setDivisions(convertForRead(divisionRepository.findAllByStatusAndIsDeleted(true, false)));
        response.setZillas(zillaService.getActiveZilla().getBody());
        response.setUpazilas(upaZillaService.getActiveUpaZilla().getBody());
        response.setMunicipalitys(municipalityService.getActiveMunicipality().getBody());
        return new ResponseEntity<>(response, HttpStatus.OK) ;
    }
}


