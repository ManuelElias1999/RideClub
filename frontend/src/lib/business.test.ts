import { describe, expect, it } from "vitest";
import { enterAdminDemo, initialDemo, login } from "./demo";
import { readBusiness, saveBike, saveCompany } from "./business";

describe("RideClub business dashboards", () => {
  it("lets the global admin register and publish a company", () => {
    const admin = enterAdminDemo(initialDemo());
    const next = saveCompany(admin, {
      name: "Demo Motors",
      email: "empresa@demo.com",
      subtitle: "Muévete diferente",
      logo: "/assets/motorcycle-placeholder.svg",
      color: "#123456",
      url: "https://example.com",
      status: "active",
    });
    expect(next.companies.find((c) => c.name === "Demo Motors")?.status).toBe(
      "active",
    );
    expect(next.audit[0].action).toBe("Empresa registrada");
  });

  it("creates a company session from its assigned email and scopes its data", () => {
    let state = enterAdminDemo(initialDemo());
    state = saveCompany(state, {
      name: "Demo Motors",
      email: "empresa@demo.com",
      subtitle: "Muévete diferente",
      logo: "/assets/motorcycle-placeholder.svg",
      color: "#123456",
      url: "https://example.com",
      status: "active",
    });
    state = login(state, "empresa@demo.com");
    const view = readBusiness(state);
    expect(view.companies.map((c) => c.name)).toEqual(["Demo Motors"]);
    expect(() => readBusiness(state, "Zontes")).toThrow(
      "No puedes consultar otra empresa",
    );
  });

  it("prevents a company from adding a motorcycle to another company", () => {
    const state = login(initialDemo(), "zontes@gmail.com");
    const niu = state.companies.find((c) => c.name === "NIU")!;
    expect(() =>
      saveBike(state, niu.id, {
        name: "Modelo ajeno",
        category: "Urbana",
        tag: "Demo",
        description: "No debe poder guardarse",
        image: "/assets/motorcycle-placeholder.svg",
        price: 1000,
        source: "https://example.com",
        region: "Bolivia",
        specs: [],
      }),
    ).toThrow("No tienes acceso");
  });
});
