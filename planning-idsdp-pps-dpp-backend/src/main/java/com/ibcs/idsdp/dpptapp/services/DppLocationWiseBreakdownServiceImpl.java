package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.dpptapp.model.domain.DppLocationWiseBreakdown;
import com.ibcs.idsdp.dpptapp.model.repositories.DppLocationWiseBreakdownRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.web.dto.DppLocationWiseBreakdownDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        dppLocationWiseBreakdown.setDppObjectiveCost(dppObjectiveCostRepository.findByIdAndIsDeleted(dppLocationWiseBreakdownDTO.getDppMasterId(), false).get());
        return dppLocationWiseBreakdown;
    }

    @Override
    protected void convertForUpdate(DppLocationWiseBreakdownDTO dppLocationWiseBreakdownDTO, DppLocationWiseBreakdown dppLocationWiseBreakdown) {
        dppLocationWiseBreakdown.setDppObjectiveCost(dppObjectiveCostRepository.findByIdAndIsDeleted(dppLocationWiseBreakdownDTO.getDppMasterId(), false).get());
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
            response.add(create(e));
//            if (e.getId() > 0)
//                response.add(update(e));
//            else
//                response.add(create(e));
        });
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<DppLocationWiseBreakdownDTO>> getByProjectConceptMasterId(Long projectConceptMasterId) {
        List<DppLocationWiseBreakdownDTO> list = convertForRead(repository.findAllByProjectConceptMasterIdAndIsDeleted(projectConceptMasterId, false));
        return new ResponseEntity<>(list, HttpStatus.OK);
    }


}
