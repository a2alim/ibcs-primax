package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rdpp_annexure_vb_amount")
public class AnxFiveBAmount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Double gobAmount;

    @NotNull
    private Double gobFeAmount;

    @NotNull
    private Double paAmount;

    @NotNull
    private Double paRpaAmount;

    @NotNull
    private Double ownFundAmount;

    @NotNull
    private Double ownFeAmount;

    @NotNull
    private Double othersAmount;

    @NotNull
    private Double otherFeAmount;

    @NotNull
    private Double totalAmount;

    @NotNull
    private String projectConceptUuid;
}
