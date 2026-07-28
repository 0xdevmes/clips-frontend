import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StyleCard } from "@/components/transform/StyleCard";
import type { TransformStyle } from "@/app/lib/transformStyles";

const baseStyle: TransformStyle = {
  name: "anime",
  label: "Anime",
  description: "Bold outlines, vivid colours, cel-shaded look",
  thumbnail: "/styles/anime.jpg",
  avgDurationSeconds: 45,
};

describe("StyleCard badges (issue #802)", () => {
  it("renders no badges when isPremium/isNew are both absent", () => {
    render(<StyleCard style={baseStyle} onSelect={jest.fn()} />);
    expect(screen.queryByText("New")).not.toBeInTheDocument();
    expect(screen.queryByText("Premium")).not.toBeInTheDocument();
  });

  it("renders a New badge for isNew styles", () => {
    render(<StyleCard style={{ ...baseStyle, isNew: true }} onSelect={jest.fn()} />);
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.queryByText("Premium")).not.toBeInTheDocument();
  });

  it("renders a Premium badge for isPremium styles", () => {
    render(<StyleCard style={{ ...baseStyle, isPremium: true }} onSelect={jest.fn()} />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("renders both badges when a style is both new and premium", () => {
    render(<StyleCard style={{ ...baseStyle, isPremium: true, isNew: true }} onSelect={jest.fn()} />);
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });
});
