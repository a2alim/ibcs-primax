package com.ibcs.idsdp.rpm.model.domain;

import lombok.Data;

import javax.persistence.*;

/**
 * @author moniruzzaman.rony
 * @create 11/7/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
@Entity
@Table(name = "rms_notifications_note")
public class NoteForNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = true)
    private boolean isAccept;

}
