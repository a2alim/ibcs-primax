package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_COURSE_SCHEDULE")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CourseScheduleModel extends BaseEntity {

	private String session;

	@ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.EAGER, targetEntity = ProposalModel.class)
	@JoinColumn(name = "M3_PROPOSAL_ID")
	private ProposalModel proposalModel;

	@ManyToMany(targetEntity = Trainer.class, cascade = { CascadeType.DETACH,
			CascadeType.REFRESH }, fetch = FetchType.EAGER)
	@JoinTable(name = "M3_COURSE_SCHEDULE_M3_TRAINER", joinColumns = @JoinColumn(name = "M3_COURSE_SCHEDULE_ID"), inverseJoinColumns = @JoinColumn(name = "M3_TRAINER_ID"))
	private List<Trainer> speakers;

	private String topic;

	private LocalDate date;

	private String day;

	private String time;

}
