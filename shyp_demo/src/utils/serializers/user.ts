import { userNotificationSerializer } from './';
import { AxiosResponse } from "axios";

export default function(response: AxiosResponse): IUser{
  const data = response.data.data;
  const profile = data.profile;
  return {
    avatar: data.avatar,
    city: profile.city,
    companyName: profile.company_name,
    countryId: profile.country_id,
    email: data.email,
    firstName: data.first_name,
    isActive: data.is_active,
    isDummy: data.is_dummy,
    isFollowingNewShipments: data.follow_new_shipments,
    isStaff: data.is_staff,
    isSuperUser: data.is_super_user,
    lastName: data.last_name,
    number: profile.number,
    permission: data.permission_status,
    phone: profile.phone,
    postalCode: profile.postal_code,
    registrationCountryId: profile.registration_country_id,
    street: profile.street,
    tokenType: response.headers.tokenType,
    username: data.username,
    vatNumber: profile.vat_number,
    id: data.id,
    notifications: (data.user_notifications)
      ? data.user_notifications.map(userNotificationSerializer)
      : []
  };
}