package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.ExpertEvaluatorConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluator;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluatorSectorSubSector;
import com.ibcs.idsdp.rmsConfigration.services.ExpertEvaluatorService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpertEvaluatorRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpertEvaluatorSectorSubSectorRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestApiController
@AllArgsConstructor
@RequestMapping(ExpertEvaluatorConstant.EXPERT_EVALUATOR)
public class ExpertEvaluatorController {

    final private ExpertEvaluatorService expertEvaluatorService;


    @PostMapping("/create")
    public Response create(@RequestBody ExpertEvaluatorRequestDto expertEvaluatorRequestDto) {
        return expertEvaluatorService.create(expertEvaluatorRequestDto);
    }

    @PutMapping("/update/{id}")
    public Response update(@RequestBody ExpertEvaluatorRequestDto expertEvaluatorRequestDto, @PathVariable("id") Long id) {
        return expertEvaluatorService.update(expertEvaluatorRequestDto, id);

    }

    @GetMapping("/get-list/{id}")
    public Response getById(@PathVariable("id") Long id) {
        return expertEvaluatorService.findById(id);
    }

    @DeleteMapping("/{id}")
    public Response deleteById(@PathVariable("id") Long id) {
        return expertEvaluatorService.deleteById(id);
    }

    @GetMapping("/get-list")
    public Response getAllExpertEvaluator() {

        return expertEvaluatorService.getAllExpertEvaluator();
    }


    public List<ExpertEvaluatorSectorSubSector> findSectorSubSector(ExpertEvaluatorRequestDto expertEvaluatorRequestDto, ExpertEvaluator expertEvaluator) {
        List<ExpertEvaluatorSectorSubSectorRequestDto> expertEvaluatorSectorSubSectorRequestDtoList = expertEvaluatorRequestDto.getSectorSubSectors();
        List<ExpertEvaluatorSectorSubSector> expertEvaluatorSectorSubSectorList = new ArrayList<ExpertEvaluatorSectorSubSector>();
//        expertEvaluatorSectorSubSectorRequestDtoList.forEach(sectorSubSector->{
//            SectorType sectorType = sectorTypeRepository.findById(sectorSubSector.getSector()).get();
//            List<SubSector> subSectors = subSectorRepository.findAllById(Arrays.asList(sectorSubSector.getSubSectors()));
//            ExpertEvaluatorSectorSubSector expertEvaluatorSectorSubSector = new ExpertEvaluatorSectorSubSector(sectorType,subSectors,expertEvaluator);
//            expertEvaluatorSectorSubSectorList.add(expertEvaluatorSectorSubSector);
//        });
        return expertEvaluatorSectorSubSectorList;
    }

    @PostMapping(path = BaseConstant.GET_BY_ID_SET, produces = "application/json")
    public @ResponseBody Response<ExpertEvaluatorResponseDto> getByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO) {
        return expertEvaluatorService.getByIds(requestBodyDTO.getIds());
    }
    
    @GetMapping(path ="/find-by-user-id/{userId}",produces = "application/json")
    public Response findByUserId(@PathVariable("userId") Long userId) {
        return expertEvaluatorService.findByUserId(userId);
    }
    

}
