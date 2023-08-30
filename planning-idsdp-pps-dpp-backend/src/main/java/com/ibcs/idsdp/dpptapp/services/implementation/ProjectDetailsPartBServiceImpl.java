package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.dpptapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.ProjectDetailsPartBRepository;
import com.ibcs.idsdp.dpptapp.services.ProjectDetailsPartBService;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectDetailsPartBRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectDetailsPartBResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class ProjectDetailsPartBServiceImpl implements ProjectDetailsPartBService {

    ProjectDetailsPartBRepository projectDetailsPartBRepository;
    IdGeneratorComponent idGeneratorComponent;
    DppObjectiveCostRepository masterTableRepo;

    // For create Project Details Part B
    @Override
    public ProjectDetailsPartBResponse saveProjectDetailsPartB(ProjectDetailsPartBRequest projectDetailsPartBRequest) {
        String uuid = idGeneratorComponent.generateUUID();
        ProjectDetailsPartB projectDetailsPartB = new ProjectDetailsPartB();
        BeanUtils.copyProperties(projectDetailsPartBRequest, projectDetailsPartB);
        projectDetailsPartB.setCreatedBy("admin");
        projectDetailsPartB.setObjectiveCost(masterTableRepo.findByProjectConceptUuid(projectDetailsPartBRequest.getProjectConceptUuid()));
        projectDetailsPartB.setCreatedOn(LocalDate.now());
        projectDetailsPartB.setUuid(uuid);
        projectDetailsPartB.setIsDeleted(false);
        ProjectDetailsPartB newProjectDetailsPartB = projectDetailsPartBRepository.save(projectDetailsPartB);
        ProjectDetailsPartBResponse projectDetailsPartBResponse = new ProjectDetailsPartBResponse();
        BeanUtils.copyProperties(newProjectDetailsPartB,projectDetailsPartBResponse);
        return projectDetailsPartBResponse;
    }

    // For get Project Details Part b find by uuid;
    @Override
    public ProjectDetailsPartBResponse getProjectDetailsPartB(String uuid) {
        ProjectDetailsPartB projectDetailsPartB = projectDetailsPartBRepository.findByUuid(uuid);
        if(projectDetailsPartB!=null){
            ProjectDetailsPartBResponse projectDetailsPartBResponse = new ProjectDetailsPartBResponse();
            BeanUtils.copyProperties(projectDetailsPartB,projectDetailsPartBResponse);
            return projectDetailsPartBResponse;
        }
        else
            return null;


    }

    // For get Projecdt Details part B find by project Id
    @Override
    public ProjectDetailsPartB getProjectDetailsByProjectId(String projectId) {
        return projectDetailsPartBRepository.findByProjectConceptUuid(projectId);
    }

    // For update Project Details Part b
    @Override
    public ProjectDetailsPartBResponse updateProjectDetails(ProjectDetailsPartBRequest partBRequest, String id) {
        // Get Project Details part b find by project id;
        Optional<ProjectDetailsPartB> partBOptional = projectDetailsPartBRepository.findAllByProjectConceptUuid(id);

        if (!partBOptional.isPresent()){
            throw new RuntimeException("Employee Not Found");
        }
        ProjectDetailsPartB partB = partBOptional.get();
        partB.setUpdatedBy("admin");
        partB.setUpdatedOn(LocalDate.now());
        partB.setIsDeleted(false);
        BeanUtils.copyProperties(partBRequest, partB);
        projectDetailsPartBRepository.save(partB);
        return null;
    }
}
