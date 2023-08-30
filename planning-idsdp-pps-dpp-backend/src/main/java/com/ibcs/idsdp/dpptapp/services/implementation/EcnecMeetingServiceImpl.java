package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.repositories.EcnecMeetingRepository;
import com.ibcs.idsdp.dpptapp.services.EcnecMeetingService;
import com.ibcs.idsdp.dpptapp.web.dto.request.EcnecMeetingRequest;
import lombok.NonNull;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
public class EcnecMeetingServiceImpl extends BaseService<EcnecMeeting, EcnecMeetingRequest> implements EcnecMeetingService {

    private final EcnecMeetingRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public EcnecMeetingServiceImpl(ServiceRepository<EcnecMeeting> repository,
                                   EcnecMeetingRepository repository1,
                                   IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository1;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    @Override
    protected EcnecMeeting convertForCreate(EcnecMeetingRequest ecnecMeetingRequest) {
        EcnecMeeting ecnecMeeting = super.convertForCreate(ecnecMeetingRequest);
        return ecnecMeeting;
    }

    @Override
    protected void convertForUpdate(EcnecMeetingRequest ecnecMeetingRequest, EcnecMeeting ecnecMeeting) {
        super.convertForUpdate(ecnecMeetingRequest, ecnecMeeting);
    }

    @Override
    public EcnecMeetingRequest getByUuid(@NonNull String uuid) {
        return super.getByUuid(uuid);
    }

    @Override
    public Page<EcnecMeetingRequest> getActiveMeeting(PageableRequestBodyDTO pageableRequestBodyDTO) {
        Pageable pageable = this.getPageable(pageableRequestBodyDTO);
        Page<EcnecMeeting> ePage = repository.findAllByIsDeletedOrderByIdDesc(false, pageable);

        LocalDate date = LocalDate.now();
        List<EcnecMeetingRequest> list = new ArrayList<>();

        ePage.getContent().forEach( res -> {
            EcnecMeetingRequest ecnecMeetingRequest = new EcnecMeetingRequest();
            BeanUtils.copyProperties(res, ecnecMeetingRequest);
            if(res.getMeetingDate().getDayOfYear() > date.getDayOfYear()) {
                ecnecMeetingRequest.setMeetingStatus(true);
            }
            list.add(ecnecMeetingRequest);

        });
        return new PageImpl<>(list, pageable, ePage.getTotalElements());
    }


    public List<EcnecMeeting> getActiveList() {
        List<EcnecMeeting> activeList = repository.findAllByStatusAndIsDeleted(true, false);
        return activeList;
    }
}
