package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseScheduleResponse extends UuidIdHolderRequestBodyDTO{

    private Long id;
    
    private Long proposalId;
    
    private ProposalModel proposalModel;

    private String session;

    private List<Trainer> speakers;

    private String topic;

    private LocalDate date;

    private String day;

    private String time;
}
