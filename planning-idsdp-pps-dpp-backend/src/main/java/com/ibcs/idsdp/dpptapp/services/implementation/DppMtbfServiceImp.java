package com.ibcs.idsdp.dpptapp.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.model.domain.DppMtbf;
import com.ibcs.idsdp.dpptapp.model.domain.DppMtbfFiscalYearDetail;
import com.ibcs.idsdp.dpptapp.model.repositories.DppMtbfRepository;
import com.ibcs.idsdp.dpptapp.services.DppMtbfService;
import com.ibcs.idsdp.dpptapp.services.DppObjectiveCostServiceImp;
import com.ibcs.idsdp.dpptapp.web.dto.DppMtbfDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppMtbfFiscalYearDetailDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppObjectiveCostDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DppMtbfServiceImp extends BaseService<DppMtbf, DppMtbfDTO> implements DppMtbfService {

    private final DppMtbfRepository dppMtbfRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final DppMtbfFiscalYearDetailServiceImp mtbfDetailService;
    private final DppObjectiveCostServiceImp dppObjectiveCostService;
    private final ProjectConceptClientService projectConceptClientService;

    public DppMtbfServiceImp(DppMtbfRepository dppMtbfRepository, IdGeneratorComponent idGeneratorComponent,
                             DppMtbfFiscalYearDetailServiceImp mtbfDetailService, DppObjectiveCostServiceImp dppObjectiveCostService,
                             ProjectConceptClientService projectConceptClientService) {
        super(dppMtbfRepository);
        this.dppMtbfRepository = dppMtbfRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.mtbfDetailService = mtbfDetailService;
        this.dppObjectiveCostService = dppObjectiveCostService;
        this.projectConceptClientService = projectConceptClientService;
    }

    @Override
    protected DppMtbf convertForCreate(DppMtbfDTO dto) {
        DppMtbf entity = super.convertForCreate(dto);
        List<DppMtbf> list = dppMtbfRepository.findAllByProjectConceptUuidAndIsDeleted(dto.getProjectConceptUuid(), false);
        if (list.size()>0) throw new RuntimeException("Already exist with the project concept id");
        List<DppMtbfFiscalYearDetail> mtbfFiscalYearDetailList = entity.getMtbfFiscalYearDetailList().stream()
                .map(dppMtbfFiscalYearDetail -> {
                    dppMtbfFiscalYearDetail.setIsDeleted(false);
                    dppMtbfFiscalYearDetail.setUuid(idGeneratorComponent.generateUUID());
                    dppMtbfFiscalYearDetail.setCreatedOn(LocalDate.now());
                    dppMtbfFiscalYearDetail.setUpdatedBy("");
                    return dppMtbfFiscalYearDetail;
                }).collect(Collectors.toList());
        entity.setMtbfFiscalYearDetailList(mtbfFiscalYearDetailList);

        return entity;
    }

    @Override
    protected void convertForUpdate(DppMtbfDTO dto, DppMtbf entity) {
        BeanUtils.copyProperties(dto, entity);
        List<DppMtbfFiscalYearDetail> detailList = new ArrayList<>();
        for (DppMtbfFiscalYearDetailDTO detailDTO : dto.getMtbfFiscalYearDetailList()) {
            DppMtbfFiscalYearDetail detail = new DppMtbfFiscalYearDetail();
            if (detailDTO.getUuid() == null)
                throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("No Id Provided for DppMtbfFiscalYearDetail");
            detail = mtbfDetailService.getByUuidForRead(detailDTO.getUuid());
            detailDTO.setId(detail.getId());
            BeanUtils.copyProperties(detailDTO, detail);
            detail.setIsDeleted(false);
            detail.setCreatedBy(detail.getCreatedBy());
            detail.setCreatedOn(detail.getCreatedOn());
            detail.setUpdatedOn(LocalDate.now());
            detailList.add(detail);
        }
        entity.setMtbfFiscalYearDetailList(detailList);
    }

    @Override
    public DppMtbfDTO getDppMtbfByPcUuid(String pcUuid) {
        List<DppMtbf> list = dppMtbfRepository.findAllByProjectConceptUuidAndIsDeleted(pcUuid, false);
        if (list.size()>0){
            DppMtbfDTO dppMtbfDTO = convertForRead(list.get(0));
            Collections.sort(dppMtbfDTO.getMtbfFiscalYearDetailList(), Comparator.comparing(DppMtbfFiscalYearDetailDTO::getId));
            return dppMtbfDTO;
        } else {
            //List<String> fiscalYearList = getFiscalYearList(pcUuid);
            List<String> fiscalYearList;
            ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptMasterId(pcUuid);
            if (pcInfo.getIsForeignAid()) {
                fiscalYearList = List.of(new String[]{"Current FY", "Next 1st FY", "Next 2nd FY"});
            } else {
                fiscalYearList = List.of(new String[]{"চলতি অর্থ বছর", "পরবর্তী ১ম অর্থ বছর", "পরবর্তী ২য় অর্থ বছর"});
            }

            DppMtbfDTO dppMtbfDTO = new DppMtbfDTO();
            dppMtbfDTO.setNumberOfOngoingProject(null);
            dppMtbfDTO.setNumberOfApprovedProject(null);
            dppMtbfDTO.setNumberOfRecommendedProject(null);
            List<DppMtbfFiscalYearDetailDTO> mtbfFiscalYearDetailList = new ArrayList<>();
            for (String fiscalYear : fiscalYearList) {
                DppMtbfFiscalYearDetailDTO detail = new DppMtbfFiscalYearDetailDTO();
                detail.setFiscalYear(fiscalYear);
                mtbfFiscalYearDetailList.add(detail);
            }
            dppMtbfDTO.setMtbfFiscalYearDetailList(mtbfFiscalYearDetailList);
            return dppMtbfDTO;
        }
    }

    private List<String> getFiscalYearList(String pcUuid) {
        List<String> fiscalYearList = new ArrayList<>();
        DppObjectiveCostDTO objectiveCost = dppObjectiveCostService.getObjectiveCostByPcUuid(pcUuid);

        int fYear = objectiveCost.getDateCommencement().getYear();
        int lYear = objectiveCost.getDateCompletion().getYear();

        if (objectiveCost.getDateCommencement().getMonthValue() < 6) {
            fYear = objectiveCost.getDateCommencement().getYear() - 1;
        }
        if (objectiveCost.getDateCompletion().getMonthValue() > 6) {
            lYear = objectiveCost.getDateCompletion().getYear() + 1;
        }

        int total = lYear - fYear;
        int startingYear = fYear;

        while (total > 0) {
            int nextYear = (startingYear + 1);
            fiscalYearList.add(startingYear + "-" + nextYear);
            startingYear += 1;
            total -= 1;
        }

        return fiscalYearList;
    }
}


