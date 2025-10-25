import { useMemo, type FC } from "react";

import type { DependencyType } from "../types";

interface Props {
    type: DependencyType;
}

const colors: Record<DependencyType, string> = {
    "obsolete-js": "bg-outdated-bg text-outdated-text",
    "obsolete-node": "bg-outdated-bg text-outdated-text",
    trivial: "bg-trivial-bg text-trivial-text"
};

export const Badge: FC<Props> = ({ type }) => {
    const text = useMemo<string>(() => {
        switch (type) {
            case "obsolete-js":
            case "obsolete-node":
                return "outdated";
            default:
                return type;
        }
    }, [type]);

    const color = useMemo<string>(() => colors[type], [type]);

    return (
        <span
            className={`${color} inline-block self-center rounded-md px-2.5 py-0.5 text-sm font-normal whitespace-nowrap shadow-md`}
        >
            {text}
        </span>
    );
};

export default Badge;
