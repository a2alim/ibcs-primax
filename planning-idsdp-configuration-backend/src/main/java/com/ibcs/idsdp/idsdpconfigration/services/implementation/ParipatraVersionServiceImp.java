package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ParipatraVersion;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ParipatraVersionRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ParipatraVersionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ParipatraVersionDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SectorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class ParipatraVersionServiceImp extends BaseService<ParipatraVersion, ParipatraVersionDTO> implements ParipatraVersionService {

    private final ParipatraVersionRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public ParipatraVersionServiceImp(ParipatraVersionRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }


    /**
     * for convertForCreate
     * @param paripatraVersionDTO
     * @return
     */
    @Override
    protected ParipatraVersion convertForCreate(ParipatraVersionDTO paripatraVersionDTO) {
        ParipatraVersion paripatraVersion = super.convertForCreate(paripatraVersionDTO);
        paripatraVersion.setCode(idGeneratorComponent.generateCode(paripatraVersionDTO.getNameEn(), repository.count()));
        return paripatraVersion;
    }

    /**
     * for convertForUpdate
     * @param paripatraVersionDTO
     * @param paripatraVersion
     */
    @Override
    protected void convertForUpdate(ParipatraVersionDTO paripatraVersionDTO, ParipatraVersion paripatraVersion) {
        paripatraVersionDTO.setCode(paripatraVersion.getCode());
        super.convertForUpdate(paripatraVersionDTO, paripatraVersion);
    }

    /**
     * for get Active ParipatraVersion
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<ParipatraVersionDTO> getActiveParipatraVersion(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<ParipatraVersion> ePage = repository.findAllByStatusAndIsDeleted(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    /**
     * for get Active Single ParipatraVersion
     */
    @Override
    public ResponseEntity<ParipatraVersionDTO> getActiveSingleParipatraVersion() {
        return new ResponseEntity(repository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
    }

    @Override
    public List<ParipatraVersionDTO> getActiveParipatraList() {
        List<ParipatraVersion> list = repository.findAllByStatusAndIsDeletedOrderByIdDesc(true, false);
        return convertForRead(list);
    }
}


