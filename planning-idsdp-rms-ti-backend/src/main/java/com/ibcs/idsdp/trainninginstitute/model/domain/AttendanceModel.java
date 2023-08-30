package com.ibcs.idsdp.trainninginstitute.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_ATTENDANCE")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AttendanceModel extends BaseEntity {

    @ManyToOne(targetEntity = ProposalModel.class, cascade = {CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

//    private Long proposalId;

    private LocalDate date;

    @ManyToOne(targetEntity = Trainer.class, cascade = CascadeType.MERGE, fetch = FetchType.EAGER,optional = true)
    @JoinColumn(name = "M3_TRAINER_ID")
    private Trainer trainer;

    @ManyToOne(targetEntity = CourseScheduleModel.class, cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_COURSE_SCHEDULE_ID")
    private CourseScheduleModel courseScheduleModel;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "M3_ATTENDANCE_ID")
    private List<ParticipantAttendanceModel> participantAttendanceModels;

    private boolean editable;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment attendancePhoto;
}
