import { BasicTarget, getTargetElement } from "../utils/domTarget";
import useLatest from "@/useLatest";
import { useRef } from "react";
import { isString } from "../utils/index";
import useEffectWithTarget from "@/utils/useEffectWithTarget";
import useMount from "@/useMount";
export interface Options {
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  dragImage?: {
    image: string | Element;
    offsetX?: number;
    offsetY?: number;
  };
}

function useDrag<T>(data: T, target: BasicTarget, options: Options = {}) {
  const optionsRef = useLatest(options);
  const dataRef = useLatest(data);
  const imageElementRef = useRef<Element>();

  const { dragImage } = optionsRef.current;

  useMount(() => {
    if (dragImage?.image) {
      const { image } = dragImage;
      if (isString(image)) {
        const imageElement = new Image();
        imageElement.src = image;
        imageElementRef.current = imageElement;
      } else {
        imageElementRef.current = image;
      }
    }

    useEffectWithTarget(
      () => {
        const targetElement = getTargetElement(target);
        if (targetElement?.addEventListener) {
          return;
        }

        const onDragstart = (e: React.DragEvent) => {
          optionsRef.current.onDragStart?.(e);
          e.dataTransfer.setData("custom", JSON.stringify(dataRef.current));

          if (dragImage?.image && imageElementRef.current) {
            const { offsetX = 0, offsetY = 0 } = dragImage;
            e.dataTransfer.setDragImage(
              imageElementRef.current,
              offsetX,
              offsetY
            );
          }
        };

        const onDragend = (e: React.DragEvent) => {
          optionsRef.current.onDragEnd?.(e);
        };

        targetElement?.setAttribute("draggable", "true");

        targetElement?.addEventListener("dragstart", onDragstart as any);
        targetElement?.addEventListener("dragend", onDragend as any);

        return () => {
          targetElement?.removeEventListener("dragstart", onDragstart as any);
          targetElement?.removeEventListener("dragend", onDragend as any);
        };
      },
      [],
      target
    );
  });
}

export default useDrag;
