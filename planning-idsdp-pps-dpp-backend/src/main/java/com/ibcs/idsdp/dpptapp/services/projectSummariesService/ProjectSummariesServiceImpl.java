package com.ibcs.idsdp.dpptapp.services.projectSummariesService;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.projectSummaries.ProjectSummaries;
import com.ibcs.idsdp.dpptapp.model.domain.projectSummaries.YearWiseCost;
import com.ibcs.idsdp.dpptapp.model.repositories.projectSummariesRepository.ProjectSummariesRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.projectSummariesRepository.YearWiseCostRepository;
import com.ibcs.idsdp.dpptapp.web.dto.request.projectSummariesDto.ProjectSummariesDto;
import com.ibcs.idsdp.dpptapp.web.dto.request.projectSummariesDto.YearWiseCostDto;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class ProjectSummariesServiceImpl implements ProjectSummariesService{

    private final ProjectSummariesRepository repository;
    private final YearWiseCostRepository costRepository;
    private final IdGeneratorComponent idGeneratorComponent;

    @Override
    public ProjectSummariesDto createProjectSummaries(ProjectSummariesDto request) {

        try{
            String uuid = idGeneratorComponent.generateUUID();
            ProjectSummaries summaries = new ProjectSummaries();
            BeanUtils.copyProperties(request, summaries);
            summaries.setCreatedBy("user");
            summaries.setCreatedOn(LocalDate.now());
            summaries.setIsDeleted(false);
            summaries.setUuid(uuid);
            List<YearWiseCost> yearWiseCostList = new ArrayList<>();
            List<YearWiseCostDto> dto = request.getYearWiseCostList();
            for(YearWiseCostDto res : dto){
                YearWiseCost yearWiseCost = new YearWiseCost();
                BeanUtils.copyProperties(res, yearWiseCost);
                yearWiseCost.setCreatedBy("user");
                yearWiseCost.setCreatedOn(LocalDate.now());
                yearWiseCost.setIsDeleted(false);
                yearWiseCost.setUuid(idGeneratorComponent.generateUUID());
                yearWiseCostList.add(yearWiseCost);
            }
            summaries.setYearWiseCostList(yearWiseCostList);
            repository.save(summaries);
        }catch (Exception e){
            System.out.println(e);
        }

        return request;
    }

    @Transactional
    @Override
    public ProjectSummariesDto updateProjectSummaries(ProjectSummariesDto dto, String projectUuid, String summariesType) {
            ProjectSummaries summaries = new ProjectSummaries();
            BeanUtils.copyProperties(dto, summaries);
            summaries.setUpdatedOn(LocalDate.now());
            summaries.setUpdatedBy("admin");
            summaries.setId(dto.getId());

            List<YearWiseCost> yearWiseCostList = new ArrayList<>();
            List<YearWiseCostDto> dtos= dto.getYearWiseCostList();
            for(YearWiseCostDto res : dtos){
                YearWiseCost yearWiseCost = new YearWiseCost();
                yearWiseCost.setUpdatedBy("user");
                yearWiseCost.setUpdatedOn(LocalDate.now());
                yearWiseCost.setIsDeleted(false);
                BeanUtils.copyProperties(res, yearWiseCost);
                yearWiseCostList.add(yearWiseCost);
            }
            summaries.setYearWiseCostList(yearWiseCostList);
            repository.save(summaries);
        return dto;
    }

    @Transactional
    @Override
    public ResponseWithResults getProjectSummaries(String pcUuid, String summariesType) {
        ProjectSummaries projectSummaries = repository.findByProjectUuidAndSummariesType(pcUuid, summariesType);
        if(projectSummaries == null){
            return new ResponseWithResults(0, "Failed", "Please Save Data");
        }
        ProjectSummariesDto dto = new ProjectSummariesDto();
        BeanUtils.copyProperties(projectSummaries, dto);
        List<YearWiseCostDto> costList = new ArrayList<>();
        for(YearWiseCost cost: projectSummaries.getYearWiseCostList()){
            YearWiseCostDto costDto = new YearWiseCostDto();
            BeanUtils.copyProperties(cost, costDto);
            costList.add(costDto);
        }
        dto.setYearWiseCostList(costList);
        return new ResponseWithResults(1, "Success", dto);
    }

    @Override
    public List<YearWiseCost> getYearWiseCost(Long id) {
        return null;
    }
}
