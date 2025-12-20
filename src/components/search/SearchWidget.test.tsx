import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchWidget } from "./SearchWidget";
import { type TeaserProps } from "./Teaser.tsx";
import { createMockTile } from "../../../tests/test-utils.ts";

const tiles: TeaserProps[] = [
    createMockTile({ name: "React" }),
    createMockTile({ name: "Vue" }),
    createMockTile({ name: "Angular" })
];

test("should show all tiles with showAllOnEmpty true", async () => {
    render(<SearchWidget tiles={tiles} showAllOnEmpty />);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(3);
});

test("shouldn't show any tiles with showAllOnEmpty false", () => {
    render(<SearchWidget tiles={tiles} showAllOnEmpty={false} />);

    const links = screen.queryAllByRole("link");

    expect(links).toHaveLength(0);
});

test("should filter tiles based on search input", async () => {
    const user = userEvent.setup();

    render(<SearchWidget tiles={tiles} showAllOnEmpty />);

    const input = screen.getByPlaceholderText("Search");

    await user.type(input, "React");

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(1);
    expect(screen.getByText("React")).toBeInTheDocument();
});
