import { render } from "@testing-library/react";
import Dashboard from "./";

test("sum", async () => {
  const { getByText } = render(
    <div>
      <h1>Teste</h1>
    </div>
  );
  expect(getByText("Teste")).toBeTruthy();
}, 60);
