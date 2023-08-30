package com.ibcs.idsdp.rpm.model.domain;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "rms_enothi_approval_files")
public class EnothiApprovalFiles extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = true)
    private Long stFiscalYearId;

    @Column(length = 20, nullable = true)
    private Long stResearchCategoryTypeId;

    @Column(length = 255, nullable = true)
    private String subject;

    @Column(nullable = true)
    private Boolean internalApproval;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String note;

    @Column(length = 50, nullable = true)
    private String dataFor;

    @Column(length = 5000, nullable = true)
    private String bucketName;

    @Column(length = 5000, nullable = true)
    private String fileDownloadUrl;

    @Column(length = 5000, nullable = true)
    private String fileName;

    @Column(length = 30, nullable = true)
    private String dakReceivedNo;

    @Column(nullable = true)
    private Long dakId;

    @Column(nullable = true)
    private Long currentDeskId;

    @Column(nullable = true)
    private Boolean isSent;

    private LocalDate sendingDate;

    private String m1ResearcherProposalUuid;

    @Column(name = "installment_types",nullable = true, columnDefinition = "Text")
    private String installmentTypes;
}
