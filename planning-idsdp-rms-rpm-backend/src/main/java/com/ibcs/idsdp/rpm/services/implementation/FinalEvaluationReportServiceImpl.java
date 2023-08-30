package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.FinalEvaluationReport;
import com.ibcs.idsdp.rpm.model.repositories.FinalEvaluationReportRepository;
import com.ibcs.idsdp.rpm.services.FinalEvaluationReportService;
import com.ibcs.idsdp.rpm.web.dto.request.FinalEvaluationReportRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FinalEvaluationReportResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.util.List;


@Service
@Transactional
public class FinalEvaluationReportServiceImpl extends BaseService<FinalEvaluationReport, FinalEvaluationReportRequestDto, FinalEvaluationReportResponseDto> implements FinalEvaluationReportService {

    private final FinalEvaluationReportRepository finalEvaluationReportRepository;

    public FinalEvaluationReportServiceImpl(ServiceRepository<FinalEvaluationReport> repository, FinalEvaluationReportRepository finalEvaluationReportRepository) {
        super(repository);
        this.finalEvaluationReportRepository = finalEvaluationReportRepository;
    }

    @Override
    public Response<FinalEvaluationReportResponseDto> createOrUpdate(FinalEvaluationReportRequestDto finalEvaluationReportRequestDto) {

        Boolean isExists = isExistsBeforeSave("m2_final_evaluation_report_of_research", "uuid", finalEvaluationReportRequestDto.getUuid());
        if (!isExists) {
            return create(finalEvaluationReportRequestDto);
        }else{
            return update(finalEvaluationReportRequestDto);
        }
    }

    @Override
    public Response<FinalEvaluationReport> findAll(boolean isDeleted, boolean isActive) {

        Response<FinalEvaluationReport> response = new Response();
        List<FinalEvaluationReport> list = finalEvaluationReportRepository.findAllByIsDeletedAndIsActive(isDeleted, isActive);
        if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
            response.setItems(list);
            return getSuccessResponse("Data Found!", response);
        }
        return getErrorResponse("Data Not Found!");
    }


}
