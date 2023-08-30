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
@Table(name = "m2_create_seminar_send_mail")
public class CreateSeminarSendMail extends BaseEntity {

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "m2_create_seminar_id")
    private CreateSeminar m2CreateSeminarId;

    @Column(name = "receiver_email_address")
    private String receiverEmailAddress;

    @Column(name = "mail_body", columnDefinition = "TEXT")
    private String mailBody;

    @Column(name = "is_send")
    private Boolean isSend;

}
