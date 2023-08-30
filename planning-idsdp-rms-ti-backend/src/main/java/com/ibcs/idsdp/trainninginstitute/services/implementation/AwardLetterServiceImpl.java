package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.trainninginstitute.enums.AwardLetterStatus;
import com.ibcs.idsdp.trainninginstitute.model.domain.AwardLetterModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.AwardLetterRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.services.AwardLetterService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AwardLetterRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class AwardLetterServiceImpl implements AwardLetterService {
    private final AwardLetterRepository awardLetterRepository;
    private final ProposalRepository proposalRepository;
    private final LoggedUsersService loggedUsersService;

    @Override
    public ResponseEntity<ApiMessageResponse> createAwardLetter(AwardLetterRequest awardLetterRequest) {
        ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, awardLetterRequest.getProposalId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found with id: " + awardLetterRequest.getProposalId()));

        AwardLetterModel awardLetterModel = new AwardLetterModel();
        BeanUtils.copyProperties(awardLetterRequest, awardLetterModel);
        awardLetterModel.setProposalModel(proposalModel);
        awardLetterModel.setStatus(AwardLetterStatus.Pending);

        awardLetterRepository.save(awardLetterModel);

        return new ResponseEntity<>(new ApiMessageResponse(201, "Award Letter created successfully"), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<PaginationResponse<List<AwardLetterModel>>> getAwardLetters(int page, int size) {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails)
                SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<AwardLetterModel> awardLetterModelPage;

        if (loggedUsersService.getLoggedUserType().equals("Rms_DO")) {
            awardLetterModelPage = awardLetterRepository.findAllByIsDeleted(pageable, false);
        } else {
            String loggedUserId = loggedUsersService.getLoggedUserId();
            awardLetterModelPage = awardLetterRepository.findAllByProposalModel_TrainingInstituteProfileModel_IdAndIsDeleted(loggedUserId, false, pageable);
        }

        PaginationResponse<List<AwardLetterModel>> paginationResponse = new PaginationResponse<>(
                size, page, awardLetterModelPage.getContent().size(), awardLetterModelPage.isLast(), awardLetterModelPage.getTotalElements(),
                awardLetterModelPage.getTotalPages(), awardLetterModelPage.getContent()
        );

        if (awardLetterModelPage.getContent().isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No award letter found");
        else
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<ApiMessageResponse> updateAwardLetter(Long awardLetterId, AwardLetterRequest awardLetterRequest) {
        AwardLetterModel awardLetterModel = awardLetterRepository.findById(awardLetterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Award Letter not found with id: " + awardLetterId));
        BeanUtils.copyProperties(awardLetterRequest, awardLetterModel);

        ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, awardLetterRequest.getProposalId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found with id: " + awardLetterRequest.getProposalId()));

        awardLetterModel.setProposalModel(proposalModel);
        awardLetterRepository.save(awardLetterModel);

        return new ResponseEntity<>(new ApiMessageResponse(200, "Award Letter updated successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteAwardLetter(Long awardLetterId) {
        AwardLetterModel awardLetterModel = awardLetterRepository.findById(awardLetterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Award Letter not found with id: " + awardLetterId));

        awardLetterModel.setIsDeleted(true);
        awardLetterRepository.save(awardLetterModel);

        return new ResponseEntity<>(new ApiMessageResponse(200, "Award Letter deleted successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<AwardLetterModel> getAwardLetter(Long awardLetterId) {
        AwardLetterModel awardLetterModel = awardLetterRepository.findById(awardLetterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Award Letter not found with id: " + awardLetterId));

        return new ResponseEntity<>(awardLetterModel, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> changeStatus(Long awardLetterId, AwardLetterStatus status) {
        AwardLetterModel awardLetterModel = awardLetterRepository.findById(awardLetterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Award Letter not found with id: " + awardLetterId));

        awardLetterModel.setStatus(status);
        awardLetterRepository.save(awardLetterModel);

        return new ResponseEntity<>(new ApiMessageResponse(200, "Award Letter status updated successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<BooleanValueHolderDTO> doCheckProposalIsExist(Long fiscalYearId, Long proposalId) {
        Optional<ProposalModel> proposalModel = proposalRepository.findById(proposalId);
        BooleanValueHolderDTO valueHolderDTO=new BooleanValueHolderDTO();
        if(proposalModel.isPresent()){
          AwardLetterModel awardLetterModel= awardLetterRepository.findByFiscalYearIdAndProposalModelAndIsDeleted(fiscalYearId,proposalModel.get(),false);
          if(awardLetterModel!=null){
              valueHolderDTO.setSuccess(true);
              valueHolderDTO.setMessage("Training Title Already Exist!!");

          }else{
              valueHolderDTO.setSuccess(false);
              valueHolderDTO.setMessage("There are Not any Training Titles Found!!");
            }
        }
        return new ResponseEntity<>(valueHolderDTO,HttpStatus.OK);
    }
}
