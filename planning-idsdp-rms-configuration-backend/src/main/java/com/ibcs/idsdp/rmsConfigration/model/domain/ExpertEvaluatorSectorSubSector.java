package com.ibcs.idsdp.rmsConfigration.model.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="st_sector_sub_sector_for_evaluators")
public class ExpertEvaluatorSectorSubSector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(columnDefinition = "Text")
    private String sector;
    @Column(columnDefinition = "Text")
    private String subSector;

    public ExpertEvaluatorSectorSubSector(String sector, String subSector) {
        this.sector = sector;
        this.subSector = subSector;
    }
}
