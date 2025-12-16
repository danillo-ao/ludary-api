import { CreateUserDefaultsResponse, UserResponse } from './user.interface';

export class UserHelper {
  composeUserDefaults({ user, ...data }: CreateUserDefaultsResponse): UserResponse {
    const { id: _idBadge, idUser: _idUserBadge, updateDate: _updateDateBadge, ...badges } = data.userBadges;
    const { id: _idMetric, idUser: _idUserMetric, updateDate: _updateDateMetric, ...metrics } = data.userMetrics;
    const { id: _idPrivacy, idUser: _idUserPrivacy, updateDate: _updateDatePrivacy, ...privacy } = data.userPrivacy;
    const { id: _idDiary, idUser: _idUserDiary, updateDate: _updateDateDiary, ...diary } = data.userDiary;
    const { id: _idTL, idUser: _idUserTL, updateDate: _updateDateTL, ...tierList } = data.userTierList;

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
