package com.ibcs.idsdp.rpm.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rpm.enums.LetterType;
import com.ibcs.idsdp.rpm.enums.Status;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 11/7/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
@Entity
@Table(name = "rms_notifications")
public class Notification extends BaseEntity {

    @Column(nullable = true, length = 255)
    private Long fiscalYearId;

    @Column(nullable = false, length = 255)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;

    @OneToMany(targetEntity = NoteForNotification.class, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "note_for_notification_id")
    private List<NoteForNotification> recipientUserId;

    @Column(nullable = false)
    private Long senderUserId;

    @Column(nullable = false)
    private boolean isSend;
    
    @Column(nullable = false)
    private Integer sendType;
    
    @Column(nullable = true)
    private String messageText;
    
    @Column(nullable = true)
    private String sendTo;
    
    @Column(nullable = true)
    private String sendToMobile;
    
    
    
    
  
    
    
    

}
