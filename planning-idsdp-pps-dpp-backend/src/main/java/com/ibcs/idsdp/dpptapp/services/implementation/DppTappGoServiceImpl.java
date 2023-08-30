package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.DppTappGo;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.repositories.AssignEcnecMeetingRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppTappGoRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.EcnecMeetingRepository;
import com.ibcs.idsdp.dpptapp.services.AssignEcnecMeetingService;
import com.ibcs.idsdp.dpptapp.services.DppTappGoService;
import com.ibcs.idsdp.dpptapp.web.dto.request.AssignEcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppTappGoDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
public class DppTappGoServiceImpl extends BaseService<DppTappGo, DppTappGoDto> implements DppTappGoService {

    private final IdGeneratorComponent idGeneratorComponent;

    private final DppTappGoRepository dppTappGoRepository;

    public DppTappGoServiceImpl(ServiceRepository<DppTappGo> repository, IdGeneratorComponent idGeneratorComponent, DppTappGoRepository dppTappGoRepository) {
        super(repository);
        this.idGeneratorComponent = idGeneratorComponent;
        this.dppTappGoRepository = dppTappGoRepository;
    }

    @Override
    public DppTappGo createOrUpdate(DppTappGoDto request) {
        Map<String, Object> map = new HashMap<>();

        if(request != null && request.getId() == null){
            return createEntity(request);
        }else{
            return updateEntity(request);
        }

    }

    @Override
    public DppTappGo findByPcUuidAndOrderType(String pcUuid, String orderType) {
        return dppTappGoRepository.findByPcUuidAndOrderTypeAndIsDeleted(pcUuid, orderType,false);
    }

    @Override
    public ResponseEntity<ResponseStatus> deleteDppTappGo(String pcUuid, String orderType) {
        DppTappGo dppTappGo = dppTappGoRepository.findByPcUuidAndOrderTypeAndIsDeleted(pcUuid, orderType,false);
        dppTappGo.setIsDeleted(true);
        dppTappGoRepository.save(dppTappGo);
        return new ResponseEntity(new ResponseStatus(1, "Deleted successfully"), HttpStatus.OK);
    }
}
