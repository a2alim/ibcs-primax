package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Priority;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.PriorityRepository;
import com.ibcs.idsdp.idsdpconfigration.services.PriorityService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.PriorityRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.PriorityResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class PriorityServiceImpl extends BaseService<Priority, PriorityRequest> implements PriorityService {

    private final PriorityRepository priorityRepository;

    public PriorityServiceImpl(ServiceRepository<Priority> repository, PriorityRepository priorityRepository) {
        super(repository);
        this.priorityRepository = priorityRepository;
    }

    @Override
    public ResponseEntity<List<PriorityResponse>> getActivePriority() {
        return new ResponseEntity(priorityRepository.findAllByStatusAndIsDeleted(true, false), HttpStatus.OK);
    }

    @Override
    public String generatePriorityCode(String nameEn) {
        String code = nameEn.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = priorityRepository.findAll().size() + 1 + "";
        code = code + "-" + year + "-" + month + "-" + versionListSize;

        return code;
    }
}
