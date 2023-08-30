package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Municipality;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.MunicipalityRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.UpaZillaRepository;
import com.ibcs.idsdp.idsdpconfigration.services.MunicipalityService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.MunicipalityRequest;
import lombok.extern.slf4j.Slf4j;
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
public class MunicipalityServiceImp extends BaseService<Municipality, MunicipalityRequest> implements MunicipalityService {

    private final MunicipalityRepository municipalityRepository;
    private final UpaZillaServiceImp upaZillaServiceImp;
    private final UpaZillaRepository upaZillaRepository;

    protected MunicipalityServiceImp(ServiceRepository<Municipality> repository, MunicipalityRepository municipalityRepository, UpaZillaServiceImp upaZillaServiceImp, UpaZillaRepository upaZillaRepository) {
        super(repository);
        this.municipalityRepository = municipalityRepository;
        this.upaZillaServiceImp = upaZillaServiceImp;
        this.upaZillaRepository = upaZillaRepository;
    }

    /*
     *
     * @param municipality
     * @return MunicipalityRequest
     */

    @Override
    protected MunicipalityRequest convertForRead(Municipality municipality) {
        MunicipalityRequest municipalityRequest = super.convertForRead(municipality);
        municipalityRequest.setUpaZilla(upaZillaServiceImp.getById(municipality.getUpaZilla().getId()));
        return municipalityRequest;
    }

    /*
     *
     * @param municipality
     * @return MunicipalityRequest
     */
    @Override
    protected Municipality convertForCreate(MunicipalityRequest municipalityRequest) {
        Municipality municipality = super.convertForCreate(municipalityRequest);
        municipality.setUpaZilla(upaZillaRepository.findByIdAndIsDeleted(municipalityRequest.getUpazilaId(), false).get());
        return municipality;
    }

    /*
     * Convert For Create is using base method
     * @param municipality
     * @return MunicipalityRequest
     */
    @Override
    protected void convertForUpdate(MunicipalityRequest municipalityRequest, Municipality municipality) {
        municipality.setUpaZilla(upaZillaRepository.findByIdAndIsDeleted(municipalityRequest.getUpazilaId(), false).get());
        super.convertForUpdate(municipalityRequest, municipality);
    }

    /*
     * Get Active Municipality
     * @return List<MunicipalityRequest>
     */

    @Override
    public ResponseEntity<List<MunicipalityRequest>> getActiveMunicipality() {
        return new ResponseEntity(municipalityRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
    }

    /*
     * Get Municipality By UpazilaId
     * @param upazillaId
     * @return List<MunicipalityRequest>
     */

    @Override
    public List<MunicipalityRequest> getMunicipalityByUpazilaId(Long upazillaId) {
        return convertForRead(municipalityRepository.findAllByUpaZillaIdAndStatusAndIsDeleted(upazillaId, true, false));
    }

    /*
     * get Municipality By UpazilaIds
     * @param upazilaIds
     * @return List<MunicipalityRequest>
     */

    @Override
    public List<MunicipalityRequest> getMunicipalityByUpazilaIds(Set<Long> upazilaIds) {
        return convertForRead(municipalityRepository.findAllByUpaZillaIdInAndStatusAndIsDeleted(upazilaIds, true, false));
    }

    /*
     * create generateCodeNumber
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
        String versionListSize = municipalityRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }

}
