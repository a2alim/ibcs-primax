package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.model.domain.StCategoryWiseActionPlan;
import com.ibcs.idsdp.rpm.model.repositories.StCategoryWiseActionPlanRepository;
import com.ibcs.idsdp.rpm.services.StCategoryWiseActionPlanService;
import com.ibcs.idsdp.rpm.web.dto.request.StCategoryWiseActionPlanRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.StCategoryWiseActionPlanResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StCategoryWiseActionPlanServiceImpl extends BaseService<StCategoryWiseActionPlan, StCategoryWiseActionPlanRequestDto, StCategoryWiseActionPlanResponseDto> implements StCategoryWiseActionPlanService {
    private final StCategoryWiseActionPlanRepository stCategoryWiseActionPlanRepository;

    protected StCategoryWiseActionPlanServiceImpl(StCategoryWiseActionPlanRepository stCategoryWiseActionPlanRepository) {
        super(stCategoryWiseActionPlanRepository);
        this.stCategoryWiseActionPlanRepository = stCategoryWiseActionPlanRepository;
    }

    @Override
    public Response saveActionPlanName(StCategoryWiseActionPlanRequestDto requestDto) {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder
                .getContext().getAuthentication().getDetails()).getDecodedDetails();
        Response<StCategoryWiseActionPlan> response = new Response<>();

        try{
            if(requestDto.getId() == null)
            {
                StCategoryWiseActionPlan stCategoryWiseActionPlan = new StCategoryWiseActionPlan();
                BeanUtils.copyProperties(requestDto, stCategoryWiseActionPlan);
                stCategoryWiseActionPlan.setIsActive(true);
                stCategoryWiseActionPlan.setUuid(UUID.randomUUID().toString());
                stCategoryWiseActionPlan.setCreatedBy(accessTokenDetail.getId());
                stCategoryWiseActionPlan.setCreatedOn(LocalDate.now());
                stCategoryWiseActionPlan.setIsDeleted(false);

                stCategoryWiseActionPlanRepository.save(stCategoryWiseActionPlan);
                response.setMessage("Saved successfully");
                response.setObj(stCategoryWiseActionPlan);
                response.setSuccess(true);
            }
            else{
                Optional<StCategoryWiseActionPlan> planData = stCategoryWiseActionPlanRepository.findByIdAndIsDeleted(requestDto.getId(), false);
                StCategoryWiseActionPlan actionPlan = planData.get();

                BeanUtils.copyProperties(requestDto, actionPlan);
                actionPlan.setIsActive(true);
                actionPlan.setUpdatedBy(accessTokenDetail.getId());
                actionPlan.setUpdatedOn(LocalDate.now());
                actionPlan.setIsDeleted(false);

                stCategoryWiseActionPlanRepository.save(actionPlan);
                response.setMessage("Updated successfully");
                response.setObj(actionPlan);
                response.setSuccess(true);
            }

        } catch (Exception e) {
            response.setMessage("Saved failed");
            response.setSuccess(false);
        }
        return response;
    }

    @Override
    public Response deleteActionPlanName(Long actionPlanId) {
        Response<StCategoryWiseActionPlan> response = new Response<>();
        try{
            stCategoryWiseActionPlanRepository.deleteById(actionPlanId);
            response.setMessage("Deleted successfully");
            response.setSuccess(true);
        } catch (Exception e) {
            response.setMessage("Delete failed");
            response.setSuccess(false);
        }
        return response;
    }

    @Override
    public Response<StCategoryWiseActionPlanResponseDto> getActionPlanByCatId(Long stFiscalYearId, Long stResearchCatId) {
        Response<StCategoryWiseActionPlanResponseDto> response = new Response<>();
        try{
            List<StCategoryWiseActionPlan> actionPlanList = stCategoryWiseActionPlanRepository.findAllByStFiscalYearIdAndStResearchCategoryTypeIdAndIsActiveAndIsDeleted(stFiscalYearId, stResearchCatId, true, false);
            response.setMessage("Updated successfully");
            response.setItems(convertForRead(actionPlanList));
            response.setSuccess(true);
        } catch (Exception e){
            response.setMessage("Data not found!");
            response.setSuccess(false);
        }
        return response;
    }

    @Override
    public Page<StCategoryWiseActionPlan> getAll(int offset, int pageSize) {
        return stCategoryWiseActionPlanRepository.findAllByIsDeletedOrderByIdDesc(false,
                PageRequest.of(offset, pageSize));
    }


}
