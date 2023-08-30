package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "fs_fiscal_year_wise_sector_sub_sectors")
public class FywSectorSubSector extends BaseEntity {

    @Column(name = "st_fiscal_year_id", length = 20, nullable = false)
    private Long stFiscalYearId;

    @Column(name = "letter_for", length = 50, nullable = true)
    private String letterFor;

    @Column(name = "memorandum_no", length = 255, nullable = true)
    private String memorandumNo;

    @Column(name = "advertisement_start_date", nullable = true)
    private LocalDate advertisementStartDate;

    @Column(name = "advertisement_end_date", nullable = true)
    private LocalDate advertisementEndDate;

    @Column(columnDefinition = "TEXT", name = "paragraph1", nullable = true)
    private String paragraph1;

    @Column(columnDefinition = "TEXT", name = "paragraph2", nullable = true)
    private String paragraph2;

    @Column(columnDefinition = "TEXT", name = "nitimala_url", nullable = true)
    private String nitimalaUrl;

    @Column(name = "nitimala_year", length = 10)
    private String nitimalaYear;

    @Column(name = "file_download_url", length = 255, nullable = true)
    private String fileDownloadUrl;

    @Column(name = "bucket_name", length = 255, nullable = true)
    private String bucketName;

    @Column(name = "file_name", length = 255, nullable = true)
    private String fileName;

    @Column(length = 20)
    private Long phdCatId;

    private Double phdCatBudgetAmount;

    @Column(length = 20)
    private Long mphilCatId;

    private Double mphilCatBudgetAmount;

    @Column(length = 20)
    private Long fellowCatId;

    private Double fellowCatBudgetAmount;

    @Column(length = 20)
    private Long promoCatId;

    private Double promoCatBudgetAmount;

    @Column(length = 20)
    private Long instCatId;

    private Double instCatBudgetAmount;


    private LocalDate tiApplicationStartDate;
    private LocalDate tiApplicationEndDate;
    private Double tiBudgetAmount;

    @Column(name = "is_editable", nullable = true)
    private Boolean isEditable;

    @Column(name = "is_active", nullable = true)
    private Boolean isActive;

    @Transient
    private String fiscalyear;
}
