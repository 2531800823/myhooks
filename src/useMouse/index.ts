import useRafState from "@/useRafState";
import { BasicTarget, getTargetElement } from "../utils/domTarget";
import useEventListener from "@/useEventListener";
export interface CursorState {
  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  elementX: number;
  elementY: number;
  elementH: number;
  elementW: number;
  elementPosX: number;
  elementPosY: number;
}

const initState: CursorState = {
  screenX: NaN,
  screenY: NaN,
  clientX: NaN,
  clientY: NaN,
  pageX: NaN,
  pageY: NaN,
  elementX: NaN,
  elementY: NaN,
  elementH: NaN,
  elementW: NaN,
  elementPosX: NaN,
  elementPosY: NaN,
};

function useMouse(target?: BasicTarget) {
  const [state, setState] = useRafState(initState);

  useEventListener(
    "mousemove",
    (event: MouseEvent) => {
      const { screenX, screenY, clientX, clientY, pageX, pageY } = event;

      const newState = {
        screenX,
        screenY,
        clientX,
        clientY,
        pageX,
        pageY,
        elementX: NaN,
        elementY: NaN,
        elementH: NaN,
        elementW: NaN,
        elementPosX: NaN,
        elementPosY: NaN,
      };

      const targetElement = getTargetElement(target);
      if (targetElement) {
        const { left, top, width, height } =
          targetElement.getBoundingClientRect();

        newState.elementPosX = left + window.pageXOffset;
        newState.elementPosY = top + window.pageYOffset;
        newState.elementX = pageX - newState.elementPosX;
        newState.elementY = pageY - newState.elementPosY;
        newState.elementH = height;
        newState.elementW = width;
      }
      setState(newState);
    },
    {
      target: () => document,
    }
  );
  return state;
}

export default useMouse;
