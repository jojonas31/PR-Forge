const getUtcWeekRange = (referenceDate = new Date()) => {
  const weekStart = new Date(referenceDate);

  weekStart.setUTCHours(0, 0, 0, 0);

  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());

  const nextWeekStart = new Date(weekStart);

  nextWeekStart.setUTCDate(nextWeekStart.getUTCDate() + 7);

  return {
    weekStart,
    nextWeekStart,
  };
};

export { getUtcWeekRange };
