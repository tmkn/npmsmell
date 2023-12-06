import { component$, useSignal } from "@builder.io/qwik";
import type { DependencyType } from "../npm";

interface Props {
    type: DependencyType;
}

const colors: Record<DependencyType, string> = {
    "obsolete-js": "bg-purple-100 text-purple-900",
    "obsolete-node": "bg-purple-100 text-purple-900",
    trivial: "bg-cyan-100 text-cyan-900"
};

export const Badge = component$<Props>(({ type }) => {
    const text = useSignal<string>(() => {
        switch (type) {
            case "obsolete-js":
            case "obsolete-node":
                return "outdated";
            default:
                return type;
        }
    });

    const color = useSignal<string>(colors[type]);

    return (
        <span
            class={[
                color.value,
                "inline-block self-center font-normal whitespace-nowrap rounded-md px-2.5 py-0.5 text-sm shadow-md"
            ]}
        >
            {text}
        </span>
    );
});

export default Badge;
