package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalActionPlan;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalActionPlanRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalActionPlanService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalActionPlanRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalActionPlanResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManagerFactory;
import java.io.Reader;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class ResearcherProposalActionPlanServiceImpl extends
		BaseService<ResearcherProposalActionPlan, ResearcherProposalActionPlanRequestDto, ResearcherProposalActionPlanResponseDto>
		implements ResearcherProposalActionPlanService {

	private final ResearcherProposalActionPlanRepository repository;
	private final ResearcherProposalRepository researcherProposalRepository;
	@Autowired
	private EntityManagerFactory entityManagerFactory;

	protected ResearcherProposalActionPlanServiceImpl(ServiceRepository<ResearcherProposalActionPlan> repository, ResearcherProposalActionPlanRepository repository1, ResearcherProposalRepository researcherProposalRepository) {
		super(repository);
		this.repository = repository1;
		this.researcherProposalRepository = researcherProposalRepository;
	}

	@Override
	protected ResearcherProposalActionPlan convertForCreate(ResearcherProposalActionPlanRequestDto researcherProposalActionPlanRequestDto) {
		ResearcherProposalActionPlan researcherProposalActionPlan = super.convertForCreate(researcherProposalActionPlanRequestDto);
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalActionPlanRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProposalActionPlan.setResearcherProposal(researcherProposal.get());
		return researcherProposalActionPlan;
	}

	@Override
	protected void convertForUpdate(ResearcherProposalActionPlanRequestDto researcherProposalActionPlanRequestDto, ResearcherProposalActionPlan researcherProposalActionPlan) {
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalActionPlanRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProposalActionPlan.setResearcherProposal(researcherProposal.get());
		super.convertForUpdate(researcherProposalActionPlanRequestDto, researcherProposalActionPlan);
	}

	@Override
	protected ResearcherProposalActionPlanResponseDto convertForRead(ResearcherProposalActionPlan researcherProposalActionPlan) {
		ResearcherProposalActionPlanResponseDto dto = super.convertForRead(researcherProposalActionPlan);
		dto.setResearcherProposalId(researcherProposalActionPlan.getResearcherProposal().getId());
		//dto.setResearcherProposalDto(new ModelMapper().map(researcherProposalActionPlan.getResearcherProposal(), ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherProposalActionPlanResponseDto> getByResearcherProposalId(Long id) {
		List<ResearcherProposalActionPlan> list = repository.findAllByResearcherProposalIdAndIsDeletedOrderByCatWiseActPlanIdAsc(id, false);
		if (list.isEmpty()) {
			return new Response<>() {{
				setSuccess(false);
				setMessage("Data Not Found");
				setObj(null);
			}};
		}
		return new Response<>() {{
			setMessage("Data Found");
			setItems(convertForRead(list));
		}};
	}

	@Transactional
	@Override
	public Response<ResearcherProposalActionPlanResponseDto> saveList(List<ResearcherProposalActionPlanRequestDto> request) {
		try {
			List<ResearcherProposalActionPlanResponseDto> list = new ArrayList<>();
			request.forEach(e -> {
				if (e.getUuid() != null) {
					if (e.getIsDeleted() == 1) {
						delete(e.getUuid());
					} else {
						list.add(new ModelMapper().map(update(e).getObj(), ResearcherProposalActionPlanResponseDto.class));
					}
				} else {
					list.add(new ModelMapper().map(create(e).getObj(), ResearcherProposalActionPlanResponseDto.class));
				}
			});
			return new Response<>() {{
				setSuccess(true);
				setItems(list);
			}};
		} catch (Exception e) {
			log.error("Save not Saved");
			return getErrorResponse("Save Failed");
		}
	}

//	public Response<ResearcherProposalActionPlanResponseDto> saveList(List<ResearcherProposalActionPlanRequestDto> request) {
//		try {
//			List<ResearcherProposalActionPlanResponseDto> list = new ArrayList<>();
//
//			List<ResearcherProposalActionPlanRequestDto> Planlist = new ArrayList<>();
//
//			for(ResearcherProposalActionPlanRequestDto plan : request){
//				if(plan.getUuid() == null){
//					plan.setUuid(UUID.randomUUID().toString());
//				}
//				Planlist.add(plan);
//			}
//			List<ResearcherProposalActionPlanRequestDto> planInfo = repository.saveAll(Planlist);
//
//			//List<EducationInfo> educationInfos1 = educationInfoRepository.saveAll(educationInfos);
//		} catch (Exception e) {
//			log.error("Save not Saved");
//			return getErrorResponse("Save Failed");
//		}
//	}

	public Response<ResearcherProposalActionPlanResponseDto>  saveList2(List<ResearcherProposalActionPlanRequestDto> actionPlans){

		AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder
				.getContext().getAuthentication().getDetails()).getDecodedDetails();

		List<ResearcherProposalActionPlanResponseDto> storeData = new ArrayList<>();

		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findById(actionPlans.get(0).getResearcherProposalId());
		ResearcherProposal researcherProposal1 = researcherProposal.get();

		try{
			for (ResearcherProposalActionPlanRequestDto plan : actionPlans) {
				if (plan.getUuid() != null) {
					Optional<ResearcherProposalActionPlan> data = repository.findByIdAndIsDeleted(plan.getId(), false);
					ResearcherProposalActionPlan model = data.get();
					BeanUtils.copyProperties(plan, model);

//				Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findById(e.getResearcherProposalId());
//				ResearcherProposal researcherProposal1 = researcherProposal.get();
					model.setResearcherProposal(researcherProposal1);
					repository.save(model);
					storeData.add(convertForRead(model));
				}
				else{
					ResearcherProposalActionPlan model = new ResearcherProposalActionPlan();
					BeanUtils.copyProperties(plan, model);
					model.setUuid(UUID.randomUUID().toString());
					model.setResearcherProposal(researcherProposal1);
					model.setCreatedBy(accessTokenDetail.getId());
					model.setCreatedOn(LocalDate.now());
					model.setIsDeleted(false);
					repository.save(model);
					storeData.add(convertForRead(model));
				}
			}
			return new Response<>() {
				{
					setSuccess(true);
					setMessage("Saved Successfully!");
					setItems(storeData);
				}
			};
		}catch (Exception e){
			log.error(e.getMessage());
			//return getErrorResponse("Save Failed");
			return new Response<>() {
				{
					setSuccess(false);
					setMessage("Saved Failed!");
				}
			};
		}

	}
}
