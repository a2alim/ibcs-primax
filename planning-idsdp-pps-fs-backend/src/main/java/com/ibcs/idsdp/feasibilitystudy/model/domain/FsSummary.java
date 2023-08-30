package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "feasibility_study_report_master")
@EntityListeners(AuditingEntityListener.class)
public class FsSummary extends BaseEntity {

    private String title_en;

    private String title_bn;

    private String sponsoringMinistry;

    private String executingAgency;

    @Column(columnDefinition = "TEXT")
    private String project_objectives;

    private Double estimated_proj_cost;

    private Long sector_id;

    private Long sub_sector_id;

    private Long project_category_id;

    private Date date_of_commencement;

    private Date date_of_completion;

    private Long projectConceptMasterId;

    private String projectConceptMasterUuid;

    private Long paripatraVersionId;

    private Long dppMasterId;

}
