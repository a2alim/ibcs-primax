package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.AgreementJamanatnama;
import com.ibcs.idsdp.rpm.model.domain.ResearchFinalSubmission;
import com.ibcs.idsdp.rpm.model.repositories.ResearchFinalSubmissionRepository;
import com.ibcs.idsdp.rpm.services.ResearchFinalSubmissionService;
import com.ibcs.idsdp.rpm.services.ResearcherProposalKeyWordService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearchFinalSubmissionRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalKeyWordRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchFinalSubmissionResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ResearchFinalSubmissionServiceImpl extends
		BaseService<ResearchFinalSubmission, ResearchFinalSubmissionRequestDto, ResearchFinalSubmissionResponseDto>
		implements ResearchFinalSubmissionService {

	private final ResearchFinalSubmissionRepository researchFinalSubmissionRepository;
	private final ResearcherProposalKeyWordService researcherProposalKeyWordService;

	protected ResearchFinalSubmissionServiceImpl(ServiceRepository<ResearchFinalSubmission> repository,ResearchFinalSubmissionRepository researchFinalSubmissionRepository, ResearcherProposalKeyWordService researcherProposalKeyWordService) {
		super(repository);
		this.researchFinalSubmissionRepository = researchFinalSubmissionRepository;
		this.researcherProposalKeyWordService = researcherProposalKeyWordService;
	}

	@Override
	public Response<ResearchFinalSubmissionResponseDto> create(ResearchFinalSubmissionRequestDto i) {
		
		String keyWordString = i.getHashTag();
		List<ResearcherProposalKeyWordRequestDto> keyWordRequestList = new ArrayList<ResearcherProposalKeyWordRequestDto>();

		if (!keyWordString.isEmpty() && keyWordString != null) {
			
			String keyWordArray[] = keyWordString.split(",");
			for (Integer start = 0; start < keyWordArray.length; start++) {
				String keyWord = keyWordArray[start];
				keyWordRequestList.add(new ResearcherProposalKeyWordRequestDto() {
					{
						setResearcherProposalId(i.getM1ResearcherProposalId());
						setKeyWord(keyWord);
					}
				});
			}

		}

		if (!CollectionUtils.isEmpty(keyWordRequestList) && keyWordRequestList.size() > 0) {
			researcherProposalKeyWordService.createList(keyWordRequestList);
		}
		
		return super.create(i);
	}

	@Override
	public Response<ResearchFinalSubmissionResponseDto> update(ResearchFinalSubmissionRequestDto i) {

		/*
		String keyWordString = i.getHashTag();
		List<ResearcherProposalKeyWordRequestDto> keyWordRequestList = new ArrayList<ResearcherProposalKeyWordRequestDto>();

		if (!keyWordString.isEmpty() && keyWordString != null) {

			String keyWordArray[] = keyWordString.split(",");
			for (Integer start = 0; start < keyWordArray.length; start++) {
				String keyWord = keyWordArray[start];
				keyWordRequestList.add(new ResearcherProposalKeyWordRequestDto() {
					{
						setResearcherProposalId(i.getM1ResearcherProposalId());
						setKeyWord(keyWord);
					}
				});
			}

		}

		if (!CollectionUtils.isEmpty(keyWordRequestList) && keyWordRequestList.size() > 0) {
			researcherProposalKeyWordService.createList(keyWordRequestList);
		}
		*/
		return super.update(i);
	}

	public Response<ResearchFinalSubmissionResponseDto> findByM1ResearcherProposalId(Long m1ResearcherProposalId) {

		Optional<ResearchFinalSubmission> researchFinalSubmissionOptional = researchFinalSubmissionRepository
				.findByM1ResearcherProposalIdAndIsDeleted(m1ResearcherProposalId, false);
		if (researchFinalSubmissionOptional.isPresent()) {
			return new Response<>() {
				{
					setMessage("Data Found");
					setObj(convertForRead(researchFinalSubmissionOptional.get()));
				}
			};
		}
		return new Response<>() {
			{
				setSuccess(false);
				setMessage("Data Not Found");
				setObj(null);
			}
		};
	}

	public Response submitFinalCompletionReport (Long id){
		try{
			Optional<ResearchFinalSubmission> report = researchFinalSubmissionRepository.findByM1ResearcherProposalIdAndIsDeleted(id, false);
			if(report.isPresent()){
				ResearchFinalSubmission reportVal = report.get();
				reportVal.setIsFinalSubmit(true);
				researchFinalSubmissionRepository.save(reportVal);
				return new Response(){
					{
						setSuccess(true);
						setMessage("Final submit has been saved successfully");
					}
				};
			}
			return new Response(){
				{
					setSuccess(false);
					setMessage("Failed");
				}
			};

		}catch (Exception e){
			return new Response(){
				{
					setSuccess(false);
					setMessage("Failed");
				}
			};
		}
	}

}
