package com.ibcs.idsdp.projectconcept.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "pc_justification")
@EntityListeners(AuditingEntityListener.class)
public class Justification extends BaseEntity {

   @OneToOne
   @JoinColumn(name = "project_concept_master_id", nullable = false)
   private ProjectConceptMaster projectConceptMaster;

   private Long typeId;

   private String description;

//   private Long pcProjectSummaryId;

   private Long attachmentId;
}
