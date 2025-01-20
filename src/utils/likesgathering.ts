// 모임 ID 있는지 확인
export const gatheringIdInLikes = (gatheringId: number) => {
  const existingLikes = localStorage.getItem('likes');

  if (!existingLikes) return false;
  const likesSet = new Set(JSON.parse(existingLikes));

  return likesSet.has(gatheringId);
};

// 찜한 모임 집합 JSON 형태로 반환
export const getLikes = (): number[] => {
  const existingLikes = localStorage.getItem('likes');

  return existingLikes
    ? JSON.parse(existingLikes).sort((a: number, b: number) => a - b)
    : [];
};

// 찜한 모임 집합 추가
export const addGatheringId = (gatheringId: number) => {
  const existingLikes = localStorage.getItem('likes');

  const likesSet = existingLikes
    ? new Set(JSON.parse(existingLikes))
    : new Set();

  likesSet.add(gatheringId);

  localStorage.setItem('likes', JSON.stringify(Array.from(likesSet)));
};

// 모임 ID 제거
export const removeGatheringId = (gatheringId: number) => {
  const existingLikes = localStorage.getItem('likes');

  if (!existingLikes) return;
  const likesSet = new Set(JSON.parse(existingLikes));
  likesSet.delete(gatheringId);

  localStorage.setItem('likes', JSON.stringify(Array.from(likesSet)));
};
