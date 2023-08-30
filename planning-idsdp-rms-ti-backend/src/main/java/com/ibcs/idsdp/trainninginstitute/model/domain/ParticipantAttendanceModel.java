package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_PARTICIPANT_ATTENDANCE")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ParticipantAttendanceModel extends BaseEntity {

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER, targetEntity = ParticipantModel.class)
    @JoinColumn(name = "M3_PARTICIPANT_ID")
    private ParticipantModel participantModel;

    private Boolean isPresent;

    private String speakerComment;
}
