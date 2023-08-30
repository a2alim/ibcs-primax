package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.repositories.AssignEcnecMeetingRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.EcnecMeetingRepository;
import com.ibcs.idsdp.dpptapp.services.AssignEcnecMeetingService;
import com.ibcs.idsdp.dpptapp.services.DppAnnualPhasingCostService;
import com.ibcs.idsdp.dpptapp.services.EcnecMeetingService;
import com.ibcs.idsdp.dpptapp.web.dto.request.AssignEcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.EcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.AssignEcnecMeetingListResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.DetailsEstimatedCostResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.GrandTotalResponse;
import lombok.NonNull;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class AssignEcnecMeetingServiceImpl extends BaseService<AssignEcnecMeeting, AssignEcnecMeetingRequest> implements AssignEcnecMeetingService {

    private final AssignEcnecMeetingRepository repository;
    private final EcnecMeetingRepository ecnecMeetingRepository;
    private final DppObjectiveCostRepository dppRepository;
    private final ProjectConceptClientService pcClientService;
    private final IdGeneratorComponent idGeneratorComponent;
    private final DppAnnualPhasingCostServiceImpl dppAnnualPhasingCostService;


    public AssignEcnecMeetingServiceImpl(ServiceRepository<AssignEcnecMeeting> repository, AssignEcnecMeetingRepository repository1, EcnecMeetingRepository ecnecMeetingRepository, DppObjectiveCostRepository dppRepository, ProjectConceptClientService pcClientService, IdGeneratorComponent idGeneratorComponent, DppAnnualPhasingCostServiceImpl dppAnnualPhasingCostService) {
        super(repository);
        this.repository = repository1;
        this.ecnecMeetingRepository = ecnecMeetingRepository;
        this.dppRepository = dppRepository;
        this.pcClientService = pcClientService;
        this.idGeneratorComponent = idGeneratorComponent;
        this.dppAnnualPhasingCostService = dppAnnualPhasingCostService;
    }

    @Override
    public AssignEcnecMeetingRequest createAssingMeeting(AssignEcnecMeetingRequest request) {
        String uuid = idGeneratorComponent.generateUUID();
        AssignEcnecMeeting assignEcnecMeeting = new AssignEcnecMeeting();
        assignEcnecMeeting.setCreatedBy("user");
        assignEcnecMeeting.setCreatedOn(LocalDate.now());
        assignEcnecMeeting.setIsDeleted(false);
        Optional<EcnecMeeting> ecnecMeeting = ecnecMeetingRepository.findById(request.getEcnecMeetingId());
        EcnecMeeting meeting = ecnecMeeting.get();
        assignEcnecMeeting.setMeetingId(request.getEcnecMeetingId());
        assignEcnecMeeting.setEcnecMeeting(meeting);
        assignEcnecMeeting.setPcId(request.getPcId());
        assignEcnecMeeting.setPcUuid(request.getPcUuid());
        assignEcnecMeeting.setUuid(uuid);
        repository.save(assignEcnecMeeting);
        return request;
    }

    @Override
    public AssignEcnecMeeting findByPcUuidAndIsDeleted(String pcUuid) {
        AssignEcnecMeeting request = repository.findByPcUuidAndIsDeleted(pcUuid, false);
        return request;
    }

    @Override
    protected void convertForUpdate(AssignEcnecMeetingRequest assignEcnecMeetingRequest, AssignEcnecMeeting assignEcnecMeeting) {
        super.convertForUpdate(assignEcnecMeetingRequest, assignEcnecMeeting);
    }

    @Override
    public ResponseEntity<ResponseStatus> deleteAssignMeeting(String pcUuid) {
        AssignEcnecMeeting assignEcnecMeeting = repository.findByPcUuidAndIsDeleted(pcUuid, false);
        assignEcnecMeeting.setIsDeleted(true);
        repository.save(assignEcnecMeeting);
        return new ResponseEntity(new ResponseStatus(1, "Deleted successfully"), HttpStatus.OK);
    }

    @Transactional
    @Override
    public List<AssignEcnecMeetingListResponse> findAllByMeetingId(long meetingId) {

        List<AssignEcnecMeeting> ecnecMeetings = repository.findAllByMeetingIdAndIsDeleted(meetingId, false);
        List<AssignEcnecMeetingListResponse> projectList = new ArrayList<>();
        for(AssignEcnecMeeting ecnecMeeting : ecnecMeetings){
            AssignEcnecMeetingListResponse response = new AssignEcnecMeetingListResponse();
            Optional<DppObjectiveCost> objectiveCostData = dppRepository.findByProjectConceptUuidAndIsDeleted(ecnecMeeting.getPcUuid(), false);
            ProjectConceptResponse pcResponse = pcClientService.getProjectConceptMasterId(ecnecMeeting.getPcUuid());
            DetailsEstimatedCostResponse getDetailsEstimatedCost = dppAnnualPhasingCostService.getDetailsEstimatedCost(ecnecMeeting.getPcUuid());
            DppObjectiveCost dpData = objectiveCostData.get();
            response.setDateCommencement(dpData.getDateCommencement());
            response.setDateCompletion(dpData.getDateCompletion());
            response.setImplementingAgency(dpData.getImplementingAgency());
            response.setMinistryDivision(dpData.getMinistryDivision());

            if(pcResponse.getIsForeignAid() == false && pcResponse.getProjectTypeDTO().getNameEn().toUpperCase() == "DPP" ){
                response.setProjectTitle(dpData.getProjectTitleEn());
                response.setProjectType(pcResponse.getProjectTypeDTO().getNameEn());
            }else{
                response.setProjectTitle(dpData.getProjectTitleBn());
                response.setProjectType(pcResponse.getProjectTypeDTO().getNameBn());
            }
            if(getDetailsEstimatedCost != null){
                response.setTotalAmount(getDetailsEstimatedCost.getGrandTotalResponses().getTotalAmount());
                response.setGobAmount(getDetailsEstimatedCost.getGrandTotalResponses().getGobAmount());
                response.setGobFeAmount(getDetailsEstimatedCost.getGrandTotalResponses().getGobFeAmount());
                response.setOwnFundAmount(getDetailsEstimatedCost.getGrandTotalResponses().getOwnFundAmount());
                response.setOwnFeFundAmount(getDetailsEstimatedCost.getGrandTotalResponses().getOwnFundFeAmount());
                response.setOtherAmount(getDetailsEstimatedCost.getGrandTotalResponses().getOtherAmount());
                response.setOtherFeAmount(getDetailsEstimatedCost.getGrandTotalResponses().getOtherFeAmount());
                double paAmount = getDetailsEstimatedCost.getGrandTotalResponses().getGobThruAmount()+
                                    getDetailsEstimatedCost.getGrandTotalResponses().getSpAcAmount()+
                                    getDetailsEstimatedCost.getGrandTotalResponses().getThruPdAmount()+
                                    getDetailsEstimatedCost.getGrandTotalResponses().getThruDpAmount();
                response.setPaAmount(paAmount);
                double rpaAmount = getDetailsEstimatedCost.getGrandTotalResponses().getThruPdAmount()+
                                    getDetailsEstimatedCost.getGrandTotalResponses().getThruDpAmount();
                response.setRpaAmount(rpaAmount);
            }
            projectList.add(response);
        }
        return projectList;
    }
}
