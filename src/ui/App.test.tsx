import { afterEach, describe, it, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "./App";

afterEach(() => cleanup());

describe("数独游戏", () => {
  describe("初始化界面", () => {
    it("应该显示游戏标题", () => {
      render(<App />);
      expect(screen.getByRole("heading", { name: "数独" })).toBeDefined();
    });

    it("应该显示 9x9 的数独棋盘", () => {
      render(<App />);
      const board = screen.getByRole("grid", { name: "数独棋盘" });
      expect(board).toBeDefined();
    });

    it("棋盘应该有 81 个格子", () => {
      render(<App />);
      const cells = screen.getAllByRole("gridcell");
      expect(cells).toHaveLength(81);
    });

    it("应该显示数字输入面板", () => {
      render(<App />);
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByRole("button", { name: String(i) })).toBeDefined();
      }
    });
  });
});
