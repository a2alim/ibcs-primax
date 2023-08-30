package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppLocationWiseBreakdown;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppLocationWiseBreakdownRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppLocationWiseBreakdownDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class DppLocationWiseBreakdownServiceImpl extends BaseService<DppLocationWiseBreakdown, DppLocationWiseBreakdownDTO> implements DppLocationWiseBreakdownService {

    private final DppLocationWiseBreakdownRepository repository;
    private final DppObjectiveCostRepository dppObjectiveCostRepository;

    public DppLocationWiseBreakdownServiceImpl(DppLocationWiseBreakdownRepository repository, DppObjectiveCostRepository dppObjectiveCostRepository) {
        super(repository);
        this.repository = repository;
        this.dppObjectiveCostRepository = dppObjectiveCostRepository;
    }

    @Override
    protected DppLocationWiseBreakdown convertForCreate(DppLocationWiseBreakdownDTO dppLocationWiseBreakdownDTO) {
        DppLocationWiseBreakdown dppLocationWiseBreakdown = super.convertForCreate(dppLocationWiseBreakdownDTO);
        return dppLocationWiseBreakdown;
    }

    @Override
    protected void convertForUpdate(DppLocationWiseBreakdownDTO dppLocationWiseBreakdownDTO, DppLocationWiseBreakdown dppLocationWiseBreakdown) {
        super.convertForUpdate(dppLocationWiseBreakdownDTO, dppLocationWiseBreakdown);
    }

    @Override
    public ResponseEntity<List<DppLocationWiseBreakdownDTO>> createList(List<DppLocationWiseBreakdownDTO> dtoList) {
        List<DppLocationWiseBreakdownDTO> response = new ArrayList<>();
        dtoList.forEach(e -> response.add(create(e)));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<DppLocationWiseBreakdownDTO>> updateList(List<DppLocationWiseBreakdownDTO> dtoList) {
        List<DppLocationWiseBreakdownDTO> response = new ArrayList<>();
//        dtoList.forEach(e -> response.add(update(e)));
        dtoList.forEach(e -> {
            if (e.getId() > 0)
                response.add(update(e));
            else
                response.add(create(e));
        });
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<DppLocationWiseBreakdownDTO>> getByProjectConceptMasterId(Long projectConceptMasterId) {
        List<DppLocationWiseBreakdownDTO> list = convertForRead(repository.findAllByProjectConceptMasterIdAndIsDeleted(projectConceptMasterId, false));
        return new ResponseEntity<>(list, HttpStatus.OK);
    }


}
