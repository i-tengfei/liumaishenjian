import { PlusIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { FC } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

export interface Props {
  onReceive?: (files: File[]) => void;
}

export const Receiver: FC<Props> = (props) => {
  const { onReceive } = props;
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: File[] }) {
        if (onReceive) {
          onReceive(item.files);
        }
      },
      canDrop(item: { files: File[] }) {
        return true;
      },
      hover(item: { files: File[] }) {},
      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [props],
  );

  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop}
      className="w-screen h-screen flex fixed flex-col justify-center items-center pt-16 z-10 select-none"
    >
      <div className="flex w-1/2 justify-center rounded-2xl bg-white bg-opacity-50 p-5">
        <div
          className={`flex justify-center w-full bg-white bg-opacity-75 rounded-xl px-6 py-10 border border-dashed ${classNames(
            {
              'border-gray-300': !isOver,
              'border-red-500 cursor-not-allowed': isOver && !canDrop,
              'border-blue-500': isActive,
            },
          )}`}
        >
          <div className="space-y-1 text-center">
            <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>上传文件</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
              <p className="pl-1">或拖拽到这里</p>
            </div>
            <p className="text-xs text-gray-400">目前仅支持 GLB 文件</p>
          </div>
        </div>
      </div>
    </div>
  );
};
