package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.CreateSeminarTimeSchedule;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarTimeScheduleRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarTimeScheduleResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface CreateSeminarTimeScheduleService {

    Response<CreateSeminarTimeSchedule> doSave(List<CreateSeminarTimeScheduleRequestDto> requestDto);
    Response<CreateSeminarTimeSchedule> doUpdate(List<CreateSeminarTimeScheduleRequestDto> requestDto);    
    Boolean seminarIsExists(Long seminarId);    
    Response<CreateSeminarTimeScheduleResponseDto> findAllBySeminarId(Long seminarId);
}
