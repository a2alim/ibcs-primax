package com.ibcs.idsdp.rdpprtapp.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.client.ConfigurationClientService;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnualPhasingCostTabDetails;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppAnnualPhasingCostRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppAnnualPhasingCostTabDetailsRepository;
import com.ibcs.idsdp.rdpprtapp.services.DppAnnualPhasingCostTabDetailsService;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTabDetailsDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.UnitType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DppAnnualPhasingCostTabDetailsServiceImp extends BaseService<DppAnnualPhasingCostTabDetails, DppAnnualPhasingCostTabDetailsDTO> implements DppAnnualPhasingCostTabDetailsService {

    private final DppAnnualPhasingCostTabDetailsRepository repository;
    private final DppAnnualPhasingCostRepository dppAnnualPhasingCostRepository;
    private final ConfigurationClientService configurationClientService;

    public DppAnnualPhasingCostTabDetailsServiceImp(DppAnnualPhasingCostTabDetailsRepository repository,
                                                    DppAnnualPhasingCostRepository dppAnnualPhasingCostRepository, ConfigurationClientService configurationClientService) {
        super(repository);
        this.repository = repository;
        this.dppAnnualPhasingCostRepository = dppAnnualPhasingCostRepository;
        this.configurationClientService = configurationClientService;
    }

    @Override
    protected DppAnnualPhasingCostTabDetails convertForCreate(DppAnnualPhasingCostTabDetailsDTO dppAnnualPhasingCostTabDetailsDTO) {
        DppAnnualPhasingCostTabDetails dppAnnualPhasingCostTabDetails = super.convertForCreate(dppAnnualPhasingCostTabDetailsDTO);
        dppAnnualPhasingCostTabDetails.setDppAnnualPhasingCost(dppAnnualPhasingCostRepository.findByIdAndIsDeleted(dppAnnualPhasingCostTabDetailsDTO.getDppAnnualPhasingCostId(), false).get());
        return dppAnnualPhasingCostTabDetails;
    }

    @Override
    protected void convertForUpdate(DppAnnualPhasingCostTabDetailsDTO dppAnnualPhasingCostTabDetailsDTO, DppAnnualPhasingCostTabDetails dppAnnualPhasingCostTabDetails) {
        dppAnnualPhasingCostTabDetails.setDppAnnualPhasingCost(dppAnnualPhasingCostRepository.findByIdAndIsDeleted(dppAnnualPhasingCostTabDetailsDTO.getDppAnnualPhasingCostId(), false).get());
        super.convertForUpdate(dppAnnualPhasingCostTabDetailsDTO, dppAnnualPhasingCostTabDetails);
    }

    @Override
    public List<DppAnnualPhasingCostTabDetailsDTO> getByDppAnnualPhasingCostId(Long id) {
        return convertForRead(repository.findByDppAnnualPhasingCostIdAndIsDeleted(id, false));
    }

    @Override
    public ResponseEntity<List<DppAnnualPhasingCostTabDetailsDTO>> getByProjectConceptIdAndIsMajor(Long pcId, Boolean isMajor) {
        List<DppAnnualPhasingCostTabDetails> dppAnnualPhasingCostTabDetailsList = repository.findAllByProjectConceptIdAndIsMajor(pcId, isMajor);
        List<DppAnnualPhasingCostTabDetailsDTO> list = new ArrayList<>();
        if (!dppAnnualPhasingCostTabDetailsList.isEmpty()) {
            list = convertForRead(dppAnnualPhasingCostTabDetailsList);
            Map<Long, UnitType> unitTypeHashMap = configurationClientService.getUnitTypeByIdSet(new IdSetRequestBodyDTO() {
                {
                    setIds(dppAnnualPhasingCostTabDetailsList.stream().map(DppAnnualPhasingCostTabDetails::getUnitId).collect(Collectors.toSet()));
                }
            }).stream().collect(Collectors.toMap(UnitType::getId, a -> a));
            list.forEach(e -> {
                e.setUnitTypeDTO(unitTypeHashMap.get(e.getUnitId()));
            });
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}


