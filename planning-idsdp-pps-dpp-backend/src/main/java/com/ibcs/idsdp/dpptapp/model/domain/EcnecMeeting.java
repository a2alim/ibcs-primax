package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ecnec_meeting")
@EntityListeners(AuditingEntityListener.class)
public class EcnecMeeting extends BaseEntity {


    @Column(name="meeting_name", columnDefinition = "TEXT")
    private String meetingName;

    @Column(name="description", columnDefinition = "TEXT")
    private String description;

    @Column(name="meeting_date")
    private LocalDate meetingDate;

    @Column(name="meeting_time")
    private String meetingTime;

    @Column(name="meeting_venue")
    private String meetingVenue;

    @Column(name="status")
    private boolean status;

    @Column(name="file_url")
    private String fileUrl;
}
