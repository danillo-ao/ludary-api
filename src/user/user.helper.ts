import { CreateUserDefaultsResponse, UserResponse } from './user.interface';

export class UserHelper {
  composeUserDefaults({ user, ...data }: CreateUserDefaultsResponse): UserResponse {
    function stripIdsAndUpdateDate<T extends Record<string, any>>(obj: T | undefined) {
      if (!obj) return undefined;
      const { id: _id, idUser: _idUser, updateDate: _updateDate, ...rest } = obj;
      return rest;
    }

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
