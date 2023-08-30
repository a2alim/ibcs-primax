package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "fs_fyw_sector_sub_sectors_selection")
public class FywSectorSubSectorSection extends BaseEntity {
    @Column(name = "st_fiscal_year_id", length = 20, nullable = false)
    private Long stFiscalYearId;

    @Column(name = "st_sector_type_id", length = 20, nullable = false)
    private Long stSectorTypeId;

    @Column(name = "st_sub_sector_id", length = 255, nullable = false)
    private String stSubSectorId;

    @Column(name = "is_editable", length = 1, nullable = true)
    private Boolean isEditable;

}
