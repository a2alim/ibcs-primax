package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.NotificationNoteRequest;
import com.ibcs.idsdp.rpm.web.dto.request.NotificationRequest;
import com.ibcs.idsdp.util.Response;

/**
 * @author moniruzzaman.rony
 * @create 11/7/21
 * @github `https://github.com/moniruzzamanrony`
 */
public interface NotificationService {

    Response createNotification(NotificationRequest notificationRequest);
    
    Response sendNotifications(Long notificationId);

    Response addNoteForNotification(Long notificationId,NotificationNoteRequest notificationNoteRequest);

    Response updateNotifications(Long notificationId,NotificationRequest notificationRequest);

    Response getNotificationsByNotificationId(Long notificationId);

    Response getNotifications();
}
