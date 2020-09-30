export const animationToTransition = (
  animation,
  defaultAnimation = { speed: 200, type: 'linear', prop: 'transform' }
) => {
  const { disabled, prop, speed, type } = {
    ...defaultAnimation,
    ...animation
  };

  return !disabled ? `${prop} ${speed}ms ${type}` : '';
};
