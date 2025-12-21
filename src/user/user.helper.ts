import { stripIdsAndUpdateDate } from 'src/utils/parsers.util';
import { CreateUserDefaultsResponse, UserResponse } from './user.interfaces';

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
}
