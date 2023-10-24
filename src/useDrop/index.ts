import { BasicTarget, getTargetElement } from "../utils/domTarget";
import useLatest from "@/useLatest";
import { useRef } from "react";
import useEffectWithTarget from "@/utils/useEffectWithTarget";
export interface Options {
  onFiles?: (files: File[], event?: React.DragEvent) => void;
  onUri?: (url: string, event?: React.DragEvent) => void;
  onDom?: (content: any, event?: React.DragEvent) => void;
  onText?: (text: string, event?: React.ClipboardEvent) => void;
  onDragEnter?: (event?: React.DragEvent) => void;
  onDragOver?: (event?: React.DragEvent) => void;
  onDragLeave?: (event?: React.DragEvent) => void;
  onDrop?: (event?: React.DragEvent) => void;
  onPaste?: (event?: React.ClipboardEvent) => void;
}

function useDrop(target: BasicTarget, Options: Options = {}) {
  const optionRef = useLatest(Options);

  const dragEnterTarget = useRef<any>();

  useEffectWithTarget(
    () => {
      const targetElement = getTargetElement(target);
      if (!targetElement?.addEventListener) {
        return;
      }

      const onData = (
        dataTransfer: DataTransfer,
        event: React.DragEvent | React.ClipboardEvent
      ) => {
        const uri = dataTransfer.getData("text/uri-list");
        const dom = dataTransfer.getData("custom");

        if (dom && optionRef.current.onDom) {
          let data = dom;
          try {
            data = JSON.parse(dom);
          } catch (error) {
            data = dom;
          }

          optionRef.current.onDom(data, event as React.DragEvent);
          return;
        }
        if (uri && optionRef.current.onUri) {
          optionRef.current.onUri(uri, event as React.DragEvent);
          return;
        }
        if (
          dataTransfer.files &&
          dataTransfer.files.length &&
          optionRef.current.onFiles
        ) {
          optionRef.current.onFiles(
            Array.from(dataTransfer.files),
            event as React.DragEvent
          );
          return;
        }

        if (
          dataTransfer.items &&
          dataTransfer.items.length &&
          optionRef.current.onText
        ) {
          dataTransfer.items[0].getAsString((text) => {
            optionRef.current.onText!(text, event as React.ClipboardEvent);
          });
        }
      };

      const onDragEnter = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        dragEnterTarget.current = event.target;
        optionRef.current.onDragEnter?.(event);
      };

      const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        optionRef.current.onDragOver?.(e);
      };

      const onDragLeave = (e: React.DragEvent) => {
        if (e.target === dragEnterTarget.current) {
          optionRef.current.onDragLeave?.(e);
        }
      };

      const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onData(e.dataTransfer, e);
        optionRef.current.onDrop?.(e);
      };
      const onPaste = (e: React.ClipboardEvent) => {
        onData(e.clipboardData, e);
        optionRef.current.onPaste?.(e);
      };

      targetElement.addEventListener("dragenter", onDragEnter as any);
      targetElement.addEventListener("dragover", onDragOver as any);
      targetElement.addEventListener("dragleave", onDragLeave as any);
      targetElement.addEventListener("drop", onDrop as any);
      targetElement.addEventListener("paste", onPaste as any);
    },
    [],
    target
  );
}

export default useDrop;
