package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Entity;
import javax.persistence.Table;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_SPEAKER_EVALUATION_QUESTION")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SpeakerEvaluationQuestionModel extends BaseEntity {
    private Long questionId;
    private String rating;
}
