import { describe, expect, it } from "vitest";
import { rewards } from "../data/catalog";
import {
  credit,
  initialDemo,
  login,
  redeem,
  register,
  useCoupon,
} from "./demo";
const maintenance = rewards.find((r) => r.id === "Zontes-service")!;
describe("RideClub demo lifecycle", () => {
  it("redeems 500 points atomically and preserves the used coupon without a second debit", () => {
    const s = initialDemo();
    const { state, coupon } = redeem(s, "demo-rider", maintenance);
    expect(s.accounts[0].points.Zontes).toBe(1000);
    expect(state.accounts[0].points.Zontes).toBe(500);
    const used = useCoupon(state, coupon.id, "Zontes", true, "Taller demo");
    expect(used.coupons[0].usedAt).toBeDefined();
    expect(used.accounts[0].points.Zontes).toBe(500);
    expect(() =>
      useCoupon(used, coupon.id, "Zontes", true, "Taller demo"),
    ).toThrow("ya fue utilizado");
  });
  it("rejects insufficient balance, another workshop brand, missing consent and expiry", () => {
    const s = initialDemo();
    expect(() =>
      redeem(
        s,
        "demo-rider",
        rewards.find((r) => r.brand === "NIU")!,
      ),
    ).toThrow("Necesitas");
    const { state, coupon } = redeem(
      s,
      "demo-rider",
      maintenance,
      new Date("2026-01-01"),
    );
    expect(() =>
      useCoupon(
        state,
        coupon.id,
        "NIU",
        true,
        "Taller",
        new Date("2026-01-02"),
      ),
    ).toThrow("otra marca");
    expect(() =>
      useCoupon(
        state,
        coupon.id,
        "Zontes",
        false,
        "Taller",
        new Date("2026-01-02"),
      ),
    ).toThrow("autoriza");
    expect(() =>
      useCoupon(
        state,
        coupon.id,
        "Zontes",
        true,
        "Taller",
        new Date("2026-04-01"),
      ),
    ).toThrow("vencido");
  });
  it("does not issue a coupon after the last demo slot is taken", () => {
    const one = { ...maintenance, stock: 1 };
    const { state } = redeem(initialDemo(), "demo-rider", one);
    expect(() => redeem(state, "demo-rider", one)).toThrow("agotó");
    expect(state.coupons).toHaveLength(1);
  });
  it("creates unique eight-digit referral numbers and no blockchain wallet or initial points", () => {
    let s = register(
      initialDemo(),
      "Ana",
      " ANA@example.com ",
      "NIU",
      "10002026",
    );
    const ana = s.accounts[1];
    expect(ana.email).toBe("ana@example.com");
    expect(ana.code).toMatch(/^\d{8}$/);
    expect(ana.wallet.status).toBe("pending");
    expect(ana.points.NIU).toBe(0);
    s = register(s, "Luis", "luis@example.com", "Kiden", "");
    expect(s.accounts[2].code).not.toBe(ana.code);
    expect(() => register(s, "Ana", "ana@example.com", "NIU", "")).toThrow(
      "ya tiene",
    );
    expect(() =>
      register(s, "Eva", "eva@example.com", "NIU", "99999999"),
    ).toThrow("No encontramos");
    expect(login(s, "ana@example.com").currentId).toBe(ana.id);
  });
  it("rewards the inviter only after a confirmed activity and prevents repeat referral awards", () => {
    const s = register(
      initialDemo(),
      "Ana",
      "ana@example.com",
      "NIU",
      "10002026",
    );
    const ana = s.accounts[1];
    expect(s.accounts[0].points.NIU).toBe(0);
    expect(() => credit(s, ana.id, "NIU", "Referido", "SALE-1", false)).toThrow(
      "Confirma",
    );
    const next = credit(s, ana.id, "NIU", "Referido", "SALE-1", true);
    expect(next.accounts[0].points.NIU).toBe(200);
    expect(next.accounts[1].points.NIU).toBe(0);
    expect(() =>
      credit(next, ana.id, "NIU", "Referido", "SALE-2", true),
    ).toThrow("ya recibió");
  });
  it("rejects duplicate references per brand even for different customers", () => {
    const s = register(initialDemo(), "Ana", "ana@example.com", "NIU", "");
    const credited = credit(
      s,
      s.accounts[1].id,
      "NIU",
      "Compra",
      "invoice-2",
      true,
    );
    expect(credited.accounts[1].points.NIU).toBe(1000);
    expect(() =>
      credit(credited, "demo-rider", "NIU", "Compra", " INVOICE-2 ", true),
    ).toThrow("ya fue acreditada");
    expect(
      credit(credited, "demo-rider", "Kiden", "Compra", "INVOICE-2", true)
        .accounts[0].points.Kiden,
    ).toBe(1000);
  });
});
