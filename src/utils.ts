export const create_board = (width: number, height: number) => {
  const board_state = [];
  for (let w = 0; w < width; ++w) {
    const row = [];
    for (let h = 0; h < height; ++h) {
      row.push(0);
    }
    board_state.push([...row]);
  }

  return board_state;
};

export const clamp = (val: number, min: number, max: number) => {
  let result = val;
  if (val < min) result = min;
  if (val > max) result = max;
  return result;
};
