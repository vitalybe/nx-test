import * as React from "react";
import { MutableRefObject, useRef, useState } from "react";
import Tippy, { TippyProps } from "@tippy.js/react";
import * as _ from "lodash";
import { Instance } from "tippy.js";

export interface Props extends TippyProps {
  disabled?: boolean;
  ignoreBoundaries?: boolean;
  tooltipController?: TooltipController;
}

export interface TooltipControlType {
  isOpen: boolean;
  hide: () => void;
  tooltipController: TooltipController;
}

const defaultState = {};
type State = typeof defaultState;

export class Tooltip extends React.Component<Props, State> {
  state: State = defaultState;
  onShow(instance: Instance) {
    this.props.tooltipController?.onShow(instance);
    this.props.onShow?.(instance);
  }

  onHide(instance: Instance) {
    this.props.tooltipController?.onHide();
    this.props.onHide?.(instance);
  }

  render() {
    const tippyProps = _.omit<Props>(this.props, ["disabled", "ignoreBoundaries", "tooltipController"]);
    const content: React.ReactElement | string = tippyProps.content || "";

    return this.props.disabled ? (
      this.props.children
    ) : (
      <Tippy
        interactive
        livePlacement
        performance
        inertia
        arrow
        theme={"light"}
        delay={100}
        size={"small"}
        hideOnClick={false}
        onShow={this.onShow.bind(this)}
        onHide={this.onHide.bind(this)}
        popperOptions={{
          modifiers: {
            preventOverflow: {
              escapeWithReference: this.props.ignoreBoundaries,
            },
          },
        }}
        {...tippyProps}
        content={content}>
        {this.props.children}
      </Tippy>
    );
  }
}

export type UseTooltipOptions = { matchParentWidth?: boolean; minWidth?: number };

class TooltipController {
  constructor(
    public tippyRef: MutableRefObject<Instance | undefined>,
    private options: UseTooltipOptions,
    private callbacks: { onIsOpenChange: (isOpen: boolean) => void }
  ) {}

  onShow(tippyInstance: Instance) {
    this.tippyRef.current = tippyInstance;
    // match tippy width to parent
    if (this.options.matchParentWidth) {
      const popper = tippyInstance.popper as HTMLElement;
      popper.style.width =
        Math.max(this.options.minWidth ?? 0, tippyInstance.reference.getBoundingClientRect().width) + "px";
      popper.style.maxWidth =
        Math.max(this.options.minWidth ?? 0, tippyInstance.reference.getBoundingClientRect().width) + "px";
    }
    this.callbacks.onIsOpenChange(true);
  }

  onHide() {
    this.tippyRef.current = undefined;
    this.callbacks.onIsOpenChange(false);
  }
}

export function useTooltip(options?: UseTooltipOptions): TooltipControlType {
  const tippyRef = useRef<Instance>();
  const [isOpen, setIsOpen] = useState(false);

  const tooltipController = new TooltipController(tippyRef, options ?? {}, {
    onIsOpenChange: (isOpenValue) => setIsOpen(isOpenValue),
  });

  function hide() {
    if (tippyRef.current) {
      tippyRef.current.hide();
    }
  }

  return { tooltipController, isOpen, hide };
}
