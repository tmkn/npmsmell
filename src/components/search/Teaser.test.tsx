import { render, screen } from "@testing-library/react";

import { Teaser } from "./Teaser";
import { createMockTile } from "../../../tests/test-utils";

test("shows package name", () => {
    const data = createMockTile({ name: "Test Package" });
    render(<Teaser {...data} />);

    const linkElement = screen.getByRole("link", { name: /Test Package/ });
    expect(linkElement).toBeInTheDocument();
});

test("shows package description", () => {
    const data = createMockTile({ description: "A test package" });
    render(<Teaser {...data} />);

    const descriptionElement = screen.getByText(/A test package/);
    expect(descriptionElement).toBeInTheDocument();
});

test("shows download count", () => {
    const data = createMockTile({ downloads: 100 });
    render(<Teaser {...data} />);

    const downloadsElement = screen.getByText(/100/);
    expect(downloadsElement).toBeInTheDocument();
});

test("shows dependency count", () => {
    const data = createMockTile({ dependencies: 2 });
    render(<Teaser {...data} />);

    const dependenciesElement = screen.getByText(/2/);
    expect(dependenciesElement).toBeInTheDocument();
});

test("shows tag", () => {
    const data = createMockTile({ type: "trivial" });
    render(<Teaser {...data} />);

    const tagElement = screen.getByText(/trivial/);
    expect(tagElement).toBeInTheDocument();
});

test("highlights matched search term in package name", () => {
    const data = createMockTile({ name: "Test Package", searchString: "Pack" });
    render(<Teaser {...data} />);

    const highlightedElement = screen.getByText(/Pack/);
    expect(highlightedElement).toBeInTheDocument();
    expect(highlightedElement).toHaveClass("decoration-highlight");
});
