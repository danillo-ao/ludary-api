import { stripIdsAndUpdateDate } from 'src/utils/parsers.util';
import { CreateUserDefaultsResponse, UserMetricsResponse, UserResponse } from './user.interfaces';
import { UserMetrics } from '@prisma/client';

export class UserHelper {
  composeUserDefaults({ user, ...data }: CreateUserDefaultsResponse): UserResponse {
    const badges = stripIdsAndUpdateDate(data.userBadges);
    const metrics = stripIdsAndUpdateDate(data.userMetrics);
    const privacy = stripIdsAndUpdateDate(data.userPrivacy);
    const diary = stripIdsAndUpdateDate(data.userDiary);
    const tierList = stripIdsAndUpdateDate(data.userTierList);

    return {
      ...user,
      badges,
      metrics,
      privacy,
      diary,
      tierList,
    };
  }

  static parseUserMetrics(metrics: UserMetrics): UserMetricsResponse {
    const { id: _id, idUser: _idUser, updateDate: _updateDate, ...rest } = metrics;
    return rest;
  }
}
