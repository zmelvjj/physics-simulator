export let inertial: {
  friction: number;
  frictionAir: number;
  frictionStatic: number;
} = {
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
};

export const setInertial = (
  friction: number,
  frictionAir: number,
  frictionStatic: number,
) => {
  inertial = {
    friction,
    frictionAir,
    frictionStatic,
  };
};
