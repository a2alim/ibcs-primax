package com.ibcs.idsdp.rmsConfigration.model.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
public class ExpertEvaluatorEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eudcationLevel;
    private String subject;
    private String universityOrInstitute;
    private String result;

}
