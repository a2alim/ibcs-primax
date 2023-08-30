package com.ibcs.idsdp.trainninginstitute.services.implementation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.trainninginstitute.client.RmsConfigurationClientService;
import com.ibcs.idsdp.trainninginstitute.client.dto.response.ExpenditureItemRequestDto;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingBudgetModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingBudgetRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.TrainingBudgetService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainingBudgetRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ExpenditureItemResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import com.ibcs.idsdp.util.Response;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TrainingBudgetServiceImpl implements TrainingBudgetService {
    private final TrainingBudgetRepository trainingBudgetRepository;
    private final RandomGanaratorUtils randomGanaratorUtils;
    private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;
    private final LoggedUsersService loggedUsersService;
    private final ProposalRepository proposalRepository;
    private final RmsConfigurationClientService rmsConfigurationClientService;

    @Override
    public ResponseEntity<ApiMessageResponse> createResearchBudget(TrainingBudgetRequest trainingBudgetRequest) {
    	
    	
    	if (trainingBudgetRequest.getExpenditureName() != null && trainingBudgetRequest.getExpenditureName() !="") {
			Response<ExpenditureItemResponseDto> response = rmsConfigurationClientService.findByExpenditureName(trainingBudgetRequest.getExpenditureName());
			if (response.isSuccess() && response.getObj() != null) {
				trainingBudgetRequest.setItemOfExpenditureId(response.getObj().getId());
			} else {
				Response<ExpenditureItemResponseDto> saveResponse = rmsConfigurationClientService						
						.saveExpenditureItem(new ExpenditureItemRequestDto() {
							{
								setActive(true);
								setExpItemsFor("Institute_Items");
								setExpItemsName(trainingBudgetRequest.getExpenditureName());
							}
						});
				
				if (saveResponse.isSuccess() && saveResponse.getObj() != null) {
					trainingBudgetRequest.setItemOfExpenditureId(saveResponse.getObj().getId());
				}
			}
		}
    	
        TrainingBudgetModel trainingBudgetModel = new TrainingBudgetModel();
        trainingBudgetModel.setUuid(randomGanaratorUtils.getUuid());
        BeanUtils.copyProperties(trainingBudgetRequest, trainingBudgetModel);        
        ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, trainingBudgetRequest.getProposalId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal Not Found"));
        trainingBudgetModel.setProposalModel(proposalModel);
        trainingBudgetRepository.save(trainingBudgetModel);
        return new ResponseEntity<>(new ApiMessageResponse(201, "Research Budget Added"), HttpStatus.CREATED);
    }
    
    
    @Override
    public ResponseEntity<ApiMessageResponse> editResearchBudget(Long id, TrainingBudgetRequest trainingBudgetRequest) {
    	
    	if (trainingBudgetRequest.getExpenditureName() != null && trainingBudgetRequest.getExpenditureName() !="") {
			Response<ExpenditureItemResponseDto> response = rmsConfigurationClientService.findByExpenditureName(trainingBudgetRequest.getExpenditureName());
			if (response.isSuccess() && response.getObj() != null) {
				trainingBudgetRequest.setItemOfExpenditureId(response.getObj().getId());
			} else {
				Response<ExpenditureItemResponseDto> saveResponse = rmsConfigurationClientService						
						.saveExpenditureItem(new ExpenditureItemRequestDto() {
							{
								setActive(true);
								setExpItemsFor("Institute_Items");
								setExpItemsName(trainingBudgetRequest.getExpenditureName());
							}
						});
				
				if (saveResponse.isSuccess() && saveResponse.getObj() != null) {
					trainingBudgetRequest.setItemOfExpenditureId(saveResponse.getObj().getId());
				}
			}
		}
    	
        Optional<TrainingBudgetModel> researchBudgetModelOptional = trainingBudgetRepository.findByIdAndIsDeleted(id, false);
        if (researchBudgetModelOptional.isPresent()) {
            TrainingBudgetModel trainingBudgetModel = researchBudgetModelOptional.get();

            BeanUtils.copyProperties(trainingBudgetRequest, trainingBudgetModel);
            proposalRepository.findByIsDeletedAndId(false, trainingBudgetRequest.getProposalId())
                    .ifPresentOrElse(trainingBudgetModel::setProposalModel,
                            () -> {
                                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found.");
                            });
            trainingBudgetRepository.save(trainingBudgetModel);
            return new ResponseEntity<>(new ApiMessageResponse(200, "Research Budget Edited"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Research Budget Found with id: " + id);
        }
    }

    @Override
    public ResponseEntity<PaginationResponse<List<TrainingBudgetModel>>> getResearchBudgetList(String instituteName, int pageNo, int pageSize, Long proposalId) {

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<TrainingBudgetModel> researchBudgetModelPage = trainingBudgetRepository.findAllByIsDeletedAndProposalModel(false, pageable, new ProposalModel() {{setId(proposalId);}});        
        List<TrainingBudgetModel> researchBudgetModeList = researchBudgetModelPage.get().collect(Collectors.toList());
        researchBudgetModelPage = new PageImpl<TrainingBudgetModel>(researchBudgetModeList, pageable, researchBudgetModeList.size());
        
        PaginationResponse<List<TrainingBudgetModel>> paginationResponse = new PaginationResponse<>(
                pageSize, pageNo, researchBudgetModelPage.getContent().size(), researchBudgetModelPage.isLast(),
                researchBudgetModelPage.getTotalElements(), researchBudgetModelPage.getTotalPages(), researchBudgetModelPage.getContent()
        );
        if (researchBudgetModelPage.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Research Budget Found");
        else
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
    }



    @Override
    public ResponseEntity<ApiMessageResponse> deleteResearchBudget(Long id) {
        Optional<TrainingBudgetModel> researchBudgetModelOptional = trainingBudgetRepository.findByIdAndIsDeleted(id, false);
        if (researchBudgetModelOptional.isPresent()) {
        	
            TrainingBudgetModel trainingBudgetModel = researchBudgetModelOptional.get();
            trainingBudgetModel.setIsDeleted(true);
            trainingBudgetRepository.save(trainingBudgetModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Research Budget Deleted"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Research Budget Found with id: " + id);
        }
    }

    @Override
    public ResponseEntity<TrainingBudgetModel> getSingleResearchBudget(Long id) {
        Optional<TrainingBudgetModel> researchBudgetModelOptional = trainingBudgetRepository.findByIdAndIsDeleted(id, false);
        if (researchBudgetModelOptional.isPresent()) {
            TrainingBudgetModel trainingBudgetModel = researchBudgetModelOptional.get();
            return new ResponseEntity<>(trainingBudgetModel, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Research Budget Found with id: " + id);
        }
    }

    @Override
    public ResponseEntity<List<TrainingBudgetModel>> getResearchBudgetListByFiscalYear(Long fiscalYearId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails)SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();

        List<TrainingBudgetModel> trainingBudgetModelList =trainingBudgetRepository.findByFiscalYearIdAndIsDeletedAndM3TrainingInstituteProfileId_UserId(fiscalYearId, false,accessTokenDetail.getId(), sort);
        if (trainingBudgetModelList.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Research Budget Found");
        else
            return new ResponseEntity<>(trainingBudgetModelList, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<TrainingBudgetModel>> getResearchBudgetListByProposalId(Long proposalId) {
    	
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        List<TrainingBudgetModel> trainingBudgetModelList =trainingBudgetRepository.findByProposalModel_IdAndIsDeleted(proposalId, false, sort);

        if (trainingBudgetModelList.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Research Budget Found");
        else
            return new ResponseEntity<>(trainingBudgetModelList, HttpStatus.OK);
    }
}
