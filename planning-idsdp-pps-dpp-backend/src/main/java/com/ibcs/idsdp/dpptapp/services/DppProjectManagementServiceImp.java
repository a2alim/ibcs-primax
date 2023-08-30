package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppProjectManagement;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppProjectManagementRepository;
import com.ibcs.idsdp.dpptapp.web.dto.DppProjectManagementDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppProjectManagementResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class DppProjectManagementServiceImp extends BaseService<DppProjectManagement, DppProjectManagementDTO> implements DppProjectManagementService {

    private final DppProjectManagementRepository dppProjectManagementRepository;
    private final DppObjectiveCostRepository dppObjectiveCostRepository;


    public DppProjectManagementServiceImp(DppProjectManagementRepository dppProjectManagementRepository,
                                          DppObjectiveCostRepository dppObjectiveCostRepository) {
        super(dppProjectManagementRepository);
        this.dppProjectManagementRepository = dppProjectManagementRepository;
        this.dppObjectiveCostRepository = dppObjectiveCostRepository;
    }

    /**
     * convertForCreate for using base method
     * @param dppProjectManagementDTO
     * @return
     */
    @Override
    protected DppProjectManagement convertForCreate(DppProjectManagementDTO dppProjectManagementDTO) {
        DppProjectManagement dppProjectManagement = super.convertForCreate(dppProjectManagementDTO);
        dppProjectManagement.setDppMasterId(dppObjectiveCostRepository.findByProjectConceptUuid(dppProjectManagementDTO.getProjectConceptUuid()));
        dppProjectManagement.setProjectConceptMasterId(dppProjectManagementDTO.getProjectConceptMasterId());
        dppProjectManagement.setProjectConceptUuid(dppProjectManagementDTO.getProjectConceptUuid());
        return dppProjectManagement;
    }

//    @Override
//    public ResponseEntity<List<LogFrameDTO>> getActiveDivision() {
//        return new ResponseEntity(divisionRepository.findAllByStatusAndIsDeleted(TRUE, TRUE), HttpStatus.OK);
//    }

    /**
     * Get Project Management By Pcid
     * @param pcUuid
     * @return
     */
    @Override
    public DppProjectManagementResponse getProjectManagementByPcUuid(String pcUuid) {
        try {
            Optional<DppProjectManagement> dppProjectManagement = dppProjectManagementRepository.findAllByProjectConceptUuid(pcUuid);

            if(!dppProjectManagement.isPresent()){
                return null;
            }else {
                DppProjectManagement management = dppProjectManagement.get();
                DppProjectManagementResponse response = new DppProjectManagementResponse();
                response.setImplementationArrangement(management.getImplementationArrangement());
                response.setRevenueBudget(management.getRevenueBudget());
                response.setRevenueBudget2(management.getRevenueBudget2());
                response.setUuid(management.getUuid());
                response.setIsTransferableToRevenueBudget(management.getIsTransferableToRevenueBudget());
                return response;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

   public DppProjectManagementResponse updateProjectManagement(DppProjectManagementResponse response, String pcUuid){
        try {
            Optional<DppProjectManagement> optional = dppProjectManagementRepository.findAllByProjectConceptUuid(pcUuid);
            if(!optional.isPresent()){
                return null;
            }else {
                DppProjectManagement management = optional.get();
                management.setUpdatedBy("admin");
                management.setUpdatedOn(LocalDate.now());
                management.setRevenueBudget(response.getRevenueBudget());
                management.setRevenueBudget2(response.getRevenueBudget2());
                management.setImplementationArrangement(response.getImplementationArrangement());
                management.setUuid(response.getUuid());
                management.setIsTransferableToRevenueBudget(response.getIsTransferableToRevenueBudget());
                dppProjectManagementRepository.save(management);
                return response;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}


