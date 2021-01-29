declare global {
  interface IUserNotificationRaw{
    id: number,
    notification_type_id: number,
    notification_type_name: string,
    notification_type_group: string,
    order: number,
    enabled: boolean,
  }
}

export default function(notification: IUserNotificationRaw): IUserNotification{
  return {
    id: notification.id,
    typeId: notification.notification_type_id,
    name: notification.notification_type_name,
    group: notification.notification_type_group,
    order: notification.order,
    enabled: notification.enabled,
  }
}