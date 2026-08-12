const calculateEstimatedOneRepMax = (weight, reps) => {
  const numericWeight = Number(weight);
  const numericReps = Number(reps);

  if (
    !Number.isFinite(numericWeight) ||
    !Number.isFinite(numericReps) ||
    numericWeight <= 0 ||
    numericReps <= 0 ||
    numericReps > 12
  ) {
    return 0;
  }

  if (numericReps === 1) {
    return numericWeight;
  }

  return numericWeight * (1 + numericReps / 30);
};

const calculateExerciseStrengthPoints = (oneRepMax, strengthFactor) => {
  const numericOneRepMax = Number(oneRepMax);
  const numericFactor = Number(strengthFactor);

  if (
    !Number.isFinite(numericOneRepMax) ||
    !Number.isFinite(numericFactor) ||
    numericOneRepMax <= 0 ||
    numericFactor <= 0
  ) {
    return 0;
  }

  return Math.round(numericOneRepMax * numericFactor);
};

export { calculateEstimatedOneRepMax, calculateExerciseStrengthPoints };
