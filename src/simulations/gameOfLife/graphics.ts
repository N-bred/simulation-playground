const updateGraphicsLoop = () => {
  if (!api) return;
  const { setBackground, rect } = api;

  setBackground();

  const number_of_columns = Math.floor(WIDTH / RECT_SIZE);

  for (let i = 0; i < current_state.length; ++i) {
    const y = Math.floor(i / number_of_columns);
    rect(current_state[i] === 1, i % number_of_columns, y);
  }

  animation_frame = requestAnimationFrame(updateGraphicsLoop);
};
