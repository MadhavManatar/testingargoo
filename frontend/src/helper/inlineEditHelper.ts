export const getSaveButtonDisabled = (
  prev_data: string | number | undefined | null,
  curr_data: string | number | undefined | null
) => {
  if (curr_data) {
    return false;
  }
  if (prev_data) {
    return false;
  }
  return true;
};
