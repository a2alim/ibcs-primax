package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.trainninginstitute.model.domain.CompletionReportModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.CompletionReportRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.CourseRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ParticipantRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.services.CompletionReportService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CompletionReportRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.CompletionReportResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class CompletionReportServiceImpl implements CompletionReportService {
	
    private final CompletionReportRepository completionReportRepository;
    private final ProposalRepository proposalRepository;
    private final LoggedUsersService loggedUsersService;
    private final CourseRepository courseRepository;
    private final ParticipantRepository participantRepository;

    @Override
    public ResponseEntity<ApiMessageResponse> createCompletionReport(CompletionReportRequest completionReportRequest) {   	

    	if(completionReportRepository.existsByProposalModel_IdAndIsDeleted(completionReportRequest.getProposalId(), false))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Completion report already exists");
    	
        CompletionReportModel completionReportModel = new CompletionReportModel();
        BeanUtils.copyProperties(completionReportRequest, completionReportModel);

        ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, completionReportRequest.getProposalId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found"));
        completionReportModel.setProposalModel(proposalModel);

        completionReportRepository.save(completionReportModel);
        proposalModel.setIsCompletionReportSubmitted(true);
        proposalRepository.save(proposalModel);

        return new ResponseEntity<>(new ApiMessageResponse(200, "Completion report submitted successfully"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<PaginationResponse<List<CompletionReportResponse>>> getAllCompletionReports(int pageNo, int pageSize) {
    	
        String loggedUserType = loggedUsersService.getLoggedUserType();
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<CompletionReportModel> completionReportModelPage;

        if (loggedUserType.equals("Rms_Training_Institute")) {
            String loggedUserId = loggedUsersService.getLoggedUserId();
            completionReportModelPage = completionReportRepository.findByIsDeletedAndCreatedBy(false, loggedUserId, pageable);
        } else {
            completionReportModelPage = completionReportRepository.findAllByIsDeleted(false, pageable);
        }

        List<CompletionReportResponse> completionReportResponses = new ArrayList<>();
        for (CompletionReportModel completionReportModel : completionReportModelPage.getContent()) {
            CompletionReportResponse completionReportResponse = new CompletionReportResponse();
            BeanUtils.copyProperties(completionReportModel, completionReportResponse);

            //CourseModel courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false, completionReportModel.getProposalModel().getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
            completionReportResponse.setInstituteName(completionReportModel.getProposalModel().getTrainingInstituteProfileModel().getTrainingInstituteName());
            completionReportResponse.setDuration(completionReportModel.getProposalModel().getTrainingDuration());
            //completionReportResponse.setTotalSessions(courseModel.getCourseScheduleModels().size());
            //completionReportResponse.setTotalParticipants(completionReportModel.getProposalModel().getNoOfTrainee());
            completionReportResponse.setFiscalYearId(completionReportModel.getProposalModel().getFiscalYearId());
            Integer totalParticipants = participantRepository.countByProposalModel_Id(completionReportModel.getProposalModel().getId());
            completionReportResponse.setTotalParticipants(totalParticipants);
            completionReportResponses.add(completionReportResponse);
        }

        PaginationResponse<List<CompletionReportResponse>> paginationResponse = new PaginationResponse<>(
                pageSize, pageNo, completionReportModelPage.getContent().size(), completionReportModelPage.isLast(),
                completionReportModelPage.getTotalElements(), completionReportModelPage.getTotalPages(), completionReportResponses
        );

        if (completionReportModelPage.getContent().isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No completion report found");
        else
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> updateCompletionReport(Long completionReportId, CompletionReportRequest completionReportRequest) {
    	
        CompletionReportModel completionReportModel = completionReportRepository.findByIsDeletedAndId(false, completionReportId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Completion report not found"));

        BeanUtils.copyProperties(completionReportRequest, completionReportModel);
        ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, completionReportRequest.getProposalId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found"));
        completionReportModel.setProposalModel(proposalModel);
        completionReportRepository.save(completionReportModel);
        
        return new ResponseEntity<>(new ApiMessageResponse(200, "Completion report updated successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteCompletionReport(Long completionReportId) {
        CompletionReportModel completionReportModel = completionReportRepository.findByIsDeletedAndId(false, completionReportId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Completion report not found"));
        completionReportModel.setIsDeleted(true);
        completionReportRepository.save(completionReportModel);
        return new ResponseEntity<>(new ApiMessageResponse(200, "Completion report deleted successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<CompletionReportModel> getCompletionReport(Long completionReportId) {
        CompletionReportModel completionReportModel = completionReportRepository.findByIsDeletedAndId(false, completionReportId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Completion report not found"));
        return new ResponseEntity<>(completionReportModel, HttpStatus.OK);
    }
}
