package com.ibcs.idsdp.rdpprtapp.services;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappFinancingAndExpectation;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappFinancingAndExpectationRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappFinancingAndExpectationDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
@Transactional
public class TappFinancingAndExpectationServiceImp extends BaseService<TappFinancingAndExpectation, TappFinancingAndExpectationDTO> implements TappFinancingAndExpectationService {

    private final TappFinancingAndExpectationRepository tappFinancingAndExpectationRepository;
    private final TappObjectiveCostRepository masterRepo;
    private final IdGeneratorComponent idGeneratorComponent;

    public TappFinancingAndExpectationServiceImp(ServiceRepository<TappFinancingAndExpectation> repository, TappFinancingAndExpectationRepository tappFinancingAndExpectationRepository, TappObjectiveCostRepository masterRepo, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.tappFinancingAndExpectationRepository = tappFinancingAndExpectationRepository;
        this.masterRepo = masterRepo;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    @Override
    public TappFinancingAndExpectation saveFinancingExpectation(TappFinancingAndExpectationDTO dto) {
        TappFinancingAndExpectation expectation = new TappFinancingAndExpectation();

        expectation.setCreatedBy("admin");
        expectation.setCreatedOn(LocalDate.now());
        expectation.setIsDeleted(false);
        expectation.setUuid(idGeneratorComponent.generateUUID());
        expectation.setModeFinancing(dto.getModeFinancing());
        expectation.setOutcome(dto.getOutcome());
        expectation.setPcMasterId(dto.getPcMasterId());
        expectation.setPcUuid(dto.getPcUuid());
        expectation.setRequiredAmount(dto.getRequiredAmount());
        expectation.setSourceFinancing(dto.getSourceFinancing());
        expectation.setTappMasterId(masterRepo.findByProjectConceptUuidAndIsDeleted(dto.getPcUuid(), false).get());
        tappFinancingAndExpectationRepository.save(expectation);
        return null;
    }

    public ResponseWithResults getFinancingExpectation(String pcUuid){
        Optional<TappFinancingAndExpectation> optional = tappFinancingAndExpectationRepository.findByPcUuid(pcUuid);
        if(!optional.isPresent()){
            return new ResponseWithResults(0, "Not Found","");
        }else{
            TappFinancingAndExpectation expectation = optional.get();
            TappFinancingAndExpectationDTO dto = new TappFinancingAndExpectationDTO();
            BeanUtils.copyProperties(expectation, dto);
            return new ResponseWithResults(1, "Success", dto);
        }
    }

    @Override
    public TappFinancingAndExpectation updateFinancingExpectation(TappFinancingAndExpectationDTO dto, String pcUuid) {
            Optional<TappFinancingAndExpectation> optional = tappFinancingAndExpectationRepository.findByPcUuid(pcUuid);
            if(!optional.isPresent()){
                throw new RuntimeException("Not Found");
            }else{
                TappFinancingAndExpectation expectation = optional.get();
                BeanUtils.copyProperties(dto, expectation);
                expectation.setUpdatedBy("admin");
                expectation.setUpdatedOn(LocalDate.now());
                tappFinancingAndExpectationRepository.save(expectation);
                return null;
            }

    }
}


