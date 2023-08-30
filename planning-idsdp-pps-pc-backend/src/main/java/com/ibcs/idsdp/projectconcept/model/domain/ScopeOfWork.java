package com.ibcs.idsdp.projectconcept.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "pc_scope_of_work")
@EntityListeners(AuditingEntityListener.class)
public class ScopeOfWork extends BaseEntity {

   @OneToOne
   @JoinColumn(name = "project_concept_master_id", nullable = false)
   private ProjectConceptMaster projectConceptMaster;

   private Long taskTypeId;

   private String taskDetails;

   private Date startDate;

   private Date endDate;

   private Long attachmentId;

//   private Long pcProjectSummaryId;
}
