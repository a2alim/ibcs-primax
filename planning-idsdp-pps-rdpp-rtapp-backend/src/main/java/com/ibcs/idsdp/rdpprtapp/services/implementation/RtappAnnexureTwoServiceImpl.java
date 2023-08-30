package com.ibcs.idsdp.rdpprtapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.RtappAnnexureTwo;
import com.ibcs.idsdp.rdpprtapp.model.repositories.RtappAnnexureTwoRepository;
import com.ibcs.idsdp.rdpprtapp.services.RtappAnnexureTwoService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.RtappAnnexureTwoDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.RtappAnnexureTwoResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class RtappAnnexureTwoServiceImpl extends BaseService<RtappAnnexureTwo, RtappAnnexureTwoDto> implements RtappAnnexureTwoService {

    private final RtappAnnexureTwoRepository rtappAnnexureTwoRepository;
    private final IdGeneratorComponent idGeneratorComponent;

    public RtappAnnexureTwoServiceImpl(ServiceRepository<RtappAnnexureTwo> repository, RtappAnnexureTwoRepository rtappAnnexureTwoRepository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.rtappAnnexureTwoRepository = rtappAnnexureTwoRepository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    @Override
    public ResponseWithResults getAllWorkPlan(Long rtappMasterId) {
        List<RtappAnnexureTwo> workPlanList = rtappAnnexureTwoRepository.findAllByRtappMasterIdAndIsDeleted(rtappMasterId, false);
        List<RtappAnnexureTwoResponseDto> finalWorkPlanList = new ArrayList<>();
        workPlanList.forEach(workPlan -> {
            RtappAnnexureTwoResponseDto pmWorkPlanResponseDto = new RtappAnnexureTwoResponseDto();
            BeanUtils.copyProperties(workPlan, pmWorkPlanResponseDto);
            finalWorkPlanList.add(pmWorkPlanResponseDto);
        });
        if (finalWorkPlanList.size() > 0) {
            return new ResponseWithResults(1, "Work Plan Data Found", finalWorkPlanList);
        } else {
            return new ResponseWithResults(0, "Work Plan Data not Found", "");
        }
    }

    @Override
    public ResponseWithResults saveWorkPlanList(List<RtappAnnexureTwoDto> pmWorkPlanRequestDtoList) {

        try {
            for (RtappAnnexureTwoDto workPlanReqObj : pmWorkPlanRequestDtoList) {
                RtappAnnexureTwo pmWorkPlan = new RtappAnnexureTwo();

                BeanUtils.copyProperties(workPlanReqObj, pmWorkPlan);

                if (StringUtils.isEmpty(workPlanReqObj.getUuid())) {

                    /*------New data will be save into the database table------*/
                    pmWorkPlan.setUuid(UUID.randomUUID().toString());
                    pmWorkPlan.setCreatedBy("admin");
                    pmWorkPlan.setCreatedOn(LocalDate.now());
                    pmWorkPlan.setIsDeleted(false);
                    rtappAnnexureTwoRepository.save(pmWorkPlan);
                } else {

                    /*------If there is already data into the database table then will be update------*/
                    Optional<RtappAnnexureTwo> workPlanOptional = rtappAnnexureTwoRepository.findByUuidAndIsDeleted(workPlanReqObj.getUuid(), false);

                    if (workPlanOptional.get() != null) {

                        pmWorkPlan.setCreatedBy(workPlanOptional.get().getCreatedBy());
                        pmWorkPlan.setCreatedOn(workPlanOptional.get().getCreatedOn());
                        pmWorkPlan.setUpdatedBy("admin");
                        pmWorkPlan.setUpdatedOn(LocalDate.now());
                        pmWorkPlan.setIsDeleted(false);
                        rtappAnnexureTwoRepository.save(pmWorkPlan);
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

        Optional<RtappAnnexureTwo> workPlanOptional = rtappAnnexureTwoRepository.findById(id);
        if (workPlanOptional.isPresent()) {
            RtappAnnexureTwo pmWorkPlan = workPlanOptional.get();
            pmWorkPlan.setIsDeleted(true);
            pmWorkPlan.setUpdatedOn(LocalDate.now());
            pmWorkPlan.setUpdatedBy("admin");
            rtappAnnexureTwoRepository.save(pmWorkPlan);
            return new ResponseWithResults(1, "Work Plan Delete Successfully.", "");
        } else {
            return new ResponseWithResults(0, "Work Plan Delete Failed!", "");
        }
    }

}
