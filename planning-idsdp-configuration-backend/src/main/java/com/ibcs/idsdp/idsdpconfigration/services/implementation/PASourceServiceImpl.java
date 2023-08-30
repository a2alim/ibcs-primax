package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.PASource;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.PASourceRepository;
import com.ibcs.idsdp.idsdpconfigration.services.PASourceService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.PASourceRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.PASourceResponse;
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
public class PASourceServiceImpl extends BaseService<PASource, PASourceRequest> implements PASourceService {
    private final PASourceRepository paSourceRepository;

    public PASourceServiceImpl(ServiceRepository<PASource> repository, PASourceRepository paSourceRepository) {
        super(repository);
        this.paSourceRepository = paSourceRepository;
    }

    @Override
    public ResponseEntity<List<PASourceResponse>> getActivePaSource() {
        return new ResponseEntity(paSourceRepository.findAllByStatusAndIsDeleted(TRUE, FALSE), HttpStatus.OK);
    }

    @Override
    public String generatePaSourceCode(String nameEn) {
        String code = nameEn.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = paSourceRepository.findAll().size() + 1 +"";
        code = code + "-" + year + "-" + month + "-" + versionListSize;

        return code;
    }
}
