package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.WorkPlan;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.WorkPlanRepository;
import com.ibcs.idsdp.feasibilitystudy.services.WorkPlanService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.WorkPlanDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.WorkPlanDtoDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class WorkPlanServiceImp extends BaseService<WorkPlan, WorkPlanDTO> implements WorkPlanService {
    private WorkPlanRepository workPlanRepository;
    private IdGeneratorComponent idGeneratorComponent;

    protected WorkPlanServiceImp(WorkPlanRepository workPlanRepository, IdGeneratorComponent idGeneratorComponent) {
        super(workPlanRepository);
        this.workPlanRepository = workPlanRepository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    @Override
    public WorkPlanDTO createWorkPlan(WorkPlanDTO workPlanDTO, Long fspMasterId) {
        List<WorkPlanDtoDetails> workPlanDtoDetails = workPlanDTO.workPlanDtoDetails;
        for(WorkPlanDtoDetails workPlanList: workPlanDtoDetails) {
            String uuid = idGeneratorComponent.generateUUID();
            WorkPlan workPlan = new WorkPlan();
            workPlan.setIsDeleted(false);
            workPlan.setUuid(uuid);
            workPlan.setCreatedBy("user");
            workPlan.setCreatedOn(LocalDate.now());
            workPlan.setTaskDetails(workPlanList.getTaskDetails());
            workPlan.setStartDate(workPlanList.getStartDate());
            workPlan.setEndDate(workPlanList.getEndDate());
            workPlan.setCommitteeId(workPlanList.getCommitteeId());
            workPlan.setVendorId(workPlanList.getVendorId());
            workPlan.setStatus(workPlanList.getStatus());
            workPlan.setFspMasterId(fspMasterId);
            workPlanRepository.save(workPlan);
        }
        return null;
    }

    @Override
    public List<WorkPlanDtoDetails> getWorkPlanListByFspMasterId(Long fspMasterId) {
        List<WorkPlanDtoDetails> workPlanDtoDetails = new ArrayList<>();
        List<WorkPlan> workPlanList = workPlanRepository.findAllByFspMasterIdAndIsDeleted(fspMasterId, false);
        for(WorkPlan workPlan: workPlanList) {
            WorkPlanDtoDetails scope = new WorkPlanDtoDetails();
            scope.setTaskDetails(workPlan.getTaskDetails());
            scope.setStartDate(workPlan.getStartDate());
            scope.setEndDate(workPlan.getEndDate());
            scope.setCommitteeId(workPlan.getCommitteeId());
            scope.setVendorId(workPlan.getVendorId());
            scope.setStatus(workPlan.getStatus());
            scope.setFspMasterId(workPlan.getFspMasterId());
            scope.setUuid(workPlan.getUuid());
            workPlanDtoDetails.add(scope);
        }
        return workPlanDtoDetails;
    }

    @Override
    public WorkPlanDTO updateWorkPlan(WorkPlanDTO workPlanDTO, Long fspMasterId) {
        List<WorkPlanDtoDetails> workPlanDtoDetails = workPlanDTO.workPlanDtoDetails;
        for(WorkPlanDtoDetails scope: workPlanDtoDetails) {
            if(!scope.getUuid().isEmpty()) {
                Optional<WorkPlan> workPlanOptional = workPlanRepository.findByUuid(scope.getUuid());
                WorkPlan workPlan = workPlanOptional.get();
                workPlan.setTaskDetails(scope.getTaskDetails());
                workPlan.setStartDate(scope.getStartDate());
                workPlan.setEndDate(scope.getEndDate());
                workPlan.setCommitteeId(scope.getCommitteeId());
                workPlan.setVendorId(scope.getVendorId());
                workPlan.setStatus(scope.getStatus());
                workPlanRepository.save(workPlan);
            } else {
                String uuid = idGeneratorComponent.generateUUID();
                WorkPlan workPlan = new WorkPlan();
                workPlan.setIsDeleted(false);
                workPlan.setUuid(uuid);
                workPlan.setCreatedBy("user");
                workPlan.setCreatedOn(LocalDate.now());
                workPlan.setTaskDetails(scope.getTaskDetails());
                workPlan.setStartDate(scope.getStartDate());
                workPlan.setEndDate(scope.getEndDate());
                workPlan.setCommitteeId(scope.getCommitteeId());
                workPlan.setVendorId(scope.getVendorId());
                workPlan.setStatus(scope.getStatus());
                workPlan.setFspMasterId(fspMasterId);
                workPlanRepository.save(workPlan);
            }
        }
        return null;
    }
}
