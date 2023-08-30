package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.ParticipantModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.services.ParticipantService;
import com.ibcs.idsdp.trainninginstitute.services.ProposalService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ParticipantRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ParticipantView;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@AllArgsConstructor
@RequestMapping("/participants")
public class ParticipantController {
	
    private final ParticipantService participantService;

    @PostMapping()
    public ResponseEntity<ApiResponse<Long>> createParticipant(@RequestBody ParticipantRequest participantRequest) {
        return participantService.createParticipant(participantRequest);
    }

    @GetMapping()
    public ResponseEntity<PaginationResponse<List<ParticipantModel>>> getParticipantList(@RequestParam(defaultValue = "0") int pageNo,
                                                                                         @RequestParam(defaultValue = "10") int pageSize, @RequestParam(required = false) String name) {
        return participantService.getParticipantList(pageNo, pageSize, name);
    }

    @PutMapping("/{participantId}")
    public ResponseEntity<ApiMessageResponse> editParticipant(@PathVariable Long participantId,
                                                              @RequestBody ParticipantRequest participantRequest){
        return participantService.editParticipant(participantId, participantRequest);
    }

    @DeleteMapping("/{participantId}")
    public ResponseEntity<ApiMessageResponse> deleteParticipant(@PathVariable Long participantId){
        return participantService.deleteParticipant(participantId);
    }

    @GetMapping("/{participantId}")
    public ResponseEntity<ParticipantModel> getParticipant(@PathVariable Long participantId){
        return participantService.getParticipant(participantId);
    }

    @GetMapping("/participants-view/{id}")
    public ResponseEntity<ParticipantView> getParticipantById(@PathVariable Long id){
        return new ResponseEntity(participantService.getParticipantView(id), HttpStatus.OK);
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<List<ParticipantModel>> getParticipantsByCourseId(@PathVariable Long courseId){
        return participantService.getParticipantsByCourseId(courseId);
    }
    
    @GetMapping("/find-by-proposalId/{proposalId}")
    public ResponseEntity<List<ParticipantModel>> getParticipantsByProposalId(@PathVariable("proposalId") Long proposalId){
        return participantService.getParticipantsByProposalId(proposalId);
    }

    @PutMapping("change-complete-status/{participantId}")
    public ResponseEntity<ApiMessageResponse> changeCompleteStatus(@PathVariable Long participantId,
                                                                   @RequestParam boolean completeStatus){
        return participantService.changeCompleteStatus(participantId,completeStatus);
    }


}
