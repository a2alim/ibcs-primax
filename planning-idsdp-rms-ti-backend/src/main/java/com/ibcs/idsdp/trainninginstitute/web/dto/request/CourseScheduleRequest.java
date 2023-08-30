package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseScheduleRequest extends UuidIdHolderRequestBodyDTO{

    private Long id;
    
    private Long proposalId;
    
    private ProposalModel proposalModel;

    private String session;

    private List<Long> speakers;

    private String topic;

    private LocalDate date;

    private String day;

    private String time;
}
