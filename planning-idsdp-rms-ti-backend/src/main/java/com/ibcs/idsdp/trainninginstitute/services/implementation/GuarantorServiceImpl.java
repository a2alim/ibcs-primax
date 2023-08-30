package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.GuarantorModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ParticipantModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.CourseRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.GuarantorRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.GuarantorService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GuarantorRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.UploadGuarantorFileReguest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.Data;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Data
public class GuarantorServiceImpl implements GuarantorService {

    private final GuarantorRepository guarantorRepository;
    private final RandomGanaratorUtils randomGanaratorUtils;
    private final CourseRepository courseRepository;
    private final ProposalRepository proposalRepository;
    private final LoggedUsersService loggedUsersService;

    @Override
    public ResponseEntity<ApiMessageResponse> addGuarantor(GuarantorRequest guarantorRequest) {

        GuarantorModel guarantorModel = new GuarantorModel();
        guarantorModel.setUuid(randomGanaratorUtils.getUuid());

        BeanUtils.copyProperties(guarantorRequest, guarantorModel);

        Optional<ProposalModel> proposalModelOptional = proposalRepository.findByIsDeletedAndId(false, guarantorRequest.getProposalId());
        if (proposalModelOptional.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found with ID: " + guarantorRequest.getProposalId());

        boolean isGuarantorExist = guarantorRepository.existsByIsDeletedAndProposalModel(false, proposalModelOptional.get());

        if(isGuarantorExist)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guarantor Already Exist for this Proposal");

        guarantorModel.setProposalModel(proposalModelOptional.get());

        guarantorRepository.save(guarantorModel);

        return new ResponseEntity<>(new ApiMessageResponse(201, "New Guarantor Created!"), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<PaginationResponse<List<GuarantorModel>>> getGuarantor(int pageNo, int pageSize, String guarantorName) {
//        Sort sort = Sort.by(Sort.Direction.ASC, "createdOn");
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize);

        Page<GuarantorModel> guarantorModelPage;

        if (guarantorName == null)
            guarantorModelPage = guarantorRepository.findByIsDeleted(false, pageable);
        else {
            guarantorModelPage = guarantorRepository.findByIsDeletedAndGuarantorNameContainsIgnoreCase(false, guarantorName, pageable);
        }
        List<GuarantorModel>  guarantorModelList= guarantorModelPage.getContent();
        if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
            guarantorModelList=  guarantorModelList.stream().filter(res-> res.getCreatedBy().equals(loggedUsersService.getLoggedUserId())).collect(Collectors.toList());

            Pageable paging = PageRequest.of(pageNo, pageSize);
            int start = Math.min((int)paging.getOffset(), guarantorModelList.size());
            int end = Math.min((start + paging.getPageSize()), guarantorModelList.size());

            guarantorModelPage = new PageImpl<GuarantorModel>(guarantorModelList.subList(start, end), paging, guarantorModelList.size());
        }
        PaginationResponse<List<GuarantorModel>> paginationResponse = new PaginationResponse<>(
                pageNo, pageSize, guarantorModelPage.getContent().size(), guarantorModelPage.isLast(),
                guarantorModelPage.getTotalElements(), guarantorModelPage.getTotalPages(), guarantorModelPage.getContent()
        );

        if (guarantorModelPage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found");
        } else {
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> updateGuarantorById(Long guarantorId, GuarantorRequest guarantorRequest) {
        Optional<GuarantorModel> guarantorModelOptional = guarantorRepository.findByIsDeletedAndId(false, guarantorId);
        if (guarantorModelOptional.isPresent()) {
            GuarantorModel guarantorModel = guarantorModelOptional.get();

            BeanUtils.copyProperties(guarantorRequest, guarantorModel);

            Optional<ProposalModel> proposalModelOptional = proposalRepository.findByIsDeletedAndId(false, guarantorRequest.getProposalId());
            if (proposalModelOptional.isEmpty())
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found with ID: " + guarantorRequest.getProposalId());

            guarantorModel.setProposalModel(proposalModelOptional.get());

            guarantorRepository.save(guarantorModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Guarantor Updated!"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found with ID " + guarantorId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteGuarantorById(Long guarantorId) {
        Optional<GuarantorModel> guarantorModelOptional = guarantorRepository.findByIsDeletedAndId(false, guarantorId);
        if (guarantorModelOptional.isPresent()) {
            GuarantorModel guarantorModel = guarantorModelOptional.get();
            guarantorModel.setIsDeleted(true);

            guarantorRepository.save(guarantorModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Guarantor Deleted!"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found with ID " + guarantorId);
        }
    }

    @Override
    public ResponseEntity<GuarantorModel> getGuarantorById(Long guarantorId) {
        Optional<GuarantorModel> guarantorModelOptional = guarantorRepository.findByIsDeletedAndId(false, guarantorId);
        if (guarantorModelOptional.isPresent()) {
            GuarantorModel guarantorModel = guarantorModelOptional.get();

            return new ResponseEntity<>(guarantorModel, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found with ID: " + guarantorId);
        }
    }

    @Override
    public ResponseEntity<GuarantorModel> getGuarantorByProposalId(Long proposalId) {
        GuarantorModel  guarantorModel = guarantorRepository.findByIsDeletedAndProposalModel_Id(false, proposalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found with Proposal ID: " + proposalId));

        return new ResponseEntity<>(guarantorModel, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> uploadFile(Long guarantorId, UploadGuarantorFileReguest uploadGuarantorFileReguest) {
        Optional<GuarantorModel> guarantorModelOptional = guarantorRepository.findByIsDeletedAndId(false, guarantorId);
        if (guarantorModelOptional.isPresent()){
            GuarantorModel guarantorModel = guarantorModelOptional.get();
            guarantorModel.setUploadFile(uploadGuarantorFileReguest.getUploadFile());
            guarantorRepository.save(guarantorModel);
            return new ResponseEntity<>(new ApiMessageResponse(200,"Guarantor File Uploaded Successfully"),HttpStatus.OK);
        }
        else return new ResponseEntity<>(new ApiMessageResponse(404, "Guarantor Not Found or Deleted"),HttpStatus.NOT_FOUND);
    }

}
