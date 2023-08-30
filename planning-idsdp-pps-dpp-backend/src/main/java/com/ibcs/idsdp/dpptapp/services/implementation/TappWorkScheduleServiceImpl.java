package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TappWorkSchedule;
import com.ibcs.idsdp.dpptapp.model.repositories.TappWorkScheduleRepository;
import com.ibcs.idsdp.dpptapp.services.TappWorkScheduleService;
import com.ibcs.idsdp.dpptapp.web.dto.TappWorkScheduleDto;
import com.ibcs.idsdp.dpptapp.web.dto.response.TappWorkScheduleResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Slf4j
@Service
@Transactional
public class TappWorkScheduleServiceImpl extends BaseService<TappWorkSchedule, TappWorkScheduleDto> implements TappWorkScheduleService {

    private final TappWorkScheduleRepository tappWorkScheduleRepository;
    private final IdGeneratorComponent idGeneratorComponent;

    public TappWorkScheduleServiceImpl(ServiceRepository<TappWorkSchedule> repository, TappWorkScheduleRepository tappWorkScheduleRepository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.tappWorkScheduleRepository = tappWorkScheduleRepository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    @Override
    public ResponseWithResults getAllWorkPlan(Long rtappMasterId) {
        List<TappWorkSchedule> workPlanList = tappWorkScheduleRepository.findAllByTappMasterIdAndIsDeletedOrderById(rtappMasterId, false);
        List<TappWorkScheduleResponseDto> finalWorkPlanList = new ArrayList<>();
        workPlanList.forEach(workPlan -> {
            TappWorkScheduleResponseDto pmWorkPlanResponseDto = new TappWorkScheduleResponseDto();
            BeanUtils.copyProperties(workPlan, pmWorkPlanResponseDto);
            finalWorkPlanList.add(pmWorkPlanResponseDto);
        });
        if (finalWorkPlanList.size() > 0) {
            return new ResponseWithResults(1, "Work Plan Data Found", finalWorkPlanList);
        } else {
            return new ResponseWithResults(0, "Work Plan Data not Found", "");
        }
    }

    /**
     *
     * @param pmWorkPlanRequestDtoList
     * @return
     */
    @Override
    public ResponseWithResults saveWorkPlanList(List<TappWorkScheduleDto> pmWorkPlanRequestDtoList) {

        try {
            for (TappWorkScheduleDto workPlanReqObj : pmWorkPlanRequestDtoList) {
                TappWorkSchedule pmWorkPlan = new TappWorkSchedule();

                BeanUtils.copyProperties(workPlanReqObj, pmWorkPlan);

                if (StringUtils.isEmpty(workPlanReqObj.getUuid())) {

                    /*------New data will be save into the database table------*/
                    pmWorkPlan.setUuid(UUID.randomUUID().toString());
                    pmWorkPlan.setCreatedBy("admin");
                    pmWorkPlan.setCreatedOn(LocalDate.now());
                    pmWorkPlan.setIsDeleted(false);
                    tappWorkScheduleRepository.save(pmWorkPlan);
                } else {

                    /*------If there is already data into the database table then will be update------*/
                    Optional<TappWorkSchedule> workPlanOptional = tappWorkScheduleRepository.findByUuidAndIsDeleted(workPlanReqObj.getUuid(), false);

                    if (workPlanOptional.get() != null) {

                        pmWorkPlan.setCreatedBy(workPlanOptional.get().getCreatedBy());
                        pmWorkPlan.setCreatedOn(workPlanOptional.get().getCreatedOn());
                        pmWorkPlan.setUpdatedBy("admin");
                        pmWorkPlan.setUpdatedOn(LocalDate.now());
                        pmWorkPlan.setIsDeleted(false);
                        tappWorkScheduleRepository.save(pmWorkPlan);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseWithResults(0, "Save Failed!", pmWorkPlanRequestDtoList);
        }
        return new ResponseWithResults(1, "Work Plan Save Successfully!", pmWorkPlanRequestDtoList);
    }

    @Override
    public ResponseWithResults deleteWorkPlan(Long id) {

        Optional<TappWorkSchedule> workPlanOptional = tappWorkScheduleRepository.findById(id);
        if (workPlanOptional.isPresent()) {
            TappWorkSchedule pmWorkPlan = workPlanOptional.get();
            pmWorkPlan.setIsDeleted(true);
            pmWorkPlan.setUpdatedOn(LocalDate.now());
            pmWorkPlan.setUpdatedBy("admin");
            tappWorkScheduleRepository.save(pmWorkPlan);
            return new ResponseWithResults(1, "Work Plan Delete Successfully.", "");
        } else {
            return new ResponseWithResults(0, "Work Plan Delete Failed!", "");
        }
    }

}
