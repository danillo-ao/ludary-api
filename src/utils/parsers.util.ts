export function stripIdsAndUpdateDate<T extends Record<string, any>>(obj: T | undefined) {
  if (!obj) return undefined;
  const { id: _id, idUser: _idUser, updateDate: _updateDate, ...rest } = obj;
  return rest;
}
