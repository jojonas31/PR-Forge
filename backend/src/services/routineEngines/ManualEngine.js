class ManualEngine {
  prepareExercises(exercises, routineDay) {
    return exercises.map((ex, index) => ({
      routine_day_id: routineDay.id,
      exercise_id: ex.exercise_id,
      sets: ex.sets,
      reps: ex.reps || null,
      target_time: ex.target_time || null,
      sequence_number: ex.sequence_number ?? index + 1,
    }));
  }
}
export default ManualEngine;
