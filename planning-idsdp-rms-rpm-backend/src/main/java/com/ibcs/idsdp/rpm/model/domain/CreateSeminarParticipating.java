package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m2_people_participating_seminar")
public class CreateSeminarParticipating extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "m2_create_seminar_id")
    private CreateSeminar m2CreateSeminarId;
    @Column(name = "participants_list", columnDefinition = "TEXT", nullable = false)
    private String participantsList;

}
