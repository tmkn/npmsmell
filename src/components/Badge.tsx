import { useMemo, type FC } from "react";

import type { DependencyType } from "../npm";

interface Props {
    type: DependencyType;
}

const colors: Record<DependencyType, string> = {
    "obsolete-js": "bg-purple-100 text-purple-900",
    "obsolete-node": "bg-purple-100 text-purple-900",
    trivial: "bg-cyan-100 text-cyan-900"
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
            className={`${color} inline-block self-center whitespace-nowrap rounded-md px-2.5 py-0.5 text-sm font-normal shadow-md`}
        >
            {text}
        </span>
    );
};

export default Badge;
