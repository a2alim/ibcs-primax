package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.enums.AwardLetterStatus;
import com.ibcs.idsdp.trainninginstitute.model.domain.AwardLetterModel;
import com.ibcs.idsdp.trainninginstitute.services.AwardLetterService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AwardLetterRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/award-letter")
public class AwardLetterController {
    private final AwardLetterService awardLetterService;

    @PostMapping
    public ResponseEntity<ApiMessageResponse> createAwardLetter(@RequestBody AwardLetterRequest awardLetterRequest){
        return awardLetterService.createAwardLetter(awardLetterRequest);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<List<AwardLetterModel>>> getAwardLetters(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return awardLetterService.getAwardLetters(page, size);
    }

    @GetMapping("/{fiscalYearId}/{proposalId}")
    public ResponseEntity<BooleanValueHolderDTO> proposalIsExist(@PathVariable Long fiscalYearId, @PathVariable Long proposalId ){
        return awardLetterService.doCheckProposalIsExist(fiscalYearId, proposalId);
    }

    @PutMapping("/{awardLetterId}")
    public ResponseEntity<ApiMessageResponse> updateAwardLetter(@PathVariable Long awardLetterId, @RequestBody AwardLetterRequest awardLetterRequest){
        return awardLetterService.updateAwardLetter(awardLetterId, awardLetterRequest);
    }

    @DeleteMapping("/{awardLetterId}")
    public ResponseEntity<ApiMessageResponse> deleteAwardLetter(@PathVariable Long awardLetterId){
        return awardLetterService.deleteAwardLetter(awardLetterId);
    }

    @GetMapping("/{awardLetterId}")
    public ResponseEntity<AwardLetterModel> getAwardLetter(@PathVariable Long awardLetterId){
        return awardLetterService.getAwardLetter(awardLetterId);
    }

    @PutMapping("/change-status/{awardLetterId}")
    public ResponseEntity<ApiMessageResponse> changeStatus(@PathVariable Long awardLetterId, @RequestParam AwardLetterStatus status){
        return awardLetterService.changeStatus(awardLetterId, status);
    }
}
