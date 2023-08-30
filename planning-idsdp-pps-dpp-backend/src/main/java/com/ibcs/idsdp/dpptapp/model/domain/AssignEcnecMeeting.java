package com.ibcs.idsdp.dpptapp.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "assign_ecnec_meeting")
@EntityListeners(AuditingEntityListener.class)
public class AssignEcnecMeeting extends BaseEntity {

    private String pcUuid;
    private Long pcId;
    @OneToOne
    private EcnecMeeting ecnecMeeting;
    private long meetingId;
}
