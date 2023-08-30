package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_SPEAKER_EVALUATION")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SpeakerEvaluationModel extends BaseEntity {

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER, targetEntity = ProposalModel.class)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

    @ManyToOne(targetEntity = CourseScheduleModel.class, cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_COURSE_SCHEDULE_ID")
    private CourseScheduleModel courseScheduleModel;

    @ManyToOne(targetEntity = Trainer.class, cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_TRAINER_ID")
    private Trainer trainer;

    @ManyToOne(targetEntity = ParticipantModel.class, cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_PARTICIPANT_ID")
    private ParticipantModel participantModel;


    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name= "M3_SPEAKER_EVALUATION_QUESTION_ID")
    private List<SpeakerEvaluationQuestionModel> speakerEvaluationQuestionModels;

}
