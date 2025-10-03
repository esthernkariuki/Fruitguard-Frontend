import { render, screen, fireEvent } from "@testing-library/react";
import Button from ".";
import '@testing-library/jest-dom';

describe("Button component", () => {
  it("renders the button with text", () => {
    render(<Button buttonText="Click Me" variant="primary" onClickHandler={() => {}} />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders the icon when passed", () => {
    const Icon = () => <span data-testid="icon">icon</span>;
    render(
      <Button
        buttonText="With Icon"
        variant="secondary"
        onClickHandler={() => {}}
        icon={<Icon />}
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies primary variant styles", () => {
    render(<Button buttonText="Primary" variant="primary" onClickHandler={() => {}} />);
    const button = screen.getByRole("button", { name: /Primary/i });
    expect(button).toHaveClass("bg-[#FFF661] text-[#683929] border-none");
  });

  it("applies secondary variant styles", () => {
    render(<Button buttonText="Secondary" variant="secondary" onClickHandler={() => {}} />);
    const button = screen.getByRole("button", { name: /Secondary/i });
    expect(button).toHaveClass("text-[#683929] border border-[#683929]");
  });

  it("applies default variant styles", () => {
    render(<Button buttonText="Default" variant="default" onClickHandler={() => {}} />);
    const button = screen.getByRole("button", { name: /Default/i });
    expect(button).toHaveClass("bg-[#683929] text-white border-none");
  });

  it("calls onClickHandler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button buttonText="Click Me" variant="primary" onClickHandler={handleClick} />);
    fireEvent.click(screen.getByRole("button", { name: /Click Me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(
      <Button
        buttonText="Custom"
        variant="default"
        onClickHandler={() => {}}
        className="extra-class"
      />
    );
    const button = screen.getByRole("button", { name: /Custom/i });
    expect(button).toHaveClass("extra-class");
  });
});
