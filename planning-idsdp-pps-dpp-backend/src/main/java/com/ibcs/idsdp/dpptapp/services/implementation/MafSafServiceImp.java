package com.ibcs.idsdp.dpptapp.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.dpptapp.model.domain.MafSaf;
import com.ibcs.idsdp.dpptapp.model.repositories.MafSafRepository;
import com.ibcs.idsdp.dpptapp.services.MafSafService;
import com.ibcs.idsdp.dpptapp.web.dto.MafSafDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@Service
public class MafSafServiceImp extends BaseService<MafSaf, MafSafDTO> implements MafSafService {

    private final MafSafRepository mafSafRepository;
    private final IdGeneratorComponent idGeneratorComponent;

    public MafSafServiceImp(MafSafRepository mafSafRepository, IdGeneratorComponent idGeneratorComponent) {
        super(mafSafRepository);
        this.mafSafRepository = mafSafRepository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    @Override
    public MafSafDTO getMafSafByPcUuidAndType(String pcUuid, String type) {
        List<MafSaf> list = mafSafRepository.findAllByProjectConceptUuidAndTypeAndIsDeleted(pcUuid, type, false);
        if (list.size()>0) {
            return convertForRead(list.get(0));
        }
        return null;
    }
}


